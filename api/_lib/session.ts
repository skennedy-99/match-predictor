import type { VercelRequest } from '@vercel/node';
import { getCookies, SESSION_COOKIE } from './cookies';
import { verifySession } from './jwt';

export async function requireSession(req: VercelRequest): Promise<{ userId: string; name: string } | null> {
  const cookies = getCookies(req);
  const token = cookies[SESSION_COOKIE];
  if (!token) return null;
  const payload = await verifySession(token);
  if (!payload) return null;
  return { userId: payload.userId, name: payload.name };
}


