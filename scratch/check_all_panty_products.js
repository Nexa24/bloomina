process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const pg = require('pg');
require('dotenv').config();

const client = new pg.Client({
  connectionString: process.env.DATABASE_URI,
  ssl: { rejectUnauthorized: false }
});

async function run() {
  await client.connect();

  console.log('--- Scanning Products with any Panty/Panties Category ---');
  const res = await client.query(`
    SELECT name, categories 
    FROM products
  `);
  
  let matchCount = 0;
  res.rows.forEach(r => {
    const cats = r.categories || [];
    const hasPanty = cats.some(c => typeof c === 'string' && (c.toLowerCase().includes('panty') || c.toLowerCase().includes('panties')));
    if (hasPanty) {
      matchCount++;
      console.log(`Product: "${r.name}" | Categories:`, cats);
    }
  });
  console.log(`\nTotal matched products: ${matchCount}`);

  await client.end();
}

run().catch(console.error);
