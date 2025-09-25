export const ENV = {
  SUPABASE_URL: process.env.SUPABASE_URL || '',
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  FAMILY_CODE: process.env.FAMILY_CODE || '',
  FOOTBALL_DATA_API_KEY: process.env.FOOTBALL_DATA_API_KEY || '',
  JWT_SECRET: process.env.JWT_SECRET || 'dev-secret-change'
};

export function ensureEnv(keys: (keyof typeof ENV)[]): void {
  const missing = keys.filter(k => !ENV[k]);
  if (missing.length > 0) {
    // For small app we just log; avoid throwing to keep endpoints usable for partial local dev
    console.warn('Missing env vars:', missing.join(', '));
  }
}


