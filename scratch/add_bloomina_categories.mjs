import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: 'E:/Alanove/VS Code/Bloomina_dashboard/.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

const categoriesToAdd = [
    { name: 'Bralettes', slug: 'bralettes' },
    { name: 'Wireless Bras', slug: 'wireless-bras' },
    { name: 'Push-up Bras', slug: 'push-up-bras' },
    { name: 'Everyday Bras', slug: 'everyday-bras' },
    { name: 'Full Coverage', slug: 'full-coverage' },
    { name: 'Thongs', slug: 'thongs' },
    { name: 'Bikini Panties', slug: 'bikini-panties' },
    { name: 'High-Waisted', slug: 'high-waisted' },
    { name: 'Seamless', slug: 'seamless' },
    { name: 'Nightwear', slug: 'nightwear' },
    { name: 'Loungewear', slug: 'loungewear' },
    { name: 'Silk & Satin', slug: 'silk-satin' },
    { name: 'Lace Intimates', slug: 'lace-intimates' },
    { name: 'Bridal Collection', slug: 'bridal' },
    { name: 'The Aura Series', slug: 'aura-series' },
    { name: 'New Arrivals', slug: 'new-arrivals' },
    { name: 'Sale', slug: 'sale' }
];

async function addCategories() {
    // Get existing categories to avoid duplicates
    const { data: existing } = await supabase.from('categories').select('slug');
    const existingSlugs = new Set(existing?.map(c => c.slug) || []);

    const newCategories = categoriesToAdd.filter(c => !existingSlugs.has(c.slug));

    if (newCategories.length === 0) {
        console.log('All categories already exist.');
        return;
    }

    const { data, error } = await supabase.from('categories').insert(newCategories);
    if (error) {
        console.error('Error adding categories:', error);
    } else {
        console.log(`Successfully added ${newCategories.length} categories.`);
    }
}

addCategories();
