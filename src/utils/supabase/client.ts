import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Buat client hanya jika URL dan Key tersedia
export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);
