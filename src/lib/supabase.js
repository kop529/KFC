import { createClient } from '@supabase/supabase-js';

// These will be pulled from your Vercel Environment Variables in production,
// and from your .env.local file during local development.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
