import { assertTenantId } from '../domain/tenant.mjs';

/**
 * A dedicated connection from a trusted backend pool is required.
 * The tenant setting is LOCAL to the transaction, never session-global.
 * The caller must supply tenantId from verified server-side context.
 * Do not expose this API to untrusted SQL clients.
 */
export async function withTenantTransaction(pool, tenantId, operation) {
  assertTenantId(tenantId);
  if (typeof pool?.connect !== 'function' || typeof operation !== 'function') {
    throw new TypeError('pool.connect and operation callback required');
  }
  const client = await pool.connect();
  if (typeof client?.query !== 'function' || typeof client?.release !== 'function') {
    throw new TypeError('invalid dedicated PostgreSQL connection');
  }
  let begun = false;
  try {
    await client.query('BEGIN');
    begun = true;
    await client.query("SELECT set_config('app.tenant_id', $1, true)", [tenantId]);
    const result = await operation(client);
    await client.query('COMMIT');
    begun = false;
    return result;
  } catch (error) {
    if (begun) {
      try { await client.query('ROLLBACK'); } catch { /* preserve original error */ }
    }
    throw error;
  } finally {
    client.release();
  }
}
