-- Defense in depth: restrict direct invocation until authenticated backend exists.
-- PostgreSQL grants EXECUTE on new functions to PUBLIC by default.
REVOKE ALL ON FUNCTION post_stock_movement(uuid, uuid, uuid, text, text, bigint) FROM PUBLIC;
-- Application role must be explicitly created and granted least privilege
-- only after server-side session verification and RLS review.
