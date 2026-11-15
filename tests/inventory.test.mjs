import test from 'node:test';
import assert from 'node:assert/strict';
import { tenantScope } from '../src/domain/tenant.mjs';
import { applyStockMovement } from '../src/domain/inventory.mjs';

const scope = tenantScope('market_01');
const stock = () => ({ tenantId: 'market_01', productId: 'p1', quantity: 10 });
const movement = (type, quantity) => ({ tenantId: 'market_01', productId: 'p1', type, quantity });

test('stock entry and exit are immutable', () => {
  const initial = stock();
  assert.equal(applyStockMovement(scope, initial, movement('in', 5)).quantity, 15);
  assert.equal(applyStockMovement(scope, initial, movement('out', 4)).quantity, 6);
  assert.equal(initial.quantity, 10);
});
test('stock may reach zero', () => {
  assert.equal(applyStockMovement(scope, stock(), movement('out', 10)).quantity, 0);
});
test('insufficient stock is rejected', () => {
  assert.throws(() => applyStockMovement(scope, stock(), movement('out', 11)), /insufficient/);
});
test('cross-tenant stock and movement are rejected', () => {
  assert.throws(() => applyStockMovement(scope, { ...stock(), tenantId: 'market_02' }, movement('in', 1)));
  assert.throws(() => applyStockMovement(scope, stock(), { ...movement('in', 1), tenantId: 'market_02' }));
});
test('wrong product is rejected', () => {
  assert.throws(() => applyStockMovement(scope, stock(), { ...movement('in', 1), productId: 'p2' }));
});
test('invalid quantity and type are rejected', () => {
  for (const quantity of [0, -1, 0.1, NaN, Number.MAX_SAFE_INTEGER + 1]) {
    assert.throws(() => applyStockMovement(scope, stock(), movement('in', quantity)));
  }
  assert.throws(() => applyStockMovement(scope, stock(), movement('adjust', 1)));
});
test('overflow is rejected', () => {
  assert.throws(() => applyStockMovement(scope, { ...stock(), quantity: Number.MAX_SAFE_INTEGER }, movement('in', 1)));
});
test('malformed stock or scope is rejected', () => {
  assert.throws(() => applyStockMovement(null, stock(), movement('in', 1)));
  assert.throws(() => applyStockMovement(scope, { ...stock(), productId: '' }, movement('in', 1)));
  assert.throws(() => applyStockMovement(scope, { ...stock(), quantity: -1 }, movement('in', 1)));
});
