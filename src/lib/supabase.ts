import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase: SupabaseClient | null =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

export function getSupabase(): SupabaseClient {
  if (!supabase) throw new Error('Supabase not configured');
  return supabase;
}

export function createSupabaseClient(url: string, anonKey: string): SupabaseClient {
  return createClient(url, anonKey);
}
