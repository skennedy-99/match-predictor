import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getCookies, SESSION_COOKIE } from './_lib/cookies';
import { verifySession } from './_lib/jwt';
import { sendJson, methodGuard } from './_lib/http';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!methodGuard(req, res, ['GET'])) return;
  const cookies = getCookies(req);
  const token = cookies[SESSION_COOKIE];
  if (!token) return sendJson(res, 200, null);
  const payload = await verifySession(token);
  if (!payload) return sendJson(res, 200, null);
  sendJson(res, 200, { userId: payload.userId, name: payload.name });
}


