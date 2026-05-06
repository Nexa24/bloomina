const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://pshiqbehsouzzljbsdhg.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzaGlxYmVoc291enpsamJzZGhnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzY1NjY2MSwiZXhwIjoyMDkzMjMyNjYxfQ.aKHxamQuItHVqI4EYR3B5p2lk_GVx870yybjA1Yq5Q8'
);

// Try inserting a test row to see what columns exist or what errors we get
async function discoverSchema() {
  // Test each known column individually
  const testCols = ['id', 'total', 'status', 'metadata', 'customer_name', 'email', 'phone', 'items', 'shipping_address', 'payment_method', 'created_at', 'updated_at'];
  
  for (const col of testCols) {
    const { error } = await supabase.from('orders').select(col).limit(1);
    if (error) {
      console.log(`MISSING: ${col} — ${error.message}`);
    } else {
      console.log(`EXISTS:  ${col}`);
    }
  }
}

discoverSchema();
