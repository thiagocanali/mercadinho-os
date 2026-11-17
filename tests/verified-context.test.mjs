import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveVerifiedTenantContext } from '../src/server/verified-context.mjs';

const adapters = {
  resolveSession: async () => ({ verified: true, userId: 'user_01' }),
  findMembership: async ({ tenantId, userId }) => ({ tenantId, userId, role: 'manager' }),
};
test('derives membership from verified server session', async () => {
  const ctx = await resolveVerifiedTenantContext(adapters, { body: { userId: 'evil' } }, 'market_01');
  assert.equal(ctx.membership.userId, 'user_01');
  assert.equal(ctx.scope.tenantId, 'market_01');
  assert.ok(Object.isFrozen(ctx));
});
test('rejects missing and unverified sessions', async () => {
  for (const session of [null, { verified: false, userId: 'user_01' }, { verified: true, userId: '' }]) {
    await assert.rejects(resolveVerifiedTenantContext({ ...adapters, resolveSession: async () => session }, {}, 'market_01'));
  }
});
test('rejects missing and cross-tenant membership', async () => {
  for (const membership of [null, { tenantId: 'market_02', userId: 'user_01', role: 'owner' }, { tenantId: 'market_01', userId: 'evil', role: 'owner' }]) {
    await assert.rejects(resolveVerifiedTenantContext({ ...adapters, findMembership: async () => membership }, {}, 'market_01'));
  }
});
test('rejects invalid tenant and missing adapters', async () => {
  await assert.rejects(resolveVerifiedTenantContext(adapters, {}, '../bad'));
  await assert.rejects(resolveVerifiedTenantContext({}, {}, 'market_01'));
});
