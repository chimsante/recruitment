import { createClient } from '@supabase/supabase-js'

// Debug logging to see what values we're getting
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('Environment variables:', import.meta.env);

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;


if (!supabaseUrl) {
    console.error('Missing VITE_SUPABASE_URL');
    console.error('Available env vars:', Object.keys(import.meta.env));
}

if (!supabaseKey) {
    console.error('Missing VITE_SUPABASE_ANON_KEY');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;