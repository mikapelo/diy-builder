-- ============================================================
-- DIY Builder v2 — Schéma PostgreSQL
-- Tables : magasins · produits · prix
-- ============================================================

-- ── Nettoyage (utile en développement) ───────────────────────
DROP TABLE IF EXISTS prix     CASCADE;
DROP TABLE IF EXISTS produits CASCADE;
DROP TABLE IF EXISTS magasins CASCADE;

-- ── Table magasins ────────────────────────────────────────────
CREATE TABLE magasins (
  id    SERIAL PRIMARY KEY,
  nom   VARCHAR(100) NOT NULL UNIQUE   -- 'Leroy Merlin' | 'Castorama' | 'Brico Dépôt'
);

-- ── Table produits ────────────────────────────────────────────
-- Catalogue de référence — dimensions en mm pour éviter les ambiguïtés
CREATE TABLE produits (
  id          SERIAL PRIMARY KEY,
  nom         VARCHAR(255) NOT NULL,
  categorie   VARCHAR(50)  NOT NULL,   -- 'lame_terrasse' | 'lambourde' | 'vis'
  largeur     NUMERIC(8,1),            -- mm
  longueur    NUMERIC(8,1),            -- mm
  epaisseur   NUMERIC(8,1),            -- mm
  unite       VARCHAR(20) DEFAULT 'unité'  -- 'unité' | 'boite'
);

-- ── Table prix ────────────────────────────────────────────────
CREATE TABLE prix (
  id          SERIAL PRIMARY KEY,
  produit_id  INTEGER      NOT NULL REFERENCES produits(id) ON DELETE CASCADE,
  magasin_id  INTEGER      NOT NULL REFERENCES magasins(id) ON DELETE CASCADE,
  prix        NUMERIC(10,2) NOT NULL,
  url         TEXT,
  updated_at  TIMESTAMP DEFAULT NOW(),
  UNIQUE (produit_id, magasin_id)      -- 1 prix par produit par magasin
);

-- ============================================================
-- DONNÉES D'EXEMPLE
-- ============================================================

-- Magasins
INSERT INTO magasins (nom) VALUES
  ('Leroy Merlin'),
  ('Castorama'),
  ('Brico Dépôt');

-- ── Lames terrasse ───────────────────────────────────────────
INSERT INTO produits (nom, categorie, largeur, longueur, epaisseur, unite) VALUES
  ('Lame terrasse pin traité cl.4',    'lame_terrasse', 145, 2400, 21, 'unité'),  -- id 1
  ('Lame terrasse douglas naturel',    'lame_terrasse', 145, 2400, 21, 'unité'),  -- id 2
  ('Lame terrasse ipé exotique',       'lame_terrasse', 145, 2400, 21, 'unité');  -- id 3

-- ── Lambourdes ───────────────────────────────────────────────
INSERT INTO produits (nom, categorie, largeur, longueur, epaisseur, unite) VALUES
  ('Lambourde pin traité cl.4',        'lambourde', 60, 4000, 40, 'unité'),       -- id 4
  ('Lambourde douglas naturel',        'lambourde', 70, 4000, 45, 'unité'),       -- id 5
  ('Lambourde ipé exotique',           'lambourde', 60, 4000, 40, 'unité');       -- id 6

-- ── Vis inox ─────────────────────────────────────────────────
INSERT INTO produits (nom, categorie, largeur, longueur, epaisseur, unite) VALUES
  ('Vis inox A4 tête fraisée 5×60mm', 'vis', NULL, 60, NULL, 'boite'),            -- id 7
  ('Vis inox A2 autoperceuse 4×40mm', 'vis', NULL, 40, NULL, 'boite');            -- id 8

-- ── Prix Leroy Merlin (magasin_id = 1) ───────────────────────
INSERT INTO prix (produit_id, magasin_id, prix, url) VALUES
  (1, 1, 6.90,  'https://www.leroymerlin.fr/lame-pin'),
  (2, 1, 9.20,  'https://www.leroymerlin.fr/lame-douglas'),
  (3, 1, 18.50, 'https://www.leroymerlin.fr/lame-ipe'),
  (4, 1, 8.90,  'https://www.leroymerlin.fr/lambourde-pin'),
  (5, 1, 12.50, 'https://www.leroymerlin.fr/lambourde-douglas'),
  (6, 1, 19.90, 'https://www.leroymerlin.fr/lambourde-ipe'),
  (7, 1, 14.90, 'https://www.leroymerlin.fr/vis-inox-a4'),
  (8, 1, 11.20, 'https://www.leroymerlin.fr/vis-inox-a2');

-- ── Prix Castorama (magasin_id = 2) ──────────────────────────
INSERT INTO prix (produit_id, magasin_id, prix, url) VALUES
  (1, 2, 6.50,  'https://www.castorama.fr/lame-pin'),
  (2, 2, 8.80,  'https://www.castorama.fr/lame-douglas'),
  (3, 2, 17.90, 'https://www.castorama.fr/lame-ipe'),
  (4, 2, 8.20,  'https://www.castorama.fr/lambourde-pin'),
  (5, 2, 11.90, 'https://www.castorama.fr/lambourde-douglas'),
  (6, 2, 18.80, 'https://www.castorama.fr/lambourde-ipe'),
  (7, 2, 13.50, 'https://www.castorama.fr/vis-inox-a4'),
  (8, 2, 10.80, 'https://www.castorama.fr/vis-inox-a2');

-- ── Prix Brico Dépôt (magasin_id = 3) ────────────────────────
INSERT INTO prix (produit_id, magasin_id, prix, url) VALUES
  (1, 3, 5.99,  'https://www.bricodepot.fr/lame-pin'),
  (2, 3, 8.50,  'https://www.bricodepot.fr/lame-douglas'),
  (3, 3, 17.20, 'https://www.bricodepot.fr/lame-ipe'),
  (4, 3, 7.90,  'https://www.bricodepot.fr/lambourde-pin'),
  (5, 3, 11.20, 'https://www.bricodepot.fr/lambourde-douglas'),
  (6, 3, 18.20, 'https://www.bricodepot.fr/lambourde-ipe'),
  (7, 3, 12.90, 'https://www.bricodepot.fr/vis-inox-a4'),
  (8, 3, 10.20, 'https://www.bricodepot.fr/vis-inox-a2');
