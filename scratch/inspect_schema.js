process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const pg = require('pg');
require('dotenv').config();

const connectionString = process.env.DATABASE_URI;
if (!connectionString) {
  console.error('No connection string found');
  process.exit(1);
}

const client = new pg.Client({
  connectionString: connectionString,
  ssl: { rejectUnauthorized: false }
});

client.connect()
  .then(() => {
    return client.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'orders'
    `);
  })
  .then(res => {
    console.log('--- orders Columns ---');
    res.rows.forEach(row => {
      console.log(`${row.column_name}: ${row.data_type} (Nullable: ${row.is_nullable})`);
    });
    return client.end();
  })
  .catch(err => {
    console.error('Failed:', err);
    process.exit(1);
  });
