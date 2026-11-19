\set ON_ERROR_STOP on
-- Run after postgres_rls.sql on the isolated PostgreSQL 16 CI database.
-- Explicit privileges: no BYPASSRLS, no table ownership, no superuser.
CREATE ROLE mercadinho_backend_test NOLOGIN NOBYPASSRLS;
GRANT USAGE ON SCHEMA public TO mercadinho_backend_test;
GRANT SELECT ON tenant_memberships TO mercadinho_backend_test;
GRANT SELECT ON products TO mercadinho_backend_test;
GRANT SELECT, INSERT, UPDATE ON stock_balances TO mercadinho_backend_test;
GRANT SELECT, INSERT ON stock_movements TO mercadinho_backend_test;
GRANT EXECUTE ON FUNCTION post_stock_movement(uuid,uuid,uuid,text,text,bigint) TO mercadinho_backend_test;

SET ROLE mercadinho_backend_test;
BEGIN;
SELECT set_config('app.tenant_id','11111111-1111-4111-8111-111111111111',true);
DO $$
DECLARE
  posted record;
BEGIN
  SELECT * INTO posted FROM post_stock_movement(
    '11111111-1111-4111-8111-111111111111',
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    '33333333-3333-4333-8333-333333333333',
    'restricted-role-stock-1', 'in', 3);
  IF posted.replayed OR posted.resulting_quantity <> 8 THEN
    RAISE EXCEPTION 'restricted role stock posting failed';
  END IF;
  SELECT * INTO posted FROM post_stock_movement(
    '11111111-1111-4111-8111-111111111111',
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    '33333333-3333-4333-8333-333333333333',
    'restricted-role-stock-1', 'in', 3);
  IF NOT posted.replayed OR posted.resulting_quantity <> 8 THEN
    RAISE EXCEPTION 'restricted role idempotency failed';
  END IF;
END $$;
COMMIT;

BEGIN;
SELECT set_config('app.tenant_id','11111111-1111-4111-8111-111111111111',true);
DO $$
BEGIN
  BEGIN
    PERFORM post_stock_movement(
      '22222222-2222-4222-8222-222222222222',
      'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
      '44444444-4444-4444-8444-444444444444',
      'restricted-role-cross-tenant', 'in', 1);
    RAISE EXCEPTION 'cross-tenant movement was accepted';
  EXCEPTION WHEN raise_exception THEN
    IF SQLERRM <> 'stock write permission denied' THEN RAISE; END IF;
  END;
END $$;
COMMIT;
RESET ROLE;
REVOKE EXECUTE ON FUNCTION post_stock_movement(uuid,uuid,uuid,text,text,bigint) FROM mercadinho_backend_test;
REVOKE SELECT ON tenant_memberships FROM mercadinho_backend_test;
REVOKE SELECT ON products FROM mercadinho_backend_test;
REVOKE SELECT, INSERT, UPDATE ON stock_balances FROM mercadinho_backend_test;
REVOKE SELECT, INSERT ON stock_movements FROM mercadinho_backend_test;
REVOKE USAGE ON SCHEMA public FROM mercadinho_backend_test;
DROP ROLE mercadinho_backend_test;
