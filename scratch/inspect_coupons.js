const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  try {
    const { data: coupons, error } = await supabase
      .from('coupons')
      .select('*');
    
    if (error) {
      console.error('Error fetching coupons:', error);
    } else {
      console.log('=== All Coupons ===');
      console.log(JSON.stringify(coupons, null, 2));
    }
  } catch (err) {
    console.error('Catch error:', err);
  } finally {
    process.exit(0);
  }
}

check();
