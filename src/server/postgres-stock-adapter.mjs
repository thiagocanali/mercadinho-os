/**
 * PostgreSQL stock adapter. Requires a trusted, server-only connection with
 * explicit EXECUTE grant. The query uses placeholders for all untrusted values.
 * This module does not create connections, authenticate users, or expose routes.
 */
export function createPostgresStockAdapter(client) {
  if (typeof client?.query !== 'function') throw new TypeError('PostgreSQL client.query required');
  return Object.freeze({
    async postStockMovement({ tenantId, productId, actorUserId, idempotencyKey, direction, quantity }) {
      const result = await client.query(
        'SELECT movement_id, resulting_quantity, replayed FROM post_stock_movement($1::uuid,$2::uuid,$3::uuid,$4::text,$5::text,$6::bigint)',
        [tenantId, productId, actorUserId, idempotencyKey, direction, quantity],
      );
      if (!result || !Array.isArray(result.rows) || result.rows.length !== 1) {
        throw new Error('unexpected stock posting result');
      }
      const row = result.rows[0];
      if (typeof row.movement_id !== 'string' || !row.movement_id.trim() || typeof row.replayed !== 'boolean') {
        throw new Error('invalid stock posting metadata');
      }
      const amount = typeof row.resulting_quantity === 'bigint'
        ? row.resulting_quantity
        : BigInt(row.resulting_quantity);
      if (amount < 0n || amount > BigInt(Number.MAX_SAFE_INTEGER)) {
        throw new RangeError('stock balance outside supported integer range');
      }
      return Object.freeze({
        movementId: row.movement_id,
        resultingQuantity: Number(amount),
        replayed: row.replayed === true,
      });
    },
  });
}
