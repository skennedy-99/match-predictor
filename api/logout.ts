import type { VercelRequest, VercelResponse } from '@vercel/node';
import { clearCookie, SESSION_COOKIE } from './_lib/cookies';
import { sendJson, methodGuard } from './_lib/http';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!methodGuard(req, res, ['POST'])) return;
  clearCookie(res, SESSION_COOKIE);
  sendJson(res, 200, { ok: true });
}


