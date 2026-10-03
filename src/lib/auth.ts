import crypto from 'crypto';

const AUTH_SECRET = process.env.AUTH_SECRET || 'lazaro-imob-secret-key-2026-serra-gaucha-high-security';
const SESSION_COOKIE_NAME = 'imob_admin_session';

export interface SessionPayload {
  email: string;
  role: 'admin';
  exp: number; // timestamp ms
}

/** Cria um token HMAC assinado para a sessão */
export function createSessionToken(email: string): string {
  const exp = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 dias
  const payload: SessionPayload = { email, role: 'admin', exp };
  const payloadBase64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
  
  const signature = crypto
    .createHmac('sha256', AUTH_SECRET)
    .update(payloadBase64)
    .digest('base64url');

  return `${payloadBase64}.${signature}`;
}

/** Valida o token e verifica se não expirou */
export function verifySessionToken(token: string | undefined | null): SessionPayload | null {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;

  const [payloadBase64, signature] = parts;
  const expectedSignature = crypto
    .createHmac('sha256', AUTH_SECRET)
    .update(payloadBase64)
    .digest('base64url');

  if (signature !== expectedSignature) {
    return null;
  }

  try {
    const payloadJson = Buffer.from(payloadBase64, 'base64url').toString('utf-8');
    const payload: SessionPayload = JSON.parse(payloadJson);
    if (Date.now() > payload.exp) {
      return null; // Expirado
    }
    return payload;
  } catch {
    return null;
  }
}

export { SESSION_COOKIE_NAME };
