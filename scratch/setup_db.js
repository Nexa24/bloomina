process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const { Client } = require('pg');

const client = new Client({
  connectionString: "postgres://postgres.pshiqbehsouzzljbsdhg:Bloomina%402026@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres?sslmode=require",
  ssl: {
    rejectUnauthorized: false
  }
});

async function setup() {
  try {
    await client.connect();
    console.log('Connected to database');

    // Create system_config table
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS system_config (
        key TEXT PRIMARY KEY,
        value JSONB NOT NULL,
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;
    await client.query(createTableQuery);
    console.log('Table system_config created or already exists');

    // Enable RLS
    await client.query('ALTER TABLE system_config ENABLE ROW LEVEL SECURITY;');
    console.log('RLS enabled on system_config');

    // Add policy: allow all for now (or refine if needed)
    // Actually, usually admin needs to edit, anon needs to read.
    await client.query('DROP POLICY IF EXISTS "Public Read Access" ON system_config;');
    await client.query('CREATE POLICY "Public Read Access" ON system_config FOR SELECT USING (true);');
    
    await client.query('DROP POLICY IF EXISTS "All Access for Anon" ON system_config;');
    await client.query('CREATE POLICY "All Access for Anon" ON system_config FOR ALL USING (true);');
    
    console.log('RLS policies applied (Universal Access for debugging)');

  } catch (err) {
    console.error('Error during setup:', err);
  } finally {
    await client.end();
  }
}

setup();
