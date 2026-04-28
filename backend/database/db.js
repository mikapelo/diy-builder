/**
 * backend/database/db.js
 * Pool de connexions PostgreSQL.
 */

const { Pool } = require('pg');

const pool = new Pool({
  host:              process.env.DB_HOST     || 'localhost',
  port:              parseInt(process.env.DB_PORT || '5432'),
  database:          process.env.DB_NAME     || 'diy_builder',
  user:              process.env.DB_USER     || 'postgres',
  password:          process.env.DB_PASSWORD || 'postgres',
  max:               10,
  idleTimeoutMillis: 30000,
});

pool.on('error', (err) => console.error('❌ Pool PostgreSQL :', err.message));

module.exports = {
  query:     (text, params) => pool.query(text, params),
  getClient: ()             => pool.connect(),
};
