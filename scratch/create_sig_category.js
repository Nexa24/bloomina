process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const pg = require('pg');
require('dotenv').config();

const client = new pg.Client({
  connectionString: process.env.DATABASE_URI,
  ssl: { rejectUnauthorized: false }
});

async function run() {
  await client.connect();
  
  // Check if "signature" category already exists
  const checkRes = await client.query("SELECT id FROM categories WHERE slug = 'signature' OR slug = 'Signature'");
  
  if (checkRes.rows.length === 0) {
    console.log('Inserting "Signature Collection" category...');
    const insertRes = await client.query(`
      INSERT INTO categories (name, slug, display_on_home, sort_order, image)
      VALUES (
        'Signature Collection',
        'signature',
        false,
        10,
        'https://images.unsplash.com/photo-1616606145749-7ff5847e27e1?q=80&w=600&auto=format&fit=crop'
      )
      RETURNING id, name
    `);
    console.log('Inserted:', insertRes.rows[0]);
  } else {
    console.log('Category "signature" already exists with ID:', checkRes.rows[0].id);
  }

  // Tag a few test products with "signature" so there are products to display
  console.log('\nChecking products to tag with "signature" category...');
  const prodCheck = await client.query("SELECT id, name, categories FROM products LIMIT 4");
  
  for (const prod of prodCheck.rows) {
    let cats = prod.categories;
    if (!Array.isArray(cats)) {
      try {
        cats = JSON.parse(cats || '[]');
      } catch (e) {
        cats = [];
      }
    }
    
    // Add 'signature' if not present
    if (!cats.some(c => String(c).toLowerCase() === 'signature')) {
      cats.push('Signature');
      await client.query(
        "UPDATE products SET categories = $1::jsonb WHERE id = $2",
        [JSON.stringify(cats), prod.id]
      );
      console.log(`Tagged product "${prod.name}" with "Signature" category.`);
    } else {
      console.log(`Product "${prod.name}" already has "Signature" category.`);
    }
  }

  await client.end();
}

run().catch(console.error);
