const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://pshiqbehsouzzljbsdhg.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzaGlxYmVoc291enpsamJzZGhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc2NTY2NjEsImV4cCI6MjA5MzIzMjY2MX0.UZUdw_e7zsS6WYCUn8Fkl1vRbzaQJ2pAYycCkjELC7Y';

console.log('Initializing Supabase client with URL:', supabaseUrl);
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log('Inserting test material template via Supabase JS client...');
  const { data, error } = await supabase
    .from('materials')
    .insert([{
      name: 'Supabase Client Test Material',
      description: 'Testing if supabase-js insert hangs',
      content: []
    }])
    .select('id, name')
    .single();

  if (error) {
    console.error('Supabase client insert failed:', error);
    process.exit(1);
  }

  console.log('SUCCESS: Inserted material successfully:', data);

  // Clean it up
  const { error: deleteError } = await supabase
    .from('materials')
    .delete()
    .eq('id', data.id);

  if (deleteError) {
    console.error('Supabase client delete failed:', deleteError);
    process.exit(1);
  }

  console.log('SUCCESS: Deleted test material successfully.');
}

run().catch(console.error);
