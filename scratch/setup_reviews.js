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

    // Create reviews table
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS reviews (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        product_id UUID REFERENCES products(id) ON DELETE CASCADE,
        rating INTEGER CHECK (rating >= 1 AND rating <= 5),
        comment TEXT NOT NULL,
        customer_name TEXT NOT NULL,
        customer_email TEXT,
        status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;
    await client.query(createTableQuery);
    console.log('Table reviews created or already exists');

    // Enable RLS
    await client.query('ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;');
    
    // Policies
    await client.query('DROP POLICY IF EXISTS "Public Read Approved Reviews" ON reviews;');
    await client.query('CREATE POLICY "Public Read Approved Reviews" ON reviews FOR SELECT USING (status = \'approved\');');
    
    await client.query('DROP POLICY IF EXISTS "Anon Insert Reviews" ON reviews;');
    await client.query('CREATE POLICY "Anon Insert Reviews" ON reviews FOR INSERT WITH CHECK (true);');
    
    await client.query('DROP POLICY IF EXISTS "Admin All Access" ON reviews;');
    await client.query('CREATE POLICY "Admin All Access" ON reviews FOR ALL USING (true);');

    console.log('RLS policies applied');

  } catch (err) {
    console.error('Error during setup:', err);
  } finally {
    await client.end();
  }
}

setup();
