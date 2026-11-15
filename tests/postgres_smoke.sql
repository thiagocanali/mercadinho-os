\set ON_ERROR_STOP on
BEGIN;
\ir ../database/migrations/0001_initial.sql
\ir ../database/migrations/0002_stock_posting.sql

DO $$
DECLARE
  t1 uuid := gen_random_uuid();
  t2 uuid := gen_random_uuid();
  u1 uuid := gen_random_uuid();
  u2 uuid := gen_random_uuid();
  p1 uuid := gen_random_uuid();
  p2 uuid := gen_random_uuid();
  result_row record;
  replay_row record;
BEGIN
  INSERT INTO tenants(id,name) VALUES(t1,'Shop A'),(t2,'Shop B');
  INSERT INTO app_users(id,external_auth_id) VALUES(u1,'auth-a'),(u2,'auth-b');
  INSERT INTO tenant_memberships(tenant_id,user_id,role) VALUES(t1,u1,'manager'),(t2,u2,'cashier');
  INSERT INTO products(tenant_id,id,sku,name,unit_price_centavos)
    VALUES(t1,p1,'A-1','Rice',1000),(t2,p2,'B-1','Rice',1000);

  SELECT * INTO result_row FROM post_stock_movement(t1,p1,u1,'request-1','in',10);
  IF result_row.resulting_quantity <> 10 OR result_row.replayed THEN
    RAISE EXCEPTION 'initial stock entry failed';
  END IF;
  SELECT * INTO replay_row FROM post_stock_movement(t1,p1,u1,'request-1','in',10);
  IF replay_row.resulting_quantity <> 10 OR NOT replay_row.replayed OR replay_row.movement_id <> result_row.movement_id THEN
    RAISE EXCEPTION 'idempotent replay failed';
  END IF;
  IF (SELECT count(*) FROM stock_movements WHERE tenant_id=t1) <> 1 THEN
    RAISE EXCEPTION 'duplicate movement created';
  END IF;
  PERFORM post_stock_movement(t1,p1,u1,'request-2','out',4);
  IF (SELECT quantity FROM stock_balances WHERE tenant_id=t1 AND product_id=p1) <> 6 THEN
    RAISE EXCEPTION 'stock exit failed';
  END IF;
  BEGIN
    PERFORM post_stock_movement(t1,p1,u1,'request-3','out',7);
    RAISE EXCEPTION 'expected insufficient stock';
  EXCEPTION WHEN OTHERS THEN
    IF SQLERRM <> 'insufficient stock' THEN RAISE; END IF;
  END;
  BEGIN
    PERFORM post_stock_movement(t1,p1,u1,'request-1','in',11);
    RAISE EXCEPTION 'expected idempotency mismatch';
  EXCEPTION WHEN OTHERS THEN
    IF SQLERRM <> 'idempotency key reused with different parameters' THEN RAISE; END IF;
  END;
  BEGIN
    PERFORM post_stock_movement(t2,p2,u2,'request-4','in',1);
    RAISE EXCEPTION 'expected cashier rejection';
  EXCEPTION WHEN OTHERS THEN
    IF SQLERRM <> 'stock write permission denied' THEN RAISE; END IF;
  END;
  BEGIN
    PERFORM post_stock_movement(t2,p2,u1,'request-5','in',1);
    RAISE EXCEPTION 'expected tenant membership rejection';
  EXCEPTION WHEN OTHERS THEN
    IF SQLERRM <> 'stock write permission denied' THEN RAISE; END IF;
  END;
  BEGIN
    INSERT INTO stock_balances(tenant_id,product_id,quantity) VALUES(t2,p1,1);
    RAISE EXCEPTION 'expected cross-tenant FK rejection';
  EXCEPTION WHEN foreign_key_violation THEN NULL;
  END;
END $$;
ROLLBACK;
