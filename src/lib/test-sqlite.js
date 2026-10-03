
const { DatabaseSync } = require('node:sqlite');
const path = require('path');
const fs = require('fs');

const dataDir = path.join(__dirname, '../../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'crm.db');
const db = new DatabaseSync(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS leads (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    city TEXT,
    status TEXT NOT NULL,
    source TEXT,
    budget TEXT,
    property_interest TEXT,
    priority TEXT,
    notes TEXT,
    created_at TEXT,
    updated_at TEXT
  );
`);

console.log('Banco de dados SQLite inicializado em:', dbPath);
