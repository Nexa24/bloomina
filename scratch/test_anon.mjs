import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '';

const supabase = createClient(supabaseUrl, anonKey);

async function testAnon() {
  const { data, error } = await supabase.from('products').select('name').limit(1);
  if (error) {
    console.error('Anon Error:', error);
  } else {
    console.log('Anon Data:', data);
  }
}

testAnon();
