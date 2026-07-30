process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const pg = require('pg');
require('dotenv').config();

const client = new pg.Client({
  connectionString: process.env.DATABASE_URI,
  ssl: { rejectUnauthorized: false }
});

client.connect()
  .then(() => client.query(`
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_name = 'products'
  `))
  .then(res => {
    console.log('--- products table columns ---');
    console.log(res.rows.map(r => r.column_name));
    return client.query('SELECT * FROM products LIMIT 3');
  })
  .then(res => {
    console.log('--- Sample Product Data ---');
    console.log(JSON.stringify(res.rows[0], null, 2));
    return client.end();
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
