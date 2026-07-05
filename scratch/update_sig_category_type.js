process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const pg = require('pg');
require('dotenv').config();

const client = new pg.Client({
  connectionString: process.env.DATABASE_URI,
  ssl: { rejectUnauthorized: false }
});

async function run() {
  await client.connect();
  
  console.log('Updating category_type for "signature" category to "universal"...');
  
  // Check existing fields on categories table first
  const colsRes = await client.query(`
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_name = 'categories'
  `);
  const hasCategoryType = colsRes.rows.some(r => r.column_name === 'category_type');
  console.log('Categories table columns contains category_type:', hasCategoryType);

  if (hasCategoryType) {
    const updateRes = await client.query(`
      UPDATE categories 
      SET category_type = 'universal' 
      WHERE slug = 'signature' 
      RETURNING id, name, category_type
    `);
    console.log('Updated row:', updateRes.rows[0]);
  } else {
    console.log('Categories table does not have a "category_type" column.');
  }

  await client.end();
}

run().catch(console.error);
