"""
scraper.py — Scraper artisans multi-régions pour DIY Builder
=============================================================
Source  : API officielle recherche-entreprises.api.gouv.fr (SIRENE)
Passe 1 : SIRENE → entreprises filtrées par codes NAF artisan bois + région
Passe 2 : Pour chaque entreprise → cherche le site web via DuckDuckGo HTML
Passe 3 : Visite le site → extrait l'email depuis la page Contact
Sortie  : artisans.csv (append progressif, relançable sans doublons)

Usage :
    python3 scraper.py

Pas de clé API requise. Tout est en accès libre.
"""

import csv
import os
import re
import time
import random
import logging
from urllib.parse import urljoin, urlparse, quote_plus

import requests
from bs4 import BeautifulSoup

# ── Logging ──────────────────────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  %(levelname)-7s %(message)s",
    datefmt="%H:%M:%S",
)
log = logging.getLogger(__name__)

# ── Config ────────────────────────────────────────────────────────────────────

# Codes NAF pertinents pour DIY Builder (format API avec point)
# 43.91A = Charpente, 43.32A = Menuiserie bois/PVC, 43.39Z = Autres finitions
NAF_CODES = ["43.91A", "43.32A", "43.39Z"]

# Régions cibles : code INSEE → {label, set de départements}
REGIONS = {
    "11": {
        "label": "Île-de-France",
        "depts": {"75", "77", "78", "91", "92", "93", "94", "95"},
    },
    "75": {
        "label": "Nouvelle-Aquitaine",
        "depts": {"16", "17", "19", "23", "24", "33", "40", "47", "64", "79", "86", "87"},
    },
}

RESULTS_TARGET   = 300  # arrêt global (toutes régions confondues)
MAX_PER_NAF      = 120  # entreprises max par (NAF × région) — assez large pour paginer au-delà des doublons
DELAY_API_MIN     = 1.0   # délai entre appels API SIRENE
DELAY_API_MAX     = 2.5
DELAY_DDG_MIN     = 3.0   # délai entre recherches DuckDuckGo (respecter le rate-limit)
DELAY_DDG_MAX     = 6.0
DELAY_SITE_MIN    = 1.5   # délai entre visites de sites artisans
DELAY_SITE_MAX    = 3.5
REQUEST_TIMEOUT   = 12

OUTPUT_CSV = os.path.join(os.path.dirname(__file__), "artisans.csv")
CSV_FIELDS = [
    "nom", "dirigeant", "adresse", "code_postal", "commune",
    "departement", "region", "naf", "siret",
    "site_web", "email",
    "telephone",        # si trouvé sur le site
    "source",
]

# ── Headers navigateur ────────────────────────────────────────────────────────

UA = (
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
    "AppleWebKit/537.36 (KHTML, like Gecko) "
    "Chrome/124.0.0.0 Safari/537.36"
)

HEADERS_BROWSER = {
    "User-Agent": UA,
    "Accept-Language": "fr-FR,fr;q=0.9,en;q=0.8",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
}

# ── Regex ─────────────────────────────────────────────────────────────────────

EMAIL_RE = re.compile(r"[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}", re.I)
PHONE_RE = re.compile(r"0[1-9](?:[\s.\-]?\d{2}){4}")

EMAIL_BLACKLIST = {
    "example.com", "exemple.fr", "sentry.io", "wixpress.com",
    "jquery.com", "google.com", "facebook.com", "instagram.com",
    "wordpress.org", "schema.org", "w3.org", "cloudflare.com",
    "gmail.com", "hotmail.fr", "yahoo.fr",  # génériques — pas le mail pro
    # ── Annuaires / agrégateurs (email placeholder ou générique) ──
    "prosmaison.fr",        # votre@email.com — placeholder
    "donizo.com",           # contact@donizo.com — annuaire
    "infonet.fr",           # contact@infonet.fr — annuaire
    "dataprospects.fr",     # info@dataprospects.fr — agrégateur
    "118000.fr",            # placeholder
    "societe.com",
    "verif.com",
    "manageo.fr",
    "societeinfo.com",
    "firmfolio.fr",
    "duck.com",             # support@duck.com — page pub DDG
    "domaine.com",          # utilisateur@domaine.com — placeholder générique
}

# ── Phone blacklist ────────────────────────────────────────────────────────────
PHONE_BLACKLIST = {
    "0123456789",   # placeholder 118000.fr
    "0000000000",
    "0101010101",
}

# ── Domaines annuaires — on n'accepte pas leur site comme site_web ─────────────
SITE_BLACKLIST = [
    "prosmaison.fr", "donizo.com", "infonet.fr", "dataprospects.fr",
    "118000.fr", "societe.com", "verif.com", "manageo.fr",
    "societeinfo.com", "firmfolio.fr",
    "duckduckgo.com",   # redirect publicitaire DDG (y.js)
    "bing.com",
]

CONTACT_HINTS = [
    "contact", "nous-contacter", "contactez", "joindre",
    "coordonnees", "coordonnées", "about", "qui-sommes-nous",
]

# ── I/O helpers ───────────────────────────────────────────────────────────────

def load_existing_sirens(path):
    seen = set()
    if not os.path.exists(path):
        return seen
    with open(path, newline="", encoding="utf-8") as f:
        for row in csv.DictReader(f):
            seen.add(row.get("siret", ""))
    return seen


def append_row(path, row: dict):
    exists = os.path.exists(path)
    with open(path, "a", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=CSV_FIELDS)
        if not exists:
            w.writeheader()
        w.writerow({k: row.get(k, "") for k in CSV_FIELDS})


def count_rows(path):
    if not os.path.exists(path):
        return 0
    with open(path, newline="", encoding="utf-8") as f:
        return sum(1 for _ in csv.DictReader(f))


def sleep(mn, mx):
    time.sleep(random.uniform(mn, mx))


def get(url, headers=None, timeout=REQUEST_TIMEOUT):
    try:
        r = requests.get(
            url, headers=headers or HEADERS_BROWSER,
            timeout=timeout, allow_redirects=True
        )
        if r.ok:
            return r
        log.debug("HTTP %s %s", r.status_code, url[:80])
    except Exception as e:
        log.debug("ERR %s: %s", url[:80], e)
    return None


# ── Passe 1 — SIRENE API ─────────────────────────────────────────────────────

SIRENE_API = "https://recherche-entreprises.api.gouv.fr/search"

NAF_LABEL = {
    "43.91A": "charpente",
    "43.32A": "menuiserie bois",
    "43.39Z": "finitions bois",
}


def sirene_fetch(naf, region_code, region_depts, page=1, per_page=25):
    """
    Retourne les entreprises actives pour un code NAF dans une région.
    Post-filtre : garde uniquement les sièges dont le CP correspond à la région.
    """
    try:
        r = requests.get(
            SIRENE_API,
            params={
                "activite_principale": naf,
                "region":              region_code,
                "etat_administratif":  "A",
                "per_page":            per_page,
                "page":                page,
            },
            timeout=REQUEST_TIMEOUT,
        )
        if not r.ok:
            log.debug("SIRENE HTTP %s", r.status_code)
            return [], 0
        data = r.json()
    except Exception as e:
        log.debug("SIRENE error: %s", e)
        return [], 0

    total = data.get("total_results", 0)
    results = []

    for e in data.get("results", []):
        siege = e.get("siege", {})
        cp    = siege.get("code_postal") or ""
        dept  = cp[:2] if cp else ""

        if dept not in region_depts:
            continue

        dirigeants = e.get("dirigeants") or []
        dirigeant = ""
        if dirigeants:
            d0     = dirigeants[0]
            parts  = (d0.get("prenoms") or "").split()
            prenom = parts[0].capitalize() if parts else ""
            # Supprimer les doublons entre parenthèses ex: "DUPONT (DUPONT)"
            raw_nom = re.sub(r"\s*\(.*?\)", "", d0.get("nom") or "").strip()
            nom     = raw_nom.capitalize()
            dirigeant = f"{prenom} {nom}".strip()

        results.append({
            "nom":       e.get("nom_complet", ""),
            "dirigeant": dirigeant,
            "adresse":     siege.get("adresse", ""),
            "code_postal": cp,
            "commune":     siege.get("libelle_commune", ""),
            "departement": dept,
            "region":      REGIONS[region_code]["label"],
            "naf":         naf,
            "siret":       siege.get("siret", ""),
            "site_web":    "",
            "email":       "",
            "telephone":   "",
            "source":      "sirene",
        })
    return results, total


# ── Passe 2 — Trouver le site via DuckDuckGo HTML ────────────────────────────

DDG_URL = "https://html.duckduckgo.com/html/"


def find_website_ddg(nom, commune):
    """
    Cherche le site officiel d'une entreprise via DuckDuckGo.
    Retourne une URL ou "".
    """
    query = f'"{nom}" {commune} site officiel contact'
    try:
        r = requests.post(
            DDG_URL,
            data={"q": query, "b": "", "kl": "fr-fr"},
            headers={**HEADERS_BROWSER, "Content-Type": "application/x-www-form-urlencoded"},
            timeout=REQUEST_TIMEOUT,
        )
        if not r.ok:
            return ""
    except Exception as e:
        log.debug("DDG error: %s", e)
        return ""

    soup = BeautifulSoup(r.text, "lxml")

    # Résultats DuckDuckGo HTML : liens dans .result__a
    for a in soup.select(".result__a"):
        href = a.get("href", "")
        # Ignorer les annuaires, réseaux sociaux et redirections DDG
        skip = [
            "pagesjaunes", "societe.com", "facebook", "linkedin",
            "instagram", "youtube", "twitter", "kompass", "verif.com",
            "pappers", "annuaire", "mappy", "pages-blanches",
            "duckduckgo.com", "bing.com",
        ] + SITE_BLACKLIST
        if any(s in href for s in skip):
            continue
        if href.startswith("http"):
            return href

    return ""


# ── Passe 3 — Extraction email + tel depuis le site ──────────────────────────

def find_email_on_site(site_url):
    """
    Visite la page d'accueil + une page Contact.
    Retourne (email, telephone).
    """
    if not site_url:
        return "", ""

    r = get(site_url)
    if not r:
        return "", ""

    email = _extract_email(r.text)
    phone = _extract_phone(r.text)

    if not email:
        # Chercher page Contact
        soup = BeautifulSoup(r.text, "lxml")
        contact_url = _find_contact_link(soup, site_url)
        if contact_url:
            sleep(DELAY_SITE_MIN, DELAY_SITE_MAX)
            r2 = get(contact_url)
            if r2:
                email = _extract_email(r2.text) or email
                phone = phone or _extract_phone(r2.text)

    return email, phone


def _extract_email(html):
    text = re.sub(r"\s*[\[\(]at[\]\)]\s*", "@", html, flags=re.I)
    text = re.sub(r"\s*[\[\(]dot[\]\)]\s*", ".", text, flags=re.I)
    for m in EMAIL_RE.finditer(text):
        addr = m.group(0).lower()
        domain = addr.split("@")[1]
        if domain not in EMAIL_BLACKLIST and not domain.endswith((".png", ".jpg", ".svg")):
            return addr
    return ""


def _extract_phone(html):
    m = PHONE_RE.search(html)
    if m:
        phone = re.sub(r"[\s.\-]", "", m.group(0))
        if phone in PHONE_BLACKLIST:
            return ""
        return phone
    return ""


def _find_contact_link(soup, base_url):
    base_domain = urlparse(base_url).netloc
    for a in soup.find_all("a", href=True):
        href_lower = a["href"].lower()
        text_lower = a.get_text(strip=True).lower()
        if any(h in href_lower or h in text_lower for h in CONTACT_HINTS):
            full = urljoin(base_url, a["href"])
            if urlparse(full).netloc == base_domain:
                return full
    return ""


# ── Main ──────────────────────────────────────────────────────────────────────

def main():
    log.info("=== Scraper artisans multi-régions — DIY Builder ===")
    log.info("Sortie : %s", OUTPUT_CSV)

    already = load_existing_sirens(OUTPUT_CSV)
    total = count_rows(OUTPUT_CSV)
    log.info("%d artisans déjà dans le CSV", total)

    for region_code, region_info in REGIONS.items():
        region_label = region_info["label"]
        region_depts = region_info["depts"]

        for naf in NAF_CODES:
            if total >= RESULTS_TARGET:
                break

            log.info("── %s / NAF %s (%s)", region_label, naf, NAF_LABEL.get(naf, ""))
            page = 1
            fetched = 0

            while fetched < MAX_PER_NAF and total < RESULTS_TARGET:
                sleep(DELAY_API_MIN, DELAY_API_MAX)
                entreprises, api_total = sirene_fetch(
                    naf, region_code, region_depts, page=page, per_page=25
                )

                if not entreprises:
                    log.info("  → fin pagination (page %d)", page)
                    break

                log.info("  page %d → %d entreprises (total API: %d)", page, len(entreprises), api_total)
                page += 1

                for ent in entreprises:
                    if total >= RESULTS_TARGET:
                        break

                    siret = ent["siret"]
                    if siret in already:
                        log.debug("  skip (déjà vu) : %s", ent["nom"])
                        continue

                    log.info("  🔍 %s — %s %s", ent["nom"], ent["code_postal"], ent["commune"])

                    # Passe 2 — site web via DuckDuckGo
                    sleep(DELAY_DDG_MIN, DELAY_DDG_MAX)
                    site = find_website_ddg(ent["nom"], ent["commune"])
                    # Rejeter les sites annuaires avant d'aller plus loin
                    if any(bad in site for bad in SITE_BLACKLIST):
                        site = ""
                    ent["site_web"] = site

                    if site:
                        log.info("     🌐 %s", site[:70])
                        # Passe 3 — email + tel depuis le site
                        sleep(DELAY_SITE_MIN, DELAY_SITE_MAX)
                        email, phone = find_email_on_site(site)
                        ent["email"] = email
                        ent["telephone"] = phone
                        if email:
                            log.info("     ✉  %s", email)
                        if phone:
                            log.info("     📞 %s", phone)
                    else:
                        log.info("     – pas de site trouvé")

                    append_row(OUTPUT_CSV, ent)
                    already.add(siret)
                    total += 1
                    fetched += 1

                    if total % 10 == 0:
                        log.info("  💾 %d artisans sauvegardés", total)

    log.info("=== Terminé : %d artisans dans %s ===", count_rows(OUTPUT_CSV), OUTPUT_CSV)
    log.info("")
    log.info("Avec email    : %d", _count_with_email(OUTPUT_CSV))
    log.info("Avec site web : %d", _count_with_site(OUTPUT_CSV))


def _count_with_email(path):
    if not os.path.exists(path):
        return 0
    with open(path, newline="", encoding="utf-8") as f:
        return sum(1 for r in csv.DictReader(f) if r.get("email"))


def _count_with_site(path):
    if not os.path.exists(path):
        return 0
    with open(path, newline="", encoding="utf-8") as f:
        return sum(1 for r in csv.DictReader(f) if r.get("site_web"))


if __name__ == "__main__":
    main()
