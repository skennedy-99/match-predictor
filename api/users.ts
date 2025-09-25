import type { VercelRequest, VercelResponse } from '@vercel/node';
import { db } from './_lib/supabase';
import { sendJson, methodGuard } from './_lib/http';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!methodGuard(req, res, ['GET'])) return;
  const { data, error } = await db.from('users').select('name').order('name');
  if (error) return sendJson(res, 500, { error: error.message });
  sendJson(res, 200, data.map(u => u.name));
}


