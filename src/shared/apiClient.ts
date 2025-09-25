export type Session = { userId: string; name: string } | null;

async function http<T>(input: string, init?: RequestInit): Promise<T> {
  const res = await fetch(input, { credentials: 'include', headers: { 'Content-Type': 'application/json' }, ...init });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }
  if (res.status === 204) return undefined as unknown as T;
  return await res.json();
}

export async function getSession(): Promise<Session> {
  return await http<Session>('/api/session');
}

export async function fetchUserNames(): Promise<string[]> {
  return await http<string[]>('/api/users');
}

export async function login(name: string, familyCode: string): Promise<void> {
  await http<void>('/api/login', { method: 'POST', body: JSON.stringify({ name, familyCode }) });
}

export async function logout(): Promise<void> {
  await http<void>('/api/logout', { method: 'POST' });
}

export async function listFixtures(): Promise<any[]> {
  return await http<any[]>('/api/fixtures');
}

export async function getPredictions(): Promise<any[]> {
  return await http<any[]>('/api/predictions');
}

export async function upsertPrediction(fixtureId: string, predHome: number, predAway: number): Promise<void> {
  await http<void>('/api/predictions', { method: 'POST', body: JSON.stringify({ fixtureId, predHome, predAway }) });
}

export async function getLeaderboard(): Promise<any[]> {
  return await http<any[]>('/api/leaderboard');
}


