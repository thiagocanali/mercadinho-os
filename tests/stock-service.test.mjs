import test from 'node:test';
import assert from 'node:assert/strict';
import { postStockFromVerifiedContext } from '../src/server/stock-service.mjs';
import { tenantScope } from '../src/domain/tenant.mjs';

const context = (role='manager') => ({
  verified: true,
  scope: tenantScope('market_01'),
  membership: { tenantId: 'market_01', userId: 'user_01', role },
});
const input = () => ({ productId: 'p1', idempotencyKey: 'req-1', direction: 'in', quantity: 3 });

test('passes only verified identity and scoped fields to adapter', async () => {
  let received;
  const result = await postStockFromVerifiedContext(context(), { ...input(), tenantId: 'evil', actorUserId: 'evil' }, {
    postStockMovement: async data => { received = data; return { resultingQuantity: 3 }; }
  });
  assert.equal(result.resultingQuantity, 3);
  assert.equal(received.tenantId, 'market_01');
  assert.equal(received.actorUserId, 'user_01');
});
test('rejects unverified session without touching DB', async () => {
  let called = false;
  await assert.rejects(postStockFromVerifiedContext({ ...context(), verified: false }, input(), {
    postStockMovement: async () => { called = true; }
  }));
  assert.equal(called, false);
});
test('rejects cashier writes', async () => {
  await assert.rejects(postStockFromVerifiedContext(context('cashier'), input(), {
    postStockMovement: async () => { throw Error('must not call'); }
  }));
});
test('rejects cross-tenant membership', async () => {
  await assert.rejects(postStockFromVerifiedContext({
    ...context(), membership: { tenantId: 'market_02', userId: 'user_01', role: 'owner' }
  }, input(), { postStockMovement: async () => null }));
});
test('rejects invalid input before DB call', async () => {
  for (const bad of [{ ...input(), quantity: 0 }, { ...input(), direction: 'delete' }, { ...input(), idempotencyKey: '' }, { ...input(), productId: '' }]) {
    await assert.rejects(postStockFromVerifiedContext(context(), bad, { postStockMovement: async () => null }));
  }
});
