process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const pg = require('pg');
require('dotenv').config();

const client = new pg.Client({
  connectionString: process.env.DATABASE_URI,
  ssl: { rejectUnauthorized: false }
});

async function run() {
  await client.connect();
  
  console.log('--- RLS Status of Tables ---');
  const rlsRes = await client.query(`
    SELECT tablename, rowsecurity 
    FROM pg_tables 
    WHERE schemaname = 'public'
    ORDER BY tablename
  `);
  console.log(rlsRes.rows);

  console.log('\n--- RLS Policies Detail ---');
  const policiesRes = await client.query(`
    SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check 
    FROM pg_policies 
    WHERE schemaname = 'public'
    ORDER BY tablename, policyname
  `);
  policiesRes.rows.forEach(p => {
    console.log(`\nTable: ${p.tablename} | Policy: "${p.policyname}"`);
    console.log(`Command: ${p.cmd} | Roles:`, p.roles);
    console.log(`Qual: ${p.qual}`);
    console.log(`With Check: ${p.with_check}`);
  });

  await client.end();
}

run().catch(console.error);
