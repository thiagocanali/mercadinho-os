import { tenantScope, assertTenantId } from '../domain/tenant.mjs';

/**
 * Builds an authorization context exclusively from a trusted server-side
 * session resolver and membership repository. Never pass request-body identity.
 * A real auth provider must implement resolveSession with cryptographic checks.
 */
export async function resolveVerifiedTenantContext({ resolveSession, findMembership }, request, tenantId) {
  if (typeof resolveSession !== 'function' || typeof findMembership !== 'function') {
    throw new TypeError('trusted session and membership adapters required');
  }
  assertTenantId(tenantId);
  const session = await resolveSession(request);
  if (!session || session.verified !== true || typeof session.userId !== 'string' || !session.userId.trim()) {
    throw new Error('authentication required');
  }
  const membership = await findMembership({ tenantId, userId: session.userId });
  if (!membership || membership.tenantId !== tenantId || membership.userId !== session.userId) {
    throw new Error('membership required');
  }
  return Object.freeze({
    verified: true,
    scope: tenantScope(tenantId),
    membership: Object.freeze({
      tenantId: membership.tenantId,
      userId: membership.userId,
      role: membership.role,
    }),
  });
}
