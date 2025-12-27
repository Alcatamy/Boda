import { createClient } from '@supabase/supabase-js';

// Fallback to empty strings to prevent crash on build/start if variables are missing
// The client will not work, but the app won't crash immediately with "Client-side Exception"
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder';

if (process.env.NEXT_PUBLIC_SUPABASE_URL === undefined) {
  console.error('CRITICAL: NEXT_PUBLIC_SUPABASE_URL is missing!');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
