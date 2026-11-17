\set ON_ERROR_STOP on
\ir ../database/migrations/0001_initial.sql
\ir ../database/migrations/0002_stock_posting.sql
\ir ../database/migrations/0003_lockdown.sql

DO $$
BEGIN
  IF has_function_privilege('public', 'post_stock_movement(uuid,uuid,uuid,text,text,bigint)', 'EXECUTE') THEN
    RAISE EXCEPTION 'PUBLIC can execute stock posting';
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'stock_movements_tenant_id_product_id_fkey'
  ) THEN
    RAISE EXCEPTION 'missing composite product FK';
  END IF;
END $$;
