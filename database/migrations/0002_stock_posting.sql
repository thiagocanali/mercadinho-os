-- Transactional stock posting primitive. Development only until DB integration tests.
-- The caller MUST authenticate the actor and authorize membership server-side.
-- This function independently checks membership and denies cashier writes.
-- Use a restricted DB role and RLS before exposing to untrusted clients.
CREATE OR REPLACE FUNCTION post_stock_movement(
  p_tenant_id uuid,
  p_product_id uuid,
  p_actor_user_id uuid,
  p_idempotency_key text,
  p_direction text,
  p_quantity bigint
) RETURNS TABLE (movement_id uuid, resulting_quantity bigint, replayed boolean)
LANGUAGE plpgsql
SECURITY INVOKER
AS $$
DECLARE
  v_existing stock_movements%ROWTYPE;
  v_balance bigint;
  v_movement_id uuid;
BEGIN
  IF p_tenant_id IS NULL OR p_product_id IS NULL OR p_actor_user_id IS NULL
     OR p_idempotency_key IS NULL OR length(trim(p_idempotency_key)) NOT BETWEEN 1 AND 128
     OR p_direction NOT IN ('in','out') OR p_direction IS NULL
     OR p_quantity IS NULL OR p_quantity <= 0 THEN
    RAISE EXCEPTION 'invalid movement parameters';
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM tenant_memberships
    WHERE tenant_id = p_tenant_id AND user_id = p_actor_user_id
      AND role IN ('owner','manager')
  ) THEN
    RAISE EXCEPTION 'stock write permission denied';
  END IF;

  -- Serializes all movements for this product, including duplicate requests.
  INSERT INTO stock_balances (tenant_id, product_id, quantity)
  VALUES (p_tenant_id, p_product_id, 0)
  ON CONFLICT (tenant_id, product_id) DO NOTHING;
  SELECT quantity INTO v_balance FROM stock_balances
    WHERE tenant_id = p_tenant_id AND product_id = p_product_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'product stock not found'; END IF;

  SELECT * INTO v_existing FROM stock_movements
    WHERE tenant_id = p_tenant_id AND idempotency_key = p_idempotency_key;
  IF FOUND THEN
    IF v_existing.product_id <> p_product_id
       OR v_existing.actor_user_id <> p_actor_user_id
       OR v_existing.direction <> p_direction
       OR v_existing.quantity <> p_quantity THEN
      RAISE EXCEPTION 'idempotency key reused with different parameters';
    END IF;
    RETURN QUERY SELECT v_existing.id, v_balance, true;
    RETURN;
  END IF;

  IF p_direction = 'out' AND v_balance < p_quantity THEN
    RAISE EXCEPTION 'insufficient stock';
  END IF;
  IF p_direction = 'in' AND v_balance > 9223372036854775807 - p_quantity THEN
    RAISE EXCEPTION 'stock overflow';
  END IF;
  IF EXISTS (SELECT 1 FROM stock_balances WHERE tenant_id = p_tenant_id AND product_id = p_product_id AND version = 9223372036854775807) THEN
    RAISE EXCEPTION 'stock version overflow';
  END IF;
  UPDATE stock_balances SET
    quantity = CASE WHEN p_direction = 'in' THEN v_balance + p_quantity ELSE v_balance - p_quantity END,
    version = version + 1
  WHERE tenant_id = p_tenant_id AND product_id = p_product_id
  RETURNING quantity INTO v_balance;

  INSERT INTO stock_movements (tenant_id, product_id, actor_user_id, idempotency_key, direction, quantity)
  VALUES (p_tenant_id, p_product_id, p_actor_user_id, p_idempotency_key, p_direction, p_quantity)
  RETURNING id INTO v_movement_id;

  RETURN QUERY SELECT v_movement_id, v_balance, false;
END;
$$;
