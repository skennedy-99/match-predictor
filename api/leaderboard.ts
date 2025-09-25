import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getDb } from './_lib/supabase';
import { sendJson, methodGuard } from './_lib/http';

function points(predHome: number, predAway: number, realHome: number | null, realAway: number | null) {
  if (realHome == null || realAway == null) return { points: 0, exact: 0, outcome: 0 };
  const exact = predHome === realHome && predAway === realAway;
  if (exact) return { points: 3, exact: 1, outcome: 0 };
  const predictedOutcome = Math.sign(predHome - predAway);
  const actualOutcome = Math.sign(realHome - realAway);
  const isDrawPred = predHome === predAway;
  const isDrawActual = realHome === realAway;
  const outcomeMatch = (isDrawPred && isDrawActual) || predictedOutcome === actualOutcome;
  return { points: outcomeMatch ? 1 : 0, exact: 0, outcome: outcomeMatch ? 1 : 0 };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!methodGuard(req, res, ['GET'])) return;
  try {
    const db = getDb();
    const { data: users, error: usersErr } = await db.from('users').select('id, name').order('name');
    if (usersErr) return sendJson(res, 500, { error: usersErr.message });

    const { data: rows, error } = await db
      .from('predictions')
      .select('user_id, pred_home_goals, pred_away_goals, fixtures(home_goals, away_goals)');
    if (error) return sendJson(res, 500, { error: error.message });

  const acc = new Map<string, { name: string; points: number; exact: number; outcome: number }>();
  users.forEach(u => acc.set(u.id, { name: u.name, points: 0, exact: 0, outcome: 0 }));

  rows.forEach(r => {
    const u = acc.get(r.user_id);
    if (!u) return;
    const resPts = points(r.pred_home_goals, r.pred_away_goals, r.fixtures?.home_goals ?? null, r.fixtures?.away_goals ?? null);
    u.points += resPts.points;
    u.exact += resPts.exact;
    u.outcome += resPts.outcome;
  });

  const out = Array.from(acc.entries()).map(([user_id, v]) => ({ user_id, name: v.name, points: v.points, exact_count: v.exact, outcome_count: v.outcome }))
    .sort((a, b) => b.points - a.points || b.exact_count - a.exact_count);
    sendJson(res, 200, out);
  } catch (e: any) {
    return sendJson(res, 500, { error: e?.message || 'Server error' });
  }
}


