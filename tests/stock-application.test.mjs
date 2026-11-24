import test from 'node:test';
import assert from 'node:assert/strict';
import { executeStockMovement } from '../src/server/stock-application.mjs';
import { createHmacSessionResolver } from '../src/server/hmac-session.mjs';
import { createHmac } from 'node:crypto';

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

test('rejects cross-tenant membership and never posts movement', async () => {
  const db = setup();
  const originalConnect = db.pool.connect;
  db.pool.connect = async () => {
    const client = await originalConnect();
    const query = client.query;
    client.query = async (sql, params) => sql.includes('FROM tenant_memberships')
      ? { rows: [{ tenant_id: '99999999-9999-4999-8999-999999999999', user_id: userId, role: 'owner' }] }
      : query(sql, params);
    return client;
  };
  await assert.rejects(executeStockMovement({
    pool: db.pool, resolveSession: async () => ({ verified: true, userId }),
  }, {}, tenantId, input), /invalid membership|membership required/);
  assert.ok(db.queries.some(q => q.sql === 'ROLLBACK'));
  assert.ok(!db.queries.some(q => q.sql.includes('FROM post_stock_movement')));
  assert.equal(db.released, true);
});
test('rejects invalid quantity without posting stock', async () => {
  const db = setup();
  await assert.rejects(executeStockMovement({
    pool: db.pool, resolveSession: async () => ({ verified: true, userId }),
  }, {}, tenantId, { ...input, quantity: -1 }));
  assert.ok(db.queries.some(q => q.sql === 'ROLLBACK'));
  assert.ok(!db.queries.some(q => q.sql.includes('FROM post_stock_movement')));
});
test('rejects failed session resolution before connecting', async () => {
  let connected = false;
  await assert.rejects(executeStockMovement({
    pool: { connect: async () => { connected = true; } },
    resolveSession: async () => { throw new Error('invalid signature'); },
  }, {}, tenantId, input), /invalid signature/);
  assert.equal(connected, false);
});

test('accepts cryptographically verified bearer token and rejects altered signature', async () => {
  const secret = 'test-only-high-entropy-secret-not-for-production-123';
  const issuer = 'mercadinho-auth', audience = 'mercadinho-api', timestamp = 1800000000;
  const resolveSession = createHmacSessionResolver({ secret, issuer, audience, now: () => timestamp });
  const encoded = [
    {alg:'HS256',typ:'JWT'},
    {iss:issuer,aud:audience,sub:userId,iat:timestamp-30,exp:timestamp+60},
  ].map(x => Buffer.from(JSON.stringify(x)).toString('base64url')).join('.');
  const token = encoded + '.' + createHmac('sha256',secret).update(encoded).digest('base64url');
  const db = setup();
  const result = await executeStockMovement({ pool: db.pool, resolveSession },
    {headers:{authorization:'Bearer '+token}}, tenantId, input);
  assert.equal(result.resultingQuantity, 2);
  assert.equal(db.released, true);
  let connected = false;
  const signature = token.split('.')[2];
  const badToken = encoded + '.' + (signature.startsWith('A') ? 'B' : 'A') + signature.slice(1);
  await assert.rejects(executeStockMovement({
    pool: {connect: async () => { connected = true; }},
    resolveSession,
  }, {headers:{authorization:'Bearer '+badToken}}, tenantId, input));
  assert.equal(connected,false);
});
