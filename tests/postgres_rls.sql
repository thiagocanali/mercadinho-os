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

\ir ../database/migrations/0004_tenant_rls.sql

-- A non-owner role cannot bypass FORCE RLS.
CREATE ROLE mercadinho_rls_test NOLOGIN;
GRANT USAGE ON SCHEMA public TO mercadinho_rls_test;
GRANT SELECT, INSERT ON products TO mercadinho_rls_test;
GRANT SELECT ON tenants TO mercadinho_rls_test;
SET ROLE mercadinho_rls_test;
DO $$
BEGIN
  IF (SELECT count(*) FROM products) <> 0 THEN
    RAISE EXCEPTION 'RLS leaked records without tenant context';
  END IF;
END $$;
BEGIN;
SELECT set_config('app.tenant_id','11111111-1111-4111-8111-111111111111',true);
DO $$
BEGIN
  IF (SELECT count(*) FROM products) <> 1 OR
     (SELECT sku FROM products LIMIT 1) <> 'one' THEN
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
     (SELECT sku FROM products LIMIT 1) <> 'two' THEN
    RAISE EXCEPTION 'RLS tenant two isolation failed';
  END IF;
END $$;
COMMIT;
RESET ROLE;
REVOKE SELECT, INSERT ON products FROM mercadinho_rls_test;
REVOKE SELECT ON tenants FROM mercadinho_rls_test;
REVOKE USAGE ON SCHEMA public FROM mercadinho_rls_test;
DROP ROLE mercadinho_rls_test;
