-- Mercadinho OS — initial PostgreSQL schema (development proposal).
-- Apply only to an isolated development database after review.
BEGIN;
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS tenants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL CHECK (length(trim(name)) BETWEEN 1 AND 160),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS app_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  external_auth_id text NOT NULL UNIQUE CHECK (length(trim(external_auth_id)) > 0),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS tenant_memberships (
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
  user_id uuid NOT NULL REFERENCES app_users(id) ON DELETE RESTRICT,
  role text NOT NULL CHECK (role IN ('owner','manager','cashier')),
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (tenant_id, user_id)
);
CREATE INDEX IF NOT EXISTS tenant_memberships_user_idx ON tenant_memberships(user_id);

CREATE TABLE IF NOT EXISTS products (
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  sku text NOT NULL CHECK (length(trim(sku)) BETWEEN 1 AND 64),
  name text NOT NULL CHECK (length(trim(name)) BETWEEN 1 AND 200),
  unit_price_centavos bigint NOT NULL CHECK (unit_price_centavos >= 0),
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (tenant_id, id),
  UNIQUE (tenant_id, sku)
);
CREATE TABLE IF NOT EXISTS stock_balances (
  tenant_id uuid NOT NULL,
  product_id uuid NOT NULL,
  quantity bigint NOT NULL DEFAULT 0 CHECK (quantity >= 0),
  version bigint NOT NULL DEFAULT 0 CHECK (version >= 0),
  PRIMARY KEY (tenant_id, product_id),
  FOREIGN KEY (tenant_id, product_id) REFERENCES products(tenant_id, id) ON DELETE RESTRICT
);
CREATE TABLE IF NOT EXISTS stock_movements (
  tenant_id uuid NOT NULL,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL,
  actor_user_id uuid NOT NULL,
  idempotency_key text NOT NULL CHECK (length(trim(idempotency_key)) BETWEEN 1 AND 128),
  direction text NOT NULL CHECK (direction IN ('in','out')),
  quantity bigint NOT NULL CHECK (quantity > 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (tenant_id, id),
  UNIQUE (tenant_id, idempotency_key),
  FOREIGN KEY (tenant_id, product_id) REFERENCES products(tenant_id, id) ON DELETE RESTRICT,
  FOREIGN KEY (tenant_id, actor_user_id) REFERENCES tenant_memberships(tenant_id, user_id) ON DELETE RESTRICT
);
CREATE INDEX IF NOT EXISTS stock_movements_product_idx ON stock_movements(tenant_id, product_id, created_at DESC);

-- No direct client access is intended. All queries must run through verified
-- server-side authorization and tenant-scoped, parameterized transactions.
-- RLS policies and the final authentication model remain to be implemented.
COMMIT;
