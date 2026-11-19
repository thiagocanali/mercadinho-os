\set ON_ERROR_STOP on
\ir ../database/migrations/0001_initial.sql
\ir ../database/migrations/0002_stock_posting.sql
\ir ../database/migrations/0003_lockdown.sql

-- Prepare fixtures before RLS is enabled.
INSERT INTO tenants(id,name) VALUES
  ('11111111-1111-4111-8111-111111111111','RLS Shop One'),
  ('22222222-2222-4222-8222-222222222222','RLS Shop Two');
INSERT INTO products(tenant_id,id,sku,name,unit_price_centavos) VALUES
  ('11111111-1111-4111-8111-111111111111','aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa','one','One',100),
  ('22222222-2222-4222-8222-222222222222','bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb','two','Two',100);

-- Seed all tenant-scoped tables before enabling RLS.
INSERT INTO app_users(id,external_auth_id) VALUES
  ('33333333-3333-4333-8333-333333333333','rls-user-one'),
  ('44444444-4444-4444-8444-444444444444','rls-user-two');
INSERT INTO tenant_memberships(tenant_id,user_id,role) VALUES
  ('11111111-1111-4111-8111-111111111111','33333333-3333-4333-8333-333333333333','owner'),
  ('22222222-2222-4222-8222-222222222222','44444444-4444-4444-8444-444444444444','owner');
INSERT INTO stock_balances(tenant_id,product_id,quantity) VALUES
  ('11111111-1111-4111-8111-111111111111','aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',5),
  ('22222222-2222-4222-8222-222222222222','bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',7);
INSERT INTO stock_movements(tenant_id,product_id,actor_user_id,idempotency_key,direction,quantity) VALUES
  ('11111111-1111-4111-8111-111111111111','aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa','33333333-3333-4333-8333-333333333333','rls-move-one','in',5),
  ('22222222-2222-4222-8222-222222222222','bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb','44444444-4444-4444-8444-444444444444','rls-move-two','in',7);

\ir ../database/migrations/0004_tenant_rls.sql

-- A non-owner role cannot bypass FORCE RLS.
CREATE ROLE mercadinho_rls_test NOLOGIN;
GRANT USAGE ON SCHEMA public TO mercadinho_rls_test;
GRANT SELECT, INSERT ON products TO mercadinho_rls_test;
GRANT SELECT ON tenants TO mercadinho_rls_test;
GRANT SELECT ON tenant_memberships TO mercadinho_rls_test;
GRANT SELECT ON stock_balances TO mercadinho_rls_test;
GRANT SELECT ON stock_movements TO mercadinho_rls_test;
SET ROLE mercadinho_rls_test;
DO $$
BEGIN
  IF (SELECT count(*) FROM products) <> 0 OR
     (SELECT count(*) FROM tenant_memberships) <> 0 OR
     (SELECT count(*) FROM stock_balances) <> 0 OR
     (SELECT count(*) FROM stock_movements) <> 0 THEN
    RAISE EXCEPTION 'RLS leaked records without tenant context';
  END IF;
END $$;
BEGIN;
SELECT set_config('app.tenant_id','11111111-1111-4111-8111-111111111111',true);
DO $$
BEGIN
  IF (SELECT count(*) FROM products) <> 1 OR
     (SELECT sku FROM products LIMIT 1) <> 'one' OR
     (SELECT count(*) FROM tenant_memberships) <> 1 OR
     (SELECT quantity FROM stock_balances LIMIT 1) <> 5 OR
     (SELECT idempotency_key FROM stock_movements LIMIT 1) <> 'rls-move-one' THEN
    RAISE EXCEPTION 'RLS tenant one isolation failed';
  END IF;
END $$;
DO $$
BEGIN
  BEGIN
    INSERT INTO products(tenant_id,id,sku,name,unit_price_centavos)
      VALUES ('22222222-2222-4222-8222-222222222222', gen_random_uuid(), 'attack', 'Cross tenant', 1);
    RAISE EXCEPTION 'expected cross-tenant insert rejection';
  EXCEPTION WHEN insufficient_privilege THEN
    IF SQLERRM NOT LIKE '%row-level security policy%' THEN
      RAISE;
    END IF;
  END;
END $$;
COMMIT;
BEGIN;
SELECT set_config('app.tenant_id','22222222-2222-4222-8222-222222222222',true);
DO $$
BEGIN
  IF (SELECT count(*) FROM products) <> 1 OR
     (SELECT sku FROM products LIMIT 1) <> 'two' OR
     (SELECT count(*) FROM tenant_memberships) <> 1 OR
     (SELECT quantity FROM stock_balances LIMIT 1) <> 7 OR
     (SELECT idempotency_key FROM stock_movements LIMIT 1) <> 'rls-move-two' THEN
    RAISE EXCEPTION 'RLS tenant two isolation failed';
  END IF;
END $$;
COMMIT;
RESET ROLE;
REVOKE SELECT, INSERT ON products FROM mercadinho_rls_test;
REVOKE SELECT ON tenants FROM mercadinho_rls_test;
REVOKE SELECT ON tenant_memberships FROM mercadinho_rls_test;
REVOKE SELECT ON stock_balances FROM mercadinho_rls_test;
REVOKE SELECT ON stock_movements FROM mercadinho_rls_test;
REVOKE USAGE ON SCHEMA public FROM mercadinho_rls_test;
DROP ROLE mercadinho_rls_test;
