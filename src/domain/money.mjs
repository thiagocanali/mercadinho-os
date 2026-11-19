/**
 * Monetary primitives for BRL. All values are integer centavos.
 * No floating-point arithmetic is permitted in totals.
 * Business-specific rounding/discount/tax policies remain A VALIDAR.
 */
export function assertCentavos(value, name = 'centavos') {
  if (!Number.isSafeInteger(value) || value < 0) {
    throw new RangeError(`${name} must be a non-negative safe integer`);
  }
  return value;
}

export function assertQuantity(value) {
  if (!Number.isSafeInteger(value) || value <= 0) {
    throw new RangeError('quantity must be a positive safe integer');
  }
  return value;
}

export function lineTotalCentavos(unitPriceCentavos, quantity) {
  assertCentavos(unitPriceCentavos, 'unitPriceCentavos');
  assertQuantity(quantity);
  const total = BigInt(unitPriceCentavos) * BigInt(quantity);
  if (total > BigInt(Number.MAX_SAFE_INTEGER)) {
    throw new RangeError('line total exceeds safe integer range');
  }
  return Number(total);
}

export function cartTotalCentavos(items) {
  if (!Array.isArray(items)) throw new TypeError('items must be an array');
  let total = 0n;
  for (const item of items) {
    if (!item || typeof item !== 'object') throw new TypeError('invalid item');
    total += BigInt(lineTotalCentavos(item.unitPriceCentavos, item.quantity));
    if (total > BigInt(Number.MAX_SAFE_INTEGER)) {
      throw new RangeError('cart total exceeds safe integer range');
    }
  }
  return Number(total);
}

export function formatBRL(centavos) {
  assertCentavos(centavos);
  const whole = Math.floor(centavos / 100);
  const cents = String(centavos % 100).padStart(2, '0');
  return `R$ ${whole.toLocaleString('pt-BR')},${cents}`;
}
