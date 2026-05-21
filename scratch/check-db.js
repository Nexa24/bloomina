const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_SUPABASE_SERVICE_ROLE_KEY;

console.log('supabaseUrl:', supabaseUrl);
console.log('supabaseKey exists:', !!supabaseKey);

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  try {
    console.log('Fetching size guides...');
    const { data: sizeGuides, error: sgErr } = await supabase.from('size_guides').select('*');
    if (sgErr) {
      console.error('SG Error:', sgErr);
    } else {
      console.log('Size Guides:', JSON.stringify(sizeGuides, null, 2));
    }

    console.log('Fetching products...');
    const { data: products, error: prodErr } = await supabase.from('products').select('id, name, size_guide_id, categories');
    if (prodErr) {
      console.error('Prod Error:', prodErr);
    } else {
      console.log('Products:', JSON.stringify(products, null, 2));
    }
  } catch (e) {
    console.error('Catch Error:', e);
  } finally {
    process.exit(0);
  }
}

check();
