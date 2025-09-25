import { serialize, parse } from 'cookie';

export const SESSION_COOKIE = 'mp_session';

export function setCookie(res: any, name: string, value: string, options: Record<string, unknown> = {}): void {
  const headerValue = serialize(name, value, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    ...options
  } as any);
  const current = res.getHeader('Set-Cookie');
  if (current) {
    if (Array.isArray(current)) res.setHeader('Set-Cookie', [...current, headerValue]);
    else res.setHeader('Set-Cookie', [current as string, headerValue]);
  } else {
    res.setHeader('Set-Cookie', headerValue);
  }
}

export function clearCookie(res: any, name: string): void {
  setCookie(res, name, '', { maxAge: 0 });
}

export function getCookies(req: any): Record<string, string> {
  const header = req.headers?.cookie || '';
  return parse(header || '');
}


