import { createHmac, timingSafeEqual } from 'node:crypto';

// Server-only verification of an HS256 bearer token issued by a trusted
// identity service. No cookie authentication, token minting, or HTTP route.
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const BASE64URL = /^[A-Za-z0-9_-]+$/;
function decodeSegment(segment) {
  if (!segment || !BASE64URL.test(segment) || segment.length > 4096) throw new Error('invalid token');
  const bytes = Buffer.from(segment, 'base64url');
  if (bytes.toString('base64url') !== segment) throw new Error('invalid token');
  return JSON.parse(bytes.toString('utf8'));
}

/**
 * secret must be high entropy (>=32 UTF-8 bytes), server-only and never
 * supplied by a request. issuer and audience must be exact configured values.
 * Tokens are assumed to contain the internal app_users UUID as sub.
 */
export function createHmacSessionResolver({ secret, issuer, audience, now = () => Math.floor(Date.now() / 1000) }) {
  if (typeof secret !== 'string' || Buffer.byteLength(secret, 'utf8') < 32 ||
      typeof issuer !== 'string' || !issuer.trim() ||
      typeof audience !== 'string' || !audience.trim() || typeof now !== 'function') {
    throw new TypeError('valid server-side signing secret, issuer and audience required');
  }
  const key = Buffer.from(secret, 'utf8');
  return async function resolveSession(request) {
    const authorization = request?.headers?.authorization ?? request?.headers?.Authorization;
    if (typeof authorization !== 'string' || !/^Bearer [A-Za-z0-9_.-]+$/.test(authorization)) {
      throw new Error('authentication required');
    }
    const token = authorization.slice(7);
    if (token.length > 8192) throw new Error('invalid token');
    const parts = token.split('.');
    if (parts.length !== 3) throw new Error('invalid token');
    let header, payload;
    try {
      header = decodeSegment(parts[0]);
      payload = decodeSegment(parts[1]);
    } catch { throw new Error('invalid token'); }
    if (!header || header.alg !== 'HS256' || (header.typ !== undefined && header.typ !== 'JWT') ||
        header.crit !== undefined || header.kid !== undefined ||
        !payload || typeof payload !== 'object' || Array.isArray(payload)) {
      throw new Error('invalid token');
    }
    const signature = createHmac('sha256', key).update(parts[0] + '.' + parts[1]).digest();
    const provided = Buffer.from(parts[2], 'base64url');
    if (provided.length !== signature.length || !timingSafeEqual(provided, signature) ||
        provided.toString('base64url') !== parts[2]) throw new Error('invalid token');
    const current = now();
    if (!Number.isSafeInteger(current) || payload.iss !== issuer || payload.aud !== audience ||
        typeof payload.sub !== 'string' || !UUID.test(payload.sub) ||
        !Number.isSafeInteger(payload.exp) || payload.exp <= current ||
        !Number.isSafeInteger(payload.iat) || payload.iat > current ||
        payload.exp - payload.iat > 3600 ||
        (payload.nbf !== undefined && (!Number.isSafeInteger(payload.nbf) || payload.nbf > current))) {
      throw new Error('invalid token');
    }
    return Object.freeze({ verified: true, userId: payload.sub });
  };
}
