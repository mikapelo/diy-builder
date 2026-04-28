/**
 * backend/routes/terrasse.js
 */

const express = require('express');
const router  = express.Router();
const { calculTerrasse } = require('../controllers/terrasseController');

/** POST /api/calcul-terrasse — calcule matériaux + comparateur */
router.post('/calcul-terrasse', calculTerrasse);

/** GET /api/health — healthcheck (utilisé par Docker) */
router.get('/health', (_req, res) =>
  res.json({ status: 'ok', service: 'DIY Builder API v2', ts: new Date().toISOString() })
);

module.exports = router;
