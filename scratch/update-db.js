const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  try {
    // Let's get the size guides first to get their IDs
    const { data: guides, error: gErr } = await supabase.from('size_guides').select('*');
    if (gErr) throw gErr;

    const braGuide = guides.find(g => /bra/i.test(g.name));
    const pantyGuide = guides.find(g => /pantie|panty/i.test(g.name));

    console.log('Bra Guide ID:', braGuide?.id);
    console.log('Panty Guide ID:', pantyGuide?.id);

    if (!braGuide || !pantyGuide) {
      console.error('Could not find both size guides.');
      return;
    }

    // Get all products
    const { data: products, error: pErr } = await supabase.from('products').select('*');
    if (pErr) throw pErr;

    console.log(`Found ${products.length} products to check.`);

    for (const p of products) {
      let targetGuideId = null;
      if (/bra/i.test(p.name) || (p.categories && p.categories.some(c => /bra/i.test(c)))) {
        targetGuideId = braGuide.id;
      } else if (/pantie|panty|brief/i.test(p.name) || (p.categories && p.categories.some(c => /pantie|panty|brief/i.test(c)))) {
        targetGuideId = pantyGuide.id;
      }

      if (targetGuideId && p.size_guide_id !== targetGuideId) {
        console.log(`Updating product "${p.name}" (current size_guide_id: ${p.size_guide_id}) to targetGuideId: ${targetGuideId}`);
        const { error: uErr } = await supabase
          .from('products')
          .update({ size_guide_id: targetGuideId })
          .eq('id', p.id);
        if (uErr) {
          console.error(`Error updating product ${p.name}:`, uErr);
        } else {
          console.log(`Successfully updated "${p.name}"`);
        }
      } else {
        console.log(`Product "${p.name}" is already correct or has no matching size guide.`);
      }
    }
  } catch (e) {
    console.error('Error during update:', e);
  } finally {
    process.exit(0);
  }
}

run();
