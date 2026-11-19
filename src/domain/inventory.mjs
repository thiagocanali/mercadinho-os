import { assertSameTenant, assertTenantId } from './tenant.mjs';

function assertUnits(value, name) {
  if (!Number.isSafeInteger(value) || value < 0) {
    throw new RangeError(`${name} must be a non-negative safe integer`);
  }
  return value;
}

/**
 * Pure stock transition for integer-unit products.
 * Never trusts tenant IDs from the client; scope must come from a verified server session.
 * Caller must persist this atomically with optimistic locking / DB transaction.
 */
export function applyStockMovement(scope, stock, movement) {
  if (!scope || typeof scope !== 'object') throw new TypeError('scope is required');
  assertTenantId(scope.tenantId);
  assertSameTenant(scope, stock);
  assertSameTenant(scope, movement);
  if (typeof stock.productId !== 'string' || !stock.productId.trim()) {
    throw new TypeError('stock productId is required');
  }
  if (movement.productId !== stock.productId) {
    throw new Error('movement product does not match stock product');
  }
  assertUnits(stock.quantity, 'stock.quantity');
  if (!Number.isSafeInteger(movement.quantity) || movement.quantity <= 0) {
    throw new RangeError('movement.quantity must be a positive safe integer');
  }
  if (!['in', 'out'].includes(movement.type)) {
    throw new TypeError('movement.type must be in or out');
  }
  const quantity = movement.type === 'in'
    ? BigInt(stock.quantity) + BigInt(movement.quantity)
    : BigInt(stock.quantity) - BigInt(movement.quantity);
  if (quantity < 0n) throw new RangeError('insufficient stock');
  if (quantity > BigInt(Number.MAX_SAFE_INTEGER)) throw new RangeError('stock overflow');
  return Object.freeze({ ...stock, quantity: Number(quantity) });
}
