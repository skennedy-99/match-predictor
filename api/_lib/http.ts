export async function readJsonBody<T = any>(req: any): Promise<T> {
  if (req.body) {
    return typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  }
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(Buffer.from(chunk));
  }
  const raw = Buffer.concat(chunks).toString('utf8');
  return raw ? JSON.parse(raw) : ({} as T);
}

export function sendJson(res: any, status: number, body: any, headers?: Record<string, string>): void {
  if (!res.headersSent) {
    res.setHeader('Content-Type', 'application/json');
    if (headers) {
      for (const [k, v] of Object.entries(headers)) {
        res.setHeader(k, v);
      }
    }
    res.statusCode = status;
  }
  res.end(body != null ? JSON.stringify(body) : undefined);
}

export function methodGuard(req: any, res: any, methods: string[]): boolean {
  if (!methods.includes(req.method)) {
    sendJson(res, 405, { error: 'Method Not Allowed' });
    return false;
  }
  return true;
}


