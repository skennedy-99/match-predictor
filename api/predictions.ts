import type { VercelRequest, VercelResponse } from '@vercel/node';
import { db } from './_lib/supabase';
import { readJsonBody, sendJson, methodGuard } from './_lib/http';
import { requireSession } from './_lib/session';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') return getPredictions(req, res);
  if (req.method === 'POST') return upsertPrediction(req, res);
  return methodGuard(req, res, ['GET', 'POST']);
}

async function getPredictions(req: VercelRequest, res: VercelResponse) {
  const session = await requireSession(req);
  if (!session) return sendJson(res, 401, { error: 'Unauthorized' });
  const { data, error } = await db
    .from('predictions')
    .select('fixture_id, pred_home_goals, pred_away_goals')
    .eq('user_id', session.userId);
  if (error) return sendJson(res, 500, { error: error.message });
  sendJson(res, 200, data);
}

async function upsertPrediction(req: VercelRequest, res: VercelResponse) {
  const session = await requireSession(req);
  if (!session) return sendJson(res, 401, { error: 'Unauthorized' });
  const body = await readJsonBody<{ fixtureId: string; predHome: number; predAway: number }>(req);
  const { fixtureId, predHome, predAway } = body || ({} as any);
  if (!fixtureId || predHome == null || predAway == null) return sendJson(res, 400, { error: 'Missing fields' });
  const { data: fixture, error: fxErr } = await db
    .from('fixtures')
    .select('date, status')
    .eq('id', fixtureId)
    .maybeSingle();
  if (fxErr) return sendJson(res, 500, { error: fxErr.message });
  if (!fixture) return sendJson(res, 404, { error: 'Fixture not found' });
  const locked = new Date(fixture.date).getTime() <= Date.now() || fixture.status !== 'SCHEDULED';
  if (locked) return sendJson(res, 409, { error: 'Fixture locked' });
  const { error } = await db
    .from('predictions')
    .upsert({ user_id: session.userId, fixture_id: fixtureId, pred_home_goals: predHome, pred_away_goals: predAway }, { onConflict: 'user_id,fixture_id' });
  if (error) return sendJson(res, 500, { error: error.message });
  sendJson(res, 200, { ok: true });
}


