import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SERVICE_ROLE_KEY || ''; // Use service role to check policies

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkPolicies() {
  const { data, error } = await supabase.rpc('get_policies', { table_name: 'products' });
  // If rpc fails, just try to select from products with anon key
  console.log('Checking with anon key...');
  const anonClient = createClient(supabaseUrl, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '');
  const { data: anonData, error: anonError } = await anonClient.from('products').select('count', { count: 'exact', head: true });
  
  if (anonError) {
    console.error('Anon access error:', anonError);
  } else {
    console.log('Anon access count:', anonData);
  }
}

checkPolicies();
