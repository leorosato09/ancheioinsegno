import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Assicurati di avere questa variabile d'ambiente configurata
  ssl: {
    rejectUnauthorized: false
  }
});

const db = {
    query: (text, params) => pool.query(text, params),
  };
  
  export default db;