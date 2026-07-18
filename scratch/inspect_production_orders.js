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
      SELECT id, customer_name, shiprocket_order_id, shiprocket_shipment_id, shipping_status
      FROM orders
      ORDER BY created_at DESC
      LIMIT 5
    `);
  })
  .then(res => {
    console.log('--- LATEST ORDERS WITH SHIPROCKET DETAILS ---');
    res.rows.forEach(row => {
      console.log({
        id: row.id,
        customer_name: row.customer_name,
        shiprocket_order_id: row.shiprocket_order_id,
        shiprocket_shipment_id: row.shiprocket_shipment_id,
        shipping_status: row.shipping_status
      });
    });
    return client.end();
  })
  .catch(err => {
    console.error('Failed:', err);
    process.exit(1);
  });
