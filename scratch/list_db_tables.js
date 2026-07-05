process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const pg = require('pg');
require('dotenv').config();

const client = new pg.Client({
  connectionString: process.env.DATABASE_URI,
  ssl: { rejectUnauthorized: false }
});

async function run() {
  await client.connect();
  
  console.log('--- Database Tables List ---');
  const tablesRes = await client.query(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public'
    ORDER BY table_name
  `);
  const tables = tablesRes.rows.map(r => r.table_name);
  console.log(tables);

  for (const table of tables) {
    if (table.includes('subscriber') || table.includes('newsletter') || table.includes('lead') || table.includes('contact')) {
      console.log(`\n--- Columns for table: ${table} ---`);
      const colsRes = await client.query(`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns 
        WHERE table_name = $1
      `, [table]);
      console.log(colsRes.rows);
    }
  }

  await client.end();
}

run().catch(console.error);
