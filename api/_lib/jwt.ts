import { SignJWT, jwtVerify } from 'jose';
import { ENV } from './env';

const encoder = new TextEncoder();
const secretKey = encoder.encode(ENV.JWT_SECRET);

export type SessionPayload = {
  userId: string;
  name: string;
  ver: number;
};

export async function signSession(payload: SessionPayload): Promise<string> {
  const token = await new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secretKey);
  return token;
}

export async function verifySession(token: string): Promise<SessionPayload | null> {
  try {
    const res = await jwtVerify(token, secretKey);
    return res.payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}


