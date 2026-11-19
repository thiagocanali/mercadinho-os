import test from 'node:test';
import assert from 'node:assert/strict';
import { executeStockMovement } from '../src/server/stock-application.mjs';

const tenantId = '11111111-1111-4111-8111-111111111111';
const userId = '22222222-2222-4222-8222-222222222222';
const input = { productId: '33333333-3333-4333-8333-333333333333', idempotencyKey: 'req-01', direction: 'in', quantity: 2 };
function setup(role='manager') {
  const queries = [];
  let released = false;
  const client = {
    query: async (sql, params) => {
      queries.push({ sql, params });
      if (sql.includes('FROM tenant_memberships')) return { rows: [{ tenant_id: tenantId, user_id: userId, role }] };
      if (sql.includes('FROM post_stock_movement')) return { rows: [{ movement_id: 'movement-1', resulting_quantity: '2', replayed: false }] };
      return { rows: [] };
    },
    release: () => { released = true; },
  };
  return { queries, pool: { connect: async () => client }, get released() { return released; } };
}
test('runs verified membership and stock posting in one scoped transaction', async () => {
  const db = setup();
  const result = await executeStockMovement({ pool: db.pool, resolveSession: async () => ({ verified: true, userId }) }, {}, tenantId, { ...input, tenantId: 'forged', actorUserId: 'forged' });
  assert.equal(result.resultingQuantity, 2);
  assert.deepEqual(db.queries.map(q => q.sql === 'BEGIN' ? 'BEGIN' : q.sql === 'COMMIT' ? 'COMMIT' : q.sql.includes('FROM tenant_memberships') ? 'membership' : q.sql.includes('FROM post_stock_movement') ? 'stock' : 'context'), ['BEGIN','context','membership','stock','COMMIT']);
  assert.deepEqual(db.queries.find(q => q.sql.includes('FROM post_stock_movement')).params.slice(0,3), [tenantId,input.productId,userId]);
  assert.equal(db.released,true);
});
test('rejects missing authentication before opening DB', async () => {
  let connected = false;
  await assert.rejects(executeStockMovement({ pool: { connect: async () => { connected = true; } }, resolveSession: async () => null }, {}, tenantId, input));
  assert.equal(connected,false);
});
test('rejects cashier and rolls back', async () => {
  const db = setup('cashier');
  await assert.rejects(executeStockMovement({ pool: db.pool, resolveSession: async () => ({ verified: true, userId }) }, {}, tenantId, input));
  assert.ok(db.queries.some(q => q.sql === 'ROLLBACK'));
  assert.ok(!db.queries.some(q => q.sql.includes('FROM post_stock_movement')));
  assert.equal(db.released,true);
});
