import { assertTenantId } from './tenant.mjs';

/**
 * Authorizes a requested operation using a membership retrieved on the server.
 * This is a pure policy check, not authentication or a substitute for database RLS.
 */
const PERMISSIONS = Object.freeze({
  owner: new Set(['products:read', 'products:write', 'stock:read', 'stock:write', 'members:manage']),
  manager: new Set(['products:read', 'products:write', 'stock:read', 'stock:write']),
  cashier: new Set(['products:read', 'stock:read']),
});

export function authorizeMembership(scope, membership, permission) {
  if (!scope || typeof scope !== 'object') throw new TypeError('scope required');
  assertTenantId(scope.tenantId);
  if (!membership || typeof membership !== 'object') throw new Error('membership required');
  if (membership.tenantId !== scope.tenantId) throw new Error('tenant mismatch');
  if (typeof membership.userId !== 'string' || !membership.userId.trim()) {
    throw new Error('verified userId required');
  }
  if (typeof permission !== 'string' || !PERMISSIONS[membership.role]?.has(permission)) {
    throw new Error('permission denied');
  }
  return true;
}
