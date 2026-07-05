process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const pg = require('pg');
require('dotenv').config();

const client = new pg.Client({
  connectionString: process.env.DATABASE_URI,
  ssl: { rejectUnauthorized: false }
});

async function run() {
  await client.connect();

  console.log('--- Panties Products and Categories ---');
  const res = await client.query(`
    SELECT name, categories 
    FROM products 
    WHERE categories::text ILIKE '%panty%' OR categories::text ILIKE '%panties%'
    LIMIT 20
  `);
  res.rows.forEach(r => {
    console.log(`Product: "${r.name}" | Categories:`, r.categories);
  });

  console.log('\n--- All Categories in DB ---');
  const catRes = await client.query('SELECT name, slug, category_type, parent_id FROM categories');
  console.log(catRes.rows);

  await client.end();
}

run().catch(console.error);
