import { assertTenantId } from '../domain/tenant.mjs';
import { authorizeMembership } from '../domain/authorization.mjs';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * Server-only service boundary. Session identity and membership MUST be loaded
 * by a trusted server-side authentication adapter, never from request JSON.
 * DB adapter must use parameterized SQL and a restricted connection role.
 */
export async function postStockFromVerifiedContext(context, input, db) {
  if (!context || context.verified !== true) throw new Error('verified session required');
  if (!context.scope || !context.membership) throw new Error('tenant membership required');
  assertTenantId(context.scope.tenantId);
  authorizeMembership(context.scope, context.membership, 'stock:write');
  if (typeof db?.postStockMovement !== 'function') throw new TypeError('database adapter required');
  if (!input || typeof input !== 'object') throw new TypeError('movement input required');
  if (typeof input.productId !== 'string' || !UUID.test(input.productId)) throw new TypeError('productId must be a UUID');
  if (typeof input.idempotencyKey !== 'string' || !input.idempotencyKey.trim() || input.idempotencyKey.length > 128 || input.idempotencyKey !== input.idempotencyKey.trim()) throw new TypeError('valid idempotencyKey required');
  if (!['in', 'out'].includes(input.direction)) throw new TypeError('direction must be in or out');
  if (!Number.isSafeInteger(input.quantity) || input.quantity <= 0) throw new RangeError('quantity must be a positive integer');
  return db.postStockMovement({
    tenantId: context.scope.tenantId,
    actorUserId: context.membership.userId,
    productId: input.productId,
    idempotencyKey: input.idempotencyKey,
    direction: input.direction,
    quantity: input.quantity,
  });
}
