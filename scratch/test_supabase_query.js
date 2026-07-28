const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.NEXT_SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceRoleKey) {
  console.error('Missing env vars');
  process.exit(1);
}

const supabase = createClient(url, serviceRoleKey);

async function run() {
  console.log('Querying order using admin credentials...');
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', 'order_1721291888203')
    .single();

  if (error) {
    console.error('Query error:', error);
  } else {
    console.log('Query success:', data ? 'Found order ' + data.id : 'No data');
  }
}

run();
