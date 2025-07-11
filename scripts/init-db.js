import 'dotenv/config';
import db from '../lib/db.js';

async function init() {
  try {
    // First create the problems table
    await db.query(`
      CREATE TABLE IF NOT EXISTS problems (
        problem_id SERIAL PRIMARY KEY,
        problem_description TEXT UNIQUE NOT NULL,
        date_started DATE NOT NULL,
        date_closed DATE,
        status TEXT CHECK (status IN ('Open', 'Closed', 'In Progress')),
        type TEXT,
        impact TEXT CHECK (status IN ('High', 'Med', 'Low')),
        ext_support TEXT,
        comments TEXT
      );
    `);

    // Then create the tickets table
    await db.query(`
      CREATE TABLE IF NOT EXISTS tickets (
        ticket_no SERIAL PRIMARY KEY,
        period TEXT NOT NULL,
        ticket_type TEXT NOT NULL CHECK (ticket_type IN ('Problem', 'User mgm', 'Request')),
        date_created DATE NOT NULL,
        date_closed DATE,
        status TEXT NOT NULL CHECK (status IN ('Open', 'Open External', 'Closed')),
        external_supplier TEXT,
        problem_id INTEGER REFERENCES problems(problem_id) ON DELETE SET NULL,
        requestor TEXT,
        severity TEXT NOT NULL CHECK (severity IN ('3-Basic', '2-Important', '1-Critical')),
        shop TEXT NOT NULL CHECK (shop IN ('CityLink', 'Cosmos', 'E-shop','Golden','Mall','Paiania','Amerikis','Valaoritou','Tsimiski','ola')),
        floor TEXT,
        area_corner TEXT,
        problem TEXT,
        hardware TEXT,
        hardware_vendor TEXT,
        software TEXT,
        resolver TEXT,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('✅ Tables created successfully!');
  } catch (err) {
    console.error('❌ Error creating tables: ', err);
  } finally {
    process.exit();
  }
}

init();
