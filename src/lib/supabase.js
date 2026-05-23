import { createClient } from '@supabase/supabase-js';

// Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in:
//   Local dev  → .env.local
//   Production → Vercel dashboard → Settings → Environment Variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '[Supabase] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. ' +
    'Feedback features will be disabled. See docs/supabase-setup.md for instructions.'
  );
}

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
