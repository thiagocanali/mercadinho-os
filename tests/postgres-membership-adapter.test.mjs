import test from 'node:test';
import assert from 'node:assert/strict';
import { createPostgresMembershipAdapter } from '../src/server/postgres-membership-adapter.mjs';

test('uses parameterized membership lookup', async () => {
  let query;
  const find = createPostgresMembershipAdapter({ query: async (sql, values) => {
    query = { sql, values };
    return { rows: [{ tenant_id: 't1', user_id: 'u1', role: 'owner' }] };
  } });
  assert.deepEqual(await find({ tenantId: 't1', userId: 'u1' }), { tenantId: 't1', userId: 'u1', role: 'owner' });
  assert.deepEqual(query.values, ['t1', 'u1']);
  assert.ok(query.sql.includes('$1::uuid'));
});
test('returns null when no membership exists', async () => {
  const find = createPostgresMembershipAdapter({ query: async () => ({ rows: [] }) });
  assert.equal(await find({ tenantId: 't1', userId: 'u1' }), null);
});
test('rejects malformed and cross-tenant rows', async () => {
  for (const rows of [[{ tenant_id: 't2', user_id: 'u1', role: 'owner' }], [{ tenant_id: 't1', user_id: 'u1', role: 'superadmin' }], [{}, {}]]) {
    const find = createPostgresMembershipAdapter({ query: async () => ({ rows }) });
    await assert.rejects(find({ tenantId: 't1', userId: 'u1' }));
  }
});
test('requires trusted DB adapter', () => {
  assert.throws(() => createPostgresMembershipAdapter(null));
});
