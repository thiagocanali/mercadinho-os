import test from 'node:test';
import assert from 'node:assert/strict';
import { assertCentavos, lineTotalCentavos, cartTotalCentavos, formatBRL } from '../src/domain/money.mjs';

test('computes a line in integer centavos', () => {
  assert.equal(lineTotalCentavos(1999, 3), 5997);
});
test('computes cart without floating-point rounding', () => {
  assert.equal(cartTotalCentavos([
    { unitPriceCentavos: 10, quantity: 3 },
    { unitPriceCentavos: 20, quantity: 2 }
  ]), 70);
});
test('empty cart has zero total', () => {
  assert.equal(cartTotalCentavos([]), 0);
});
test('rejects negative, fractional and unsafe prices', () => {
  for (const value of [-1, 1.5, Number.MAX_SAFE_INTEGER + 1, NaN, Infinity, '10']) {
    assert.throws(() => assertCentavos(value));
  }
});
test('rejects zero or fractional quantities', () => {
  for (const quantity of [0, -2, 1.5, '2']) {
    assert.throws(() => lineTotalCentavos(100, quantity));
  }
});
test('rejects line overflow', () => {
  assert.throws(() => lineTotalCentavos(Number.MAX_SAFE_INTEGER, 2), RangeError);
});
test('rejects cart overflow across valid lines', () => {
  assert.throws(() => cartTotalCentavos([
    { unitPriceCentavos: Number.MAX_SAFE_INTEGER, quantity: 1 },
    { unitPriceCentavos: 1, quantity: 1 }
  ]), RangeError);
});
test('rejects malformed carts', () => {
  assert.throws(() => cartTotalCentavos(null), TypeError);
  assert.throws(() => cartTotalCentavos([null]), TypeError);
});
test('formats BRL in pt-BR without currency arithmetic', () => {
  assert.equal(formatBRL(0), 'R$ 0,00');
  assert.equal(formatBRL(1999), 'R$ 19,99');
});
