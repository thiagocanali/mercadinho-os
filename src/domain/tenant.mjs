/**
 * Explicit tenant scoping for application services.
 * This is NOT authentication or database row-level security.
 * The caller must obtain the tenant ID from a verified server-side session.
 */
const TENANT_ID = /^[a-zA-Z0-9][a-zA-Z0-9_-]{0,63}$/;

export function assertTenantId(tenantId) {
  if (typeof tenantId !== 'string' || !TENANT_ID.test(tenantId)) {
    throw new TypeError('tenantId must be a valid non-empty identifier');
  }
  return tenantId;
}

export function tenantScope(tenantId) {
  const verifiedTenantId = assertTenantId(tenantId);
  return Object.freeze({ tenantId: verifiedTenantId });
}

export function assertSameTenant(scope, record) {
  if (!scope || typeof scope !== 'object') {
    throw new TypeError('scope is required');
  }
  assertTenantId(scope.tenantId);
  if (!record || typeof record !== 'object') {
    throw new TypeError('record is required');
  }
  if (record.tenantId !== scope.tenantId) {
    throw new Error('record does not belong to the active tenant');
  }
  return record;
}
