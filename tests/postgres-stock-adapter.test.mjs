import test from 'node:test';
import assert from 'node:assert/strict';
import { createPostgresStockAdapter } from '../src/server/postgres-stock-adapter.mjs';

const args = { tenantId: 'tenant-uuid', productId: 'product-uuid', actorUserId: 'actor-uuid', idempotencyKey: "x'); DROP TABLE products; --", direction: 'in', quantity: 2 };

test('uses parameterized SQL without interpolating user input', async () => {
  let sql, values;
  const adapter = createPostgresStockAdapter({ query: async (s, v) => {
    sql = s; values = v;
    return { rows: [{ movement_id: 'm1', resulting_quantity: '12', replayed: false }] };
  } });
  const result = await adapter.postStockMovement(args);
  assert.ok(sql.includes('$1::uuid'));
  assert.ok(!sql.includes(args.idempotencyKey));
  assert.deepEqual(values, Object.values(args));
  assert.deepEqual(result, { movementId: 'm1', resultingQuantity: 12, replayed: false });
});
test('parses postgres bigint and replay', async () => {
  const adapter = createPostgresStockAdapter({ query: async () => ({ rows: [{ movement_id: 'm2', resulting_quantity: 3n, replayed: true }] }) });
  assert.equal((await adapter.postStockMovement(args)).replayed, true);
});
test('rejects unsafe or malformed DB response', async () => {
  for (const rows of [[], [{ resulting_quantity: '-1' }], [{ resulting_quantity: '9007199254740992' }], [{ resulting_quantity: 'oops' }]]) {
    const adapter = createPostgresStockAdapter({ query: async () => ({ rows }) });
    await assert.rejects(adapter.postStockMovement(args));
  }
});
test('requires database client', () => {
  assert.throws(() => createPostgresStockAdapter(null));
});
