import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: 'E:/Alanove/VS Code/Bloomina/.env' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data, error } = await supabase.from('products').select('categories');
  if (error) {
    console.error('Error fetching products:', error);
    return;
  }
  
  const allCats = new Set();
  data.forEach(p => {
    if (!p.categories) return;
    const cats = Array.isArray(p.categories) ? p.categories : [p.categories];
    cats.forEach(c => allCats.add(c));
  });

  console.log('Unique categories in products table:', Array.from(allCats));
}

check();
