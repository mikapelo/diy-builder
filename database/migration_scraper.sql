-- ============================================================
-- DIY Builder — Migration scraper
-- Fichier : database/migration_scraper.sql
--
-- ⚠️  Ce fichier est ADDITIF — il ne supprime rien.
--     Les données existantes sont préservées.
--     Appliquer avec : psql $DATABASE_URL -f database/migration_scraper.sql
-- ============================================================

-- ── 1. Colonne source sur produits ───────────────────────────
-- Distingue les produits manuels des produits scrapés.
ALTER TABLE produits
  ADD COLUMN IF NOT EXISTS source      VARCHAR(20) DEFAULT 'manual',
  ADD COLUMN IF NOT EXISTS scraped_at  TIMESTAMP;

-- ── 2. Colonne source sur prix ───────────────────────────────
-- Tracabilité : qui a posé ce prix (manual | scraper).
ALTER TABLE prix
  ADD COLUMN IF NOT EXISTS source VARCHAR(20) DEFAULT 'manual';

-- ── 3. Index performances ────────────────────────────────────
-- Recherche fréquente par (categorie, source)
CREATE INDEX IF NOT EXISTS idx_produits_categorie_source
  ON produits (categorie, source);

-- Recherche fréquente par (magasin_id, source) pour le comparateur
CREATE INDEX IF NOT EXISTS idx_prix_magasin_source
  ON prix (magasin_id, source);

-- ── 4. Table catalogue_scraper (log des runs) ─────────────────
-- Garde une trace de chaque exécution : nb produits, erreurs, durée.
CREATE TABLE IF NOT EXISTS catalogue_runs (
  id              SERIAL PRIMARY KEY,
  magasin         VARCHAR(50) NOT NULL,
  statut          VARCHAR(20) NOT NULL,   -- 'success' | 'partial' | 'failed' | 'blocked'
  nb_produits     INTEGER DEFAULT 0,
  nb_erreurs      INTEGER DEFAULT 0,
  duree_ms        INTEGER,
  message         TEXT,
  created_at      TIMESTAMP DEFAULT NOW()
);

-- ── 5. Mettre à jour les données existantes ───────────────────
UPDATE produits SET source = 'manual' WHERE source IS NULL;
UPDATE prix     SET source = 'manual' WHERE source IS NULL;
