process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const pg = require('pg');
require('dotenv').config();

const client = new pg.Client({
  connectionString: process.env.DATABASE_URI,
  ssl: { rejectUnauthorized: false }
});

async function run() {
  await client.connect();
  
  console.log('Inserting test material template via direct pg connection...');
  const insertRes = await client.query(`
    INSERT INTO materials (name, description, content)
    VALUES ('Diag Test Material', 'Diagnosing save hang issues', '[]'::jsonb)
    RETURNING id, name
  `);
  console.log('SUCCESS: Inserted material successfully:', insertRes.rows[0]);

  // Clean it up
  const deleteRes = await client.query(`
    DELETE FROM materials 
    WHERE id = $1
    RETURNING id
  `, [insertRes.rows[0].id]);
  console.log('SUCCESS: Deleted test material successfully:', deleteRes.rows[0]);

  await client.end();
}

run().catch(console.error);
