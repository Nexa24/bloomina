import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: 'E:/Alanove/VS Code/Bloomina/.env' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data, error } = await supabase.from('products').select('id, name, categories');
  if (error) {
    console.error('Error fetching products:', error);
    return;
  }
  
  const luxeProducts = data.filter(p => {
    if (!p.categories) return false;
    const cats = Array.isArray(p.categories) ? p.categories : [p.categories];
    return cats.some(c => c && c.toLowerCase().includes('luxe'));
  });

  console.log('Luxe Products found:', luxeProducts);
}

check();
