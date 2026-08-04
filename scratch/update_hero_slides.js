process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const pg = require('pg');
require('dotenv').config();

const client = new pg.Client({
  connectionString: process.env.DATABASE_URI,
  ssl: { rejectUnauthorized: false }
});

client.connect()
  .then(async () => {
    await client.query("DELETE FROM hero_slides");
    await client.query(`
      INSERT INTO hero_slides (id, image_url, order_index, is_active)
      VALUES 
        (gen_random_uuid(), '/our_story.png', 0, true),
        (gen_random_uuid(), '/european_lace.png', 1, true),
        (gen_random_uuid(), '/micro_modal.png', 2, true)
    `);
    const res = await client.query('SELECT * FROM hero_slides');
    console.log('Updated hero slides:', res.rows);
    return client.end();
  })
  .catch(err => {
    console.error('Error updating hero slides:', err);
    process.exit(1);
  });
