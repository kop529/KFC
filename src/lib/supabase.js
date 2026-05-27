import { createClient } from '@supabase/supabase-js';

// Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in:
//   Local dev  → .env.local
//   Production → Vercel dashboard → Settings → Environment Variables

// .trim() removes hidden whitespace/carriage-return characters on Windows
const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '[Supabase] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. ' +
    'Feedback features will be disabled.'
  );
} else if (import.meta.env.DEV) {
  // P-03 Fix: Only log the URL in dev builds, never in production
  console.log('[Supabase] Connecting to:', supabaseUrl);
}

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
