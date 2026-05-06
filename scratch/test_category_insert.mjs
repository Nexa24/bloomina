import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: 'E:/Alanove/VS Code/Bloomina_dashboard/.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function testInsert() {
    const payload = {
        name: 'Test Category',
        slug: 'test-category',
        image: 'https://example.com/image.jpg',
        bg_color: '#ff0000',
        badge: 'New',
        image_tilt: 0,
        image_offset_y: 0,
        image_offset_x: 0,
        image_scale: 1.0,
        image_side: 'left'
    };

    const { data, error } = await supabase.from('categories').insert([payload]);
    if (error) {
        console.error('Insert failed:', error.message);
        console.error('Hint:', error.hint);
        console.error('Details:', error.details);
    } else {
        console.log('Insert successful!');
        // Clean up
        await supabase.from('categories').delete().eq('slug', 'test-category');
    }
}

testInsert();
