import test from 'node:test';
import assert from 'node:assert/strict';
import { assertTenantId, tenantScope, assertSameTenant } from '../src/domain/tenant.mjs';

test('validates tenant identifiers', () => {
  assert.equal(assertTenantId('market_01'), 'market_01');
  for (const id of ['', ' ', '../x', 'a/b', 'a.b', null, 123, 'a'.repeat(65)]) {
    assert.throws(() => assertTenantId(id));
  }
});
test('creates immutable tenant scope', () => {
  const scope = tenantScope('market_01');
  assert.equal(scope.tenantId, 'market_01');
  assert.ok(Object.isFrozen(scope));
});
test('accepts matching record tenant', () => {
  const record = { tenantId: 'market_01', sku: '123' };
  assert.equal(assertSameTenant(tenantScope('market_01'), record), record);
});
test('rejects cross-tenant record', () => {
  assert.throws(() => assertSameTenant(tenantScope('market_01'), { tenantId: 'market_02' }));
});
test('fails closed for missing scope and missing tenant on record', () => {
  assert.throws(() => assertSameTenant(null, { tenantId: 'market_01' }));
  assert.throws(() => assertSameTenant(tenantScope('market_01'), {}));
  assert.throws(() => assertSameTenant(tenantScope('market_01'), null));
});
