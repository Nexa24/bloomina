import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: 'E:/Alanove/VS Code/Bloomina_dashboard/.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkCategories() {
    const { data, error } = await supabase.from('categories').select('*');
    if (error) {
        console.error('Error:', error);
    } else {
        console.log('Current Categories:', JSON.stringify(data, null, 2));
    }
}

checkCategories();
