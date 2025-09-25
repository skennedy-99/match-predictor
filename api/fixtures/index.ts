import type { VercelRequest, VercelResponse } from '@vercel/node';
import { db } from '../_lib/supabase';
import { sendJson, methodGuard } from '../_lib/http';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!methodGuard(req, res, ['GET'])) return;
  const { data, error } = await db
    .from('fixtures')
    .select('id, date, status, home_team, away_team, home_goals, away_goals')
    .order('date', { ascending: true });
  if (error) return sendJson(res, 500, { error: error.message });
  sendJson(res, 200, data);
}


