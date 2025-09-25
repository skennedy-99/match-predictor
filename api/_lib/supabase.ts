import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { ENV } from './env';

let cached: SupabaseClient | null = null;

export function getDb(): SupabaseClient {
  if (cached) return cached;
  if (!ENV.SUPABASE_URL || !ENV.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  }
  cached = createClient(ENV.SUPABASE_URL, ENV.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false }
  });
  return cached;
}


