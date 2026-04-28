/**
 * backend/server.js — v3
 *
 * CHANGEMENTS v3 : montage de la route /api/catalog
 * Aucune autre modification — /api/calcul-terrasse inchangé.
 */

require('dotenv').config();

const express = require('express');
const cors    = require('cors');

const routesTerrasse = require('./routes/terrasse');  // INCHANGÉ
const routesCatalog  = require('./routes/catalog');   // NOUVEAU

const app  = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(cors({
  origin:  process.env.FRONTEND_URL || 'http://localhost:3000',
  methods: ['GET', 'POST'],
}));

if (process.env.NODE_ENV !== 'production') {
  app.use((req, _res, next) => {
    console.log(`→ ${req.method} ${req.path}`);
    next();
  });
}

// Routes existantes (inchangées)
app.use('/api', routesTerrasse);

// Nouvelles routes catalogue scraper
app.use('/api/catalog', routesCatalog);

app.use((_req, res) => res.status(404).json({ message: 'Route introuvable.' }));

app.listen(PORT, () => {
  console.log(`🚀 DIY Builder API v3 → http://localhost:${PORT}`);
  console.log(`   POST /api/calcul-terrasse`);
  console.log(`   POST /api/catalog/update`);
  console.log(`   GET  /api/catalog/status`);
  console.log(`   GET  /api/catalog/history`);
});
