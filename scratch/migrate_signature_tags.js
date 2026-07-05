process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const pg = require('pg');
require('dotenv').config();

const client = new pg.Client({
  connectionString: process.env.DATABASE_URI,
  ssl: { rejectUnauthorized: false }
});

async function run() {
  await client.connect();
  
  console.log('Migrating product categories from "Signature" to "Signature Collection"...');
  
  const prodRes = await client.query('SELECT id, name, categories FROM products');
  
  for (const prod of prodRes.rows) {
    let cats = prod.categories;
    if (!Array.isArray(cats)) {
      try {
        cats = JSON.parse(cats || '[]');
      } catch (e) {
        cats = [];
      }
    }
    
    // Check if it has "Signature" or "signature"
    const hasOldSig = cats.some(c => typeof c === 'string' && c.trim().toLowerCase() === 'signature');
    
    if (hasOldSig) {
      // Filter out old "Signature" / "signature"
      let newCats = cats.filter(c => typeof c === 'string' && c.trim().toLowerCase() !== 'signature');
      
      // Ensure it has "Signature Collection"
      const hasNewSig = newCats.some(c => typeof c === 'string' && c.trim().toLowerCase() === 'signature collection');
      if (!hasNewSig) {
        newCats.push('Signature Collection');
      }
      
      console.log(`Updating product "${prod.name}":`, cats, '->', newCats);
      
      await client.query(
        "UPDATE products SET categories = $1::jsonb WHERE id = $2",
        [JSON.stringify(newCats), prod.id]
      );
    }
  }

  console.log('Migration complete.');
  await client.end();
}

run().catch(console.error);
