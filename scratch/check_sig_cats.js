process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const pg = require('pg');
require('dotenv').config();

const client = new pg.Client({
  connectionString: process.env.DATABASE_URI,
  ssl: { rejectUnauthorized: false }
});

async function run() {
  await client.connect();
  
  console.log('--- Categories Table ---');
  const catRes = await client.query('SELECT id, name, slug FROM categories');
  console.log(catRes.rows);

  console.log('\n--- Products Category Samples ---');
  const prodRes = await client.query('SELECT id, name, categories FROM products LIMIT 15');
  prodRes.rows.forEach(p => {
    console.log(`Product: "${p.name}" | Categories:`, p.categories);
  });

  await client.end();
}

run().catch(console.error);
