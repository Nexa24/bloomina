import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_SUPABASE_SERVICE_ROLE_KEY
);

async function run() {
  try {
    console.log('Testing categoryFilter = Sale% without subCategoryFilter:');
    // Equivalent of: query = query.or('categories.cs.["Sale%"],is_sale.eq.true')
    const { data: d1, error: e1 } = await supabase
      .from('products')
      .select('id, name, categories, is_sale')
      .or('categories.cs.["Sale%"],is_sale.eq.true');

    if (e1) {
      console.error('Error 1:', e1);
    } else {
      console.log('Query 1 success, products found:', d1.length);
    }

    console.log('Testing categoryFilter = Sale% with subCategoryFilter = Bras on Sale:');
    // Equivalent of: query = query.or('categories.cs.["Bras on Sale"],and(is_sale.eq.true,categories.cs.["Bras"])')
    const { data: d2, error: e2 } = await supabase
      .from('products')
      .select('id, name, categories, is_sale')
      .or('categories.cs.["Bras on Sale"],and(is_sale.eq.true,categories.cs.["Bras"])');

    if (e2) {
      console.error('Error 2:', e2);
    } else {
      console.log('Query 2 success, products found:', d2.length);
    }

  } catch (err) {
    console.error('Catch error:', err);
  } finally {
    process.exit(0);
  }
}

run();
