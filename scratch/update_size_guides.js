process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const pg = require('pg');
require('dotenv').config();

const client = new pg.Client({
  connectionString: process.env.DATABASE_URI,
  ssl: { rejectUnauthorized: false }
});

client.connect()
  .then(async () => {
    await client.query("UPDATE size_guides SET name = 'SIZE GUIDE FOR BRAS' WHERE name LIKE '%Bra%'");
    await client.query("UPDATE size_guides SET name = 'SIZE GUIDE FOR PANTIES' WHERE name LIKE '%Panty%' OR name LIKE '%Panties%'");
    const res = await client.query('SELECT id, name FROM size_guides');
    console.log('Updated size guides:', res.rows);
    return client.end();
  })
  .catch(err => {
    console.error('Error updating size guides:', err);
    process.exit(1);
  });
