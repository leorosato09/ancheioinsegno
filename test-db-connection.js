const { Pool } = require('pg');

// Configura il pool senza SSL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false // Disabilita SSL
});

(async () => {
  try {
    // Testa la connessione eseguendo una query semplice
    const res = await pool.query('SELECT NOW()');
    console.log('Connection successful:', res.rows[0]);
  } catch (err) {
    console.error('Connection error:', err);
  } finally {
    // Chiudi la connessione al database
    await pool.end();
  }
})();