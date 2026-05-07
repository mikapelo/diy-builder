"""
email_enricher.py — Enrichissement email depuis les sites web existants
=======================================================================
Lit artisans.csv, cible les lignes avec site_web mais sans email,
et tente une extraction agressive :

  1. Nettoyage  — retire les faux site_web (SIRETs, annuaires résiduels)
  2. mailto:    — liens <a href="mailto:..."> directement dans le DOM
  3. CF decode  — déchiffre data-cfemail (protection Cloudflare)
  4. Regex text — _extract_email amélioré (obfuscation [at]/[dot])
  5. Paths directs — essaie /contact /nous-contacter /contactez-nous etc.
     si la page d'accueil ne donne rien
  6. Mise à jour en place du CSV (préserve les autres colonnes)

Usage :
    python3 email_enricher.py [--dry-run]

Options :
    --dry-run   Affiche ce qui serait écrit sans modifier le CSV
"""

import csv
import os
import re
import sys
import time
import random
import logging
from urllib.parse import urljoin, urlparse

import requests
from bs4 import BeautifulSoup

# ── Logging ───────────────────────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  %(levelname)-7s %(message)s",
    datefmt="%H:%M:%S",
)
log = logging.getLogger(__name__)

# ── Config ────────────────────────────────────────────────────────────────────
BASE_DIR   = os.path.dirname(__file__)
INPUT_CSV  = os.path.join(BASE_DIR, "artisans.csv")
OUTPUT_CSV = INPUT_CSV   # mise à jour en place

DRY_RUN = "--dry-run" in sys.argv

DELAY_MIN       = 1.5
DELAY_MAX       = 3.5
REQUEST_TIMEOUT = 12

UA = (
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
    "AppleWebKit/537.36 (KHTML, like Gecko) "
    "Chrome/124.0.0.0 Safari/537.36"
)
HEADERS = {
    "User-Agent": UA,
    "Accept-Language": "fr-FR,fr;q=0.9",
    "Accept": "text/html,application/xhtml+xml,*/*;q=0.8",
}

# ── Blacklists ────────────────────────────────────────────────────────────────

# Domaines à blacklister dans site_web (annuaires résiduels non filtrés)
SITE_BLACKLIST_DOMAINS = [
    "lefigaro", "cylex", "rubypayeur", "lagazettefrance", "edecideur",
    "rocketreach", "cataloxy", "e-pro.fr", "mairie-", "batiment.e-pro",
    "kompass", "pagesjaunes", "societe.com", "verif.com", "pappers",
    "annuaire", "mappy", "pages-blanches", "horaires.",
    "monartisan.info", "allbiz.fr", "boncharpentier.fr", "net1901.org",
    "menuisier.tel", "prix-menuisier.fr", "posefenetres.fr", "trombi.com",
    "118712.fr", "dnb.com", "infobel.com", "datalegal.fr", "bottin.fr",
]

EMAIL_BLACKLIST_DOMAINS = {
    "example.com", "exemple.fr", "sentry.io", "wixpress.com",
    "jquery.com", "google.com", "facebook.com", "instagram.com",
    "wordpress.org", "schema.org", "w3.org", "cloudflare.com",
    "prosmaison.fr", "donizo.com", "infonet.fr", "dataprospects.fr",
    "118000.fr", "societe.com", "verif.com", "manageo.fr",
    "societeinfo.com", "firmfolio.fr", "duck.com", "domaine.com",
}

# Patterns d'URL contact à essayer (dans l'ordre)
CONTACT_PATHS = [
    "/contact", "/contact/", "/contact.html", "/contact.php",
    "/nous-contacter", "/nous-contacter/",
    "/contactez-nous", "/contactez-nous/",
    "/coordonnees", "/coordonnees/",
    "/joindre", "/qui-sommes-nous", "/about",
    "/devis", "/devis/", "/demande-devis",
]

# ── Regex ─────────────────────────────────────────────────────────────────────
EMAIL_RE = re.compile(r"[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}", re.I)
PHONE_RE = re.compile(r"0[1-9](?:[\s.\-]?\d{2}){4}")


# ── Helpers réseau ────────────────────────────────────────────────────────────

def sleep_rand():
    time.sleep(random.uniform(DELAY_MIN, DELAY_MAX))


def fetch(url):
    try:
        r = requests.get(url, headers=HEADERS, timeout=REQUEST_TIMEOUT,
                         allow_redirects=True)
        if r.ok:
            return r
    except Exception as e:
        log.debug("FETCH %s → %s", url[:70], e)
    return None


# ── Détection faux site_web ───────────────────────────────────────────────────

def is_siret(value):
    """Vrai si le champ site_web contient un SIRET (9-14 chiffres) plutôt qu'une URL."""
    return bool(re.fullmatch(r"\d{9,14}", value.strip()))


def is_blacklisted_site(url):
    url_lower = url.lower()
    return any(bad in url_lower for bad in SITE_BLACKLIST_DOMAINS)


def is_genuine_site(url):
    if not url or not url.startswith("http"):
        return False
    if is_siret(url):
        return False
    if is_blacklisted_site(url):
        return False
    return True


# ── Extraction email ──────────────────────────────────────────────────────────

def decode_cf_email(encoded):
    """Déchiffre un email protégé par Cloudflare (data-cfemail hex string)."""
    try:
        r  = int(encoded[:2], 16)
        return "".join(
            chr(int(encoded[i:i+2], 16) ^ r)
            for i in range(2, len(encoded), 2)
        )
    except Exception:
        return ""


def extract_mailto(soup):
    """Retourne le premier email trouvé dans un href mailto:"""
    for a in soup.find_all("a", href=True):
        href = a["href"]
        if href.lower().startswith("mailto:"):
            addr = href[7:].split("?")[0].strip().lower()
            if addr and is_valid_email(addr):
                return addr
    return ""


def extract_cf_protected(soup):
    """Déchiffre les emails protégés par Cloudflare (span[data-cfemail])."""
    for span in soup.find_all(attrs={"data-cfemail": True}):
        addr = decode_cf_email(span["data-cfemail"]).lower()
        if is_valid_email(addr):
            return addr
    return ""


def extract_regex(html):
    """Extrait un email par regex après désobfuscation [at]/[dot]."""
    text = re.sub(r"\s*[\[\(]at[\]\)]\s*", "@", html, flags=re.I)
    text = re.sub(r"\s*[\[\(]dot[\]\)]\s*", ".", text, flags=re.I)
    for m in EMAIL_RE.finditer(text):
        addr = m.group(0).lower()
        if is_valid_email(addr):
            return addr
    return ""


def extract_phone(html):
    m = PHONE_RE.search(html)
    if m:
        phone = re.sub(r"[\s.\-]", "", m.group(0))
        if phone not in {"0123456789", "0000000000"}:
            return phone
    return ""


def is_valid_email(addr):
    if "@" not in addr:
        return False
    domain = addr.split("@")[1]
    if domain in EMAIL_BLACKLIST_DOMAINS:
        return False
    if domain.endswith((".png", ".jpg", ".svg", ".gif", ".js", ".css")):
        return False
    return True


def extract_from_page(r):
    """Lance toutes les stratégies d'extraction sur une réponse HTTP."""
    soup = BeautifulSoup(r.text, "lxml")
    email = (
        extract_mailto(soup)
        or extract_cf_protected(soup)
        or extract_regex(r.text)
    )
    phone = extract_phone(r.text)
    return email, phone, soup


def find_contact_link(soup, base_url):
    """Cherche un lien Contact dans la nav/footer."""
    base_domain = urlparse(base_url).netloc
    hints = ["contact", "nous-contacter", "contactez", "joindre",
             "coordonnees", "coordonnées", "devis"]
    for a in soup.find_all("a", href=True):
        href_lower = a["href"].lower()
        text_lower = a.get_text(strip=True).lower()
        if any(h in href_lower or h in text_lower for h in hints):
            full = urljoin(base_url, a["href"])
            if urlparse(full).netloc == base_domain:
                return full
    return ""


def enrich_site(site_url):
    """
    Tente d'extraire un email depuis site_url de façon agressive.
    Retourne (email, phone).
    """
    # 1. Page d'accueil
    sleep_rand()
    r = fetch(site_url)
    if not r:
        return "", ""

    email, phone, soup = extract_from_page(r)
    if email:
        return email, phone

    # 2. Lien contact trouvé dans la nav
    contact_url = find_contact_link(soup, site_url)
    if contact_url and contact_url != site_url:
        sleep_rand()
        r2 = fetch(contact_url)
        if r2:
            email, phone2, _ = extract_from_page(r2)
            phone = phone or phone2
            if email:
                return email, phone

    # 3. Paths contact directs
    base = f"{urlparse(site_url).scheme}://{urlparse(site_url).netloc}"
    for path in CONTACT_PATHS:
        candidate = base + path
        if candidate == contact_url:
            continue  # déjà essayé
        sleep_rand()
        r3 = fetch(candidate)
        if r3:
            email, phone2, _ = extract_from_page(r3)
            phone = phone or phone2
            if email:
                return email, phone

    return "", phone


# ── CSV helpers ───────────────────────────────────────────────────────────────

def read_csv(path):
    with open(path, newline="", encoding="utf-8") as f:
        return list(csv.DictReader(f)), csv.DictReader(open(path, encoding="utf-8")).fieldnames


def write_csv(path, rows, fieldnames):
    with open(path, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=fieldnames)
        w.writeheader()
        w.writerows(rows)


# ── Main ──────────────────────────────────────────────────────────────────────

def main():
    log.info("=== Email Enricher — DIY Builder ===")
    if DRY_RUN:
        log.info("MODE DRY-RUN : aucune modification CSV")

    rows, fieldnames = read_csv(INPUT_CSV)
    log.info("CSV chargé : %d lignes", len(rows))

    # Séparer les cibles
    to_enrich = []
    for r in rows:
        site = r.get("site_web", "").strip()
        if not r.get("email") and site:
            if is_siret(site):
                log.debug("skip SIRET : %s", r["nom"])
                if not DRY_RUN:
                    r["site_web"] = ""   # nettoie le champ
            elif is_blacklisted_site(site):
                log.debug("skip annuaire : %s → %s", r["nom"], site[:50])
                if not DRY_RUN:
                    r["site_web"] = ""   # nettoie le champ
            else:
                to_enrich.append(r)

    log.info("Sites artisans réels à visiter : %d", len(to_enrich))

    enriched = 0
    phones_added = 0

    for i, row in enumerate(to_enrich, 1):
        site = row["site_web"].strip()
        log.info("[%d/%d] %s → %s", i, len(to_enrich), row["nom"][:35], site[:55])

        email, phone = enrich_site(site)

        if email:
            log.info("  ✉  %s", email)
            enriched += 1
            if not DRY_RUN:
                row["email"] = email
        else:
            log.info("  – pas d'email trouvé")

        if phone and not row.get("telephone"):
            log.info("  📞 %s", phone)
            phones_added += 1
            if not DRY_RUN:
                row["telephone"] = phone

    # Sauvegarde
    if not DRY_RUN:
        write_csv(OUTPUT_CSV, rows, fieldnames)
        log.info("CSV mis à jour : %s", OUTPUT_CSV)

    # Stats finales
    total_emails = sum(1 for r in rows if r.get("email"))
    log.info("")
    log.info("=== Résultats ===")
    log.info("Nouveaux emails trouvés : %d", enriched)
    log.info("Nouveaux téls trouvés   : %d", phones_added)
    log.info("Total emails dans CSV   : %d / %d", total_emails, len(rows))


if __name__ == "__main__":
    main()
