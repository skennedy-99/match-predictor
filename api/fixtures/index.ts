import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getDb } from '../_lib/supabase';
import { sendJson, methodGuard } from '../_lib/http';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!methodGuard(req, res, ['GET'])) return;
  try {
    const db = getDb();
    const { data, error } = await db
      .from('fixtures')
      .select('id, date, status, home_team, away_team, home_goals, away_goals')
      .order('date', { ascending: true });
    if (error) return sendJson(res, 500, { error: error.message });
    sendJson(res, 200, data);
  } catch (e: any) {
    return sendJson(res, 500, { error: e?.message || 'Server error' });
  }
}


