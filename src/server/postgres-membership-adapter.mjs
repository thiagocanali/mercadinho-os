/**
 * Membership lookup for a trusted server-side PostgreSQL connection.
 * This does not authenticate users or grant database permissions.
 */
export function createPostgresMembershipAdapter(client) {
  if (typeof client?.query !== 'function') throw new TypeError('PostgreSQL client.query required');
  return async function findMembership({ tenantId, userId }) {
    if (typeof tenantId !== 'string' || !tenantId.trim() || typeof userId !== 'string' || !userId.trim()) {
      throw new TypeError('tenantId and userId required');
    }
    const result = await client.query(
      'SELECT tenant_id, user_id, role FROM tenant_memberships WHERE tenant_id = $1::uuid AND user_id = $2::uuid',
      [tenantId, userId],
    );
    if (!result || !Array.isArray(result.rows) || result.rows.length > 1) {
      throw new Error('unexpected membership query result');
    }
    if (result.rows.length === 0) return null;
    const row = result.rows[0];
    if (row.tenant_id !== tenantId || row.user_id !== userId || !['owner','manager','cashier'].includes(row.role)) {
      throw new Error('invalid membership returned');
    }
    return Object.freeze({ tenantId: row.tenant_id, userId: row.user_id, role: row.role });
  };
}
