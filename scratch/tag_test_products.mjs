import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: 'E:/Alanove/VS Code/Bloomina/.env' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function tagProducts() {
    const { data: products } = await supabase.from('products').select('id, name, categories').limit(10);
    
    if (!products) return;

    for (const product of products) {
        let newCats = product.categories || [];
        if (product.name.toLowerCase().includes('bra')) {
            if (!newCats.includes('Bras')) newCats.push('Bras');
            if (!newCats.includes('Wireless Bras')) newCats.push('Wireless Bras');
        } else if (product.name.toLowerCase().includes('pant') || product.name.toLowerCase().includes('brief')) {
            if (!newCats.includes('Panties')) newCats.push('Panties');
            if (!newCats.includes('Seamless')) newCats.push('Seamless');
        } else {
            if (!newCats.includes('Luxe')) newCats.push('Luxe');
            if (!newCats.includes('Silk & Satin')) newCats.push('Silk & Satin');
        }

        const { error } = await supabase.from('products').update({ categories: newCats }).eq('id', product.id);
        if (error) console.error(`Error updating product ${product.id}:`, error);
        else console.log(`Updated product: ${product.name}`);
    }
}

tagProducts();
