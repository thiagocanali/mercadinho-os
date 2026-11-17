#!/usr/bin/env bash
set -euo pipefail
export PGHOST="${PGHOST:-localhost}"
export PGUSER="${PGUSER:-test}"
export PGDATABASE="${PGDATABASE:-mercadinho_test}"
psql -v ON_ERROR_STOP=1 -f database/migrations/0001_initial.sql >/dev/null
psql -v ON_ERROR_STOP=1 -f database/migrations/0002_stock_posting.sql >/dev/null
psql -v ON_ERROR_STOP=1 -f database/migrations/0003_lockdown.sql >/dev/null
tenant=$(psql -Atqc "INSERT INTO tenants(name) VALUES ('Concurrent shop') RETURNING id")
actor=$(psql -Atqc "INSERT INTO app_users(external_auth_id) VALUES ('concurrency-test') RETURNING id")
psql -v ON_ERROR_STOP=1 -v t="$tenant" -v u="$actor" -qc "INSERT INTO tenant_memberships(tenant_id,user_id,role) VALUES (:'t',:'u','manager')" >/dev/null
product=$(psql -Atqc "INSERT INTO products(tenant_id,sku,name,unit_price_centavos) VALUES ('$tenant','SKU','Product',100) RETURNING id")
psql -Atqc "SELECT * FROM post_stock_movement('$tenant','$product','$actor','seed','in',10)" >/dev/null
# 20 concurrent requests with distinct keys; each adds one unit.
pids=()
for n in $(seq 1 20); do
  psql -v ON_ERROR_STOP=1 -Atqc "SELECT * FROM post_stock_movement('$tenant','$product','$actor','parallel-$n','in',1)" >/dev/null &
  pids+=("$!")
done
for pid in "${pids[@]}"; do wait "$pid"; done
qty=$(psql -Atqc "SELECT quantity FROM stock_balances WHERE tenant_id='$tenant' AND product_id='$product'")
count=$(psql -Atqc "SELECT count(*) FROM stock_movements WHERE tenant_id='$tenant'")
test "$qty" = 30 || { echo "Expected 30 units, got $qty" >&2; exit 1; }
test "$count" = 21 || { echo "Expected 21 movements, got $count" >&2; exit 1; }
echo "Concurrent stock movements passed: quantity=$qty movements=$count"
