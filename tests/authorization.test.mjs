import test from 'node:test';
import assert from 'node:assert/strict';
import { authorizeMembership } from '../src/domain/authorization.mjs';
import { tenantScope } from '../src/domain/tenant.mjs';

const scope = tenantScope('tenant_01');
const member = (role) => ({ tenantId: 'tenant_01', userId: 'user_01', role });

test('owner can manage memberships', () => {
  assert.equal(authorizeMembership(scope, member('owner'), 'members:manage'), true);
});
test('manager can update stock but cannot manage memberships', () => {
  assert.equal(authorizeMembership(scope, member('manager'), 'stock:write'), true);
  assert.throws(() => authorizeMembership(scope, member('manager'), 'members:manage'));
});
test('cashier cannot modify products or stock', () => {
  assert.equal(authorizeMembership(scope, member('cashier'), 'products:read'), true);
  assert.throws(() => authorizeMembership(scope, member('cashier'), 'products:write'));
  assert.throws(() => authorizeMembership(scope, member('cashier'), 'stock:write'));
});
test('unknown role and permission fail closed', () => {
  assert.throws(() => authorizeMembership(scope, member('admin'), 'stock:write'));
  assert.throws(() => authorizeMembership(scope, member('owner'), 'unknown'));
});
test('cross-tenant and missing user fail closed', () => {
  assert.throws(() => authorizeMembership(scope, { ...member('owner'), tenantId: 'tenant_02' }, 'stock:write'));
  assert.throws(() => authorizeMembership(scope, { ...member('owner'), userId: '' }, 'stock:write'));
  assert.throws(() => authorizeMembership(scope, null, 'stock:read'));
});
