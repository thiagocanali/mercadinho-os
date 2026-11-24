import test from 'node:test';
import assert from 'node:assert/strict';
import { withTenantTransaction } from '../src/server/tenant-transaction.mjs';

test('uses transaction-local parameterized tenant context', async () => {
  const queries = [];
  let released = false;
  const pool = { connect: async () => ({
    query: async (...args) => { queries.push(args); return { rows: [] }; },
    release: () => { released = true; },
  }) };
  const value = await withTenantTransaction(pool, '11111111-1111-4111-8111-111111111111', async client => {
    await client.query('SELECT 1');
    return 42;
  });
  assert.equal(value, 42);
  assert.deepEqual(queries.map(q => q[0]), ['BEGIN', "SELECT set_config('app.tenant_id', $1, true)", 'SELECT 1', 'COMMIT']);
  assert.deepEqual(queries[1][1], ['11111111-1111-4111-8111-111111111111']);
  assert.equal(released, true);
});
test('rolls back and releases on error', async () => {
  const queries = [];
  let released = false;
  const pool = { connect: async () => ({
    query: async sql => { queries.push(sql); },
    release: () => { released = true; },
  }) };
  await assert.rejects(withTenantTransaction(pool, '11111111-1111-4111-8111-111111111111', async () => { throw Error('boom'); }), /boom/);
  assert.ok(queries.includes('ROLLBACK'));
  assert.ok(!queries.includes('COMMIT'));
  assert.equal(released, true);
});
test('rejects invalid context before connecting', async () => {
  let connected = false;
  await assert.rejects(withTenantTransaction({ connect: async () => { connected = true; } }, '../bad', async () => null));
  assert.equal(connected, false);
});

test('releases malformed client with release method', async () => {
  let released = false;
  await assert.rejects(withTenantTransaction({ connect: async () => ({
    release: () => { released = true; },
  }) }, '11111111-1111-4111-8111-111111111111', async () => null), /invalid dedicated PostgreSQL connection/);
  assert.equal(released, true);
});
test('rolls back when commit fails and preserves error', async () => {
  const queries = [];
  let released = false;
  const pool = { connect: async () => ({
    query: async sql => {
      queries.push(sql);
      if (sql === 'COMMIT') throw Error('commit failed');
    },
    release: () => { released = true; },
  }) };
  await assert.rejects(withTenantTransaction(pool, '11111111-1111-4111-8111-111111111111', async () => 'ok'), /commit failed/);
  assert.ok(queries.includes('ROLLBACK'));
  assert.equal(released, true);
});

test('rejects non-UUID tenant identifier before acquiring connection', async () => {
  let connected = false;
  await assert.rejects(withTenantTransaction({
    connect: async () => { connected = true; },
  }, 'tenant_01', async () => null), /must be a UUID/);
  assert.equal(connected, false);
});
