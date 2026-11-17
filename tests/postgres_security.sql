\set ON_ERROR_STOP on
\ir ../database/migrations/0001_initial.sql
\ir ../database/migrations/0002_stock_posting.sql
\ir ../database/migrations/0003_lockdown.sql

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_proc p, LATERAL aclexplode(coalesce(p.proacl, acldefault('f', p.proowner))) a WHERE p.oid = 'post_stock_movement(uuid,uuid,uuid,text,text,bigint)'::regprocedure AND a.grantee = 0 AND a.privilege_type = 'EXECUTE') THEN
    RAISE EXCEPTION 'PUBLIC can execute stock posting';
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'stock_movements_tenant_id_product_id_fkey'
  ) THEN
    RAISE EXCEPTION 'missing composite product FK';
  END IF;
END $$;
