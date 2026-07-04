const pg = require('pg');
require('dotenv').config();

const connectionString = process.env.DATABASE_URI;
console.log('Testing connection to:', connectionString ? connectionString.substring(0, 45) + '...' : 'none');

if (!connectionString) {
  console.error('No connection string found in process.env');
  process.exit(1);
}

const client = new pg.Client({
  connectionString: connectionString,
  ssl: { rejectUnauthorized: false }
});

client.connect()
  .then(() => {
    console.log('SUCCESS: Connected to database successfully!');
    return client.query('SELECT NOW()');
  })
  .then(res => {
    console.log('Database Time:', res.rows[0]);
    return client.end();
  })
  .catch(err => {
    console.error('FAILED to connect to database:', err);
    process.exit(1);
  });
