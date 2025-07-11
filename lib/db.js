/*
import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

export default {
  query: (text, params) => pool.query(text, params),
};
*/

// lib/db.ts

// lib/db.ts

// lib/db.js
import sql from 'mssql'

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
  pool: {
    max: 5,
    min: 0,
    idleTimeoutMillis: 10000,
  },
}

let globalPool

async function getDbPool() {
  if (globalPool) {
    return globalPool
  }

  try {
    globalPool = await sql.connect(config)
    if (process.env.NODE_ENV !== 'production') {
      console.log('[DB] Connected to SQL Server')
    }
    return globalPool
  } catch (err) {
    console.error('[DB] Connection error:', err)
    throw new Error('Failed to connect to SQL Server')
  }
}

const db = {
  getDbPool,
}

export default db
