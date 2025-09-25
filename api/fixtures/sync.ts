import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getDb } from '../_lib/supabase';
import { sendJson, methodGuard } from '../_lib/http';
import { ENV } from '../_lib/env';

type Match = {
  id: string;
  utcDate: string;
  status: string;
  homeTeam: { name: string };
  awayTeam: { name: string };
  score: { fullTime: { home: number | null; away: number | null } };
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!methodGuard(req, res, ['GET'])) return;
  if (!ENV.FOOTBALL_DATA_API_KEY) return sendJson(res, 500, { error: 'Missing FOOTBALL_DATA_API_KEY' });
  try {
    // Manchester United team id is 66 on football-data.org
    const url = `https://api.football-data.org/v4/teams/66/matches?status=SCHEDULED,FINISHED`;
    const r = await fetch(url, { headers: { 'X-Auth-Token': ENV.FOOTBALL_DATA_API_KEY } as any });
    if (!r.ok) {
      const t = await r.text();
      return sendJson(res, r.status, { error: t });
    }
    const json = await r.json();
    const matches: Match[] = json.matches || [];

    const upserts = matches.map(m => ({
      id: String(m.id),
      date: m.utcDate,
      status: m.status,
      home_team: m.homeTeam.name,
      away_team: m.awayTeam.name,
      home_goals: m.score.fullTime.home,
      away_goals: m.score.fullTime.away,
      is_manchester_united_home: m.homeTeam.name === 'Manchester United'
    }));

    const db = getDb();
    const { error } = await db.from('fixtures').upsert(upserts, { onConflict: 'id' });
    if (error) return sendJson(res, 500, { error: error.message });
    sendJson(res, 200, { count: upserts.length });
  } catch (e: any) {
    sendJson(res, 500, { error: e?.message || 'sync failed' });
  }
}


