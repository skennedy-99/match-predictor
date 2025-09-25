import type { VercelRequest, VercelResponse } from '@vercel/node';
import { db } from './_lib/supabase';
import { readJsonBody, sendJson, methodGuard } from './_lib/http';
import { ENV } from './_lib/env';
import { signSession } from './_lib/jwt';
import { SESSION_COOKIE, setCookie } from './_lib/cookies';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!methodGuard(req, res, ['POST'])) return;
  const body = await readJsonBody<{ name: string; familyCode: string }>(req);
  const { name, familyCode } = body || ({} as any);
  if (!name || !familyCode) return sendJson(res, 400, { error: 'Missing name or familyCode' });

  if (!ENV.FAMILY_CODE || familyCode !== ENV.FAMILY_CODE) {
    return sendJson(res, 401, { error: 'Invalid code' });
  }

  const { data: user, error } = await db.from('users').select('id, name').eq('name', name).maybeSingle();
  if (error) return sendJson(res, 500, { error: error.message });
  if (!user) return sendJson(res, 404, { error: 'User not found' });

  const token = await signSession({ userId: user.id, name: user.name, ver: 1 });
  setCookie(res, SESSION_COOKIE, token, { maxAge: 60 * 60 * 24 * 7 });
  sendJson(res, 200, { ok: true });
}


