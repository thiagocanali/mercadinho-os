import { resolveVerifiedTenantContext } from './verified-context.mjs';
import { postStockFromVerifiedContext } from './stock-service.mjs';
import { createPostgresMembershipAdapter } from './postgres-membership-adapter.mjs';
import { createPostgresStockAdapter } from './postgres-stock-adapter.mjs';
import { withTenantTransaction } from './tenant-transaction.mjs';

/**
 * Composes the stock use case. The session resolver MUST validate a real
 * provider session on the server. The tenant ID must be selected only from
 * a server-validated route, not from client-provided identity fields.
 *
 * No HTTP route is exported here; exposing one requires CSRF, rate limiting,
 * secure cookie handling, auth-provider integration and threat review.
 */
export async function executeStockMovement({ pool, resolveSession }, request, tenantId, input) {
  if (typeof resolveSession !== 'function') throw new TypeError('trusted session resolver required');
  // Verify identity before acquiring a database connection.
  const session = await resolveSession(request);
  if (!session || session.verified !== true || typeof session.userId !== 'string' || !session.userId.trim()) {
    throw new Error('authentication required');
  }
  return withTenantTransaction(pool, tenantId, async client => {
    const context = await resolveVerifiedTenantContext({
      resolveSession: async () => session,
      findMembership: createPostgresMembershipAdapter(client),
    }, request, tenantId);
    return postStockFromVerifiedContext(context, input, createPostgresStockAdapter(client));
  });
}
