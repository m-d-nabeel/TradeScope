-- migrations/000001_init_schema.down.sql
-- Drop indexes
DROP INDEX IF EXISTS idx_orders_symbol;
DROP INDEX IF EXISTS idx_orders_user_id;
DROP INDEX IF EXISTS idx_users_is_active;
DROP INDEX IF EXISTS idx_users_email;

-- Drop triggers
DROP TRIGGER IF EXISTS set_updated_at ON orders;
DROP TRIGGER IF EXISTS set_updated_at ON users;

-- Drop function
DROP FUNCTION IF EXISTS update_updated_at_column ();


-- Drop tables
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS users;
DROP TYPE IF EXISTS role_enum;