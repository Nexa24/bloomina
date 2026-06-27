const fs = require('fs');
const path = require('path');
const { Client } = require('pg');
require('dotenv').config();

const connectionString = process.env.DATABASE_URI || process.env.DATABASE_URL;
if (!connectionString) {
  console.error('ERROR: DATABASE_URI or DATABASE_URL is required');
  process.exit(1);
}

const client = new Client({ connectionString });

async function applyLockdown() {
  try {
    const sql = fs.readFileSync(path.join(__dirname, 'security_lockdown.sql'), 'utf8');
    await client.connect();
    await client.query(sql);
    console.log('Security lockdown applied successfully');
  } catch (error) {
    console.error('Security lockdown failed:', error.message);
    process.exitCode = 1;
  } finally {
    await client.end();
  }
}

applyLockdown();
