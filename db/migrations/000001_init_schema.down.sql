-- migrations/000001_init_schema.down.sql
BEGIN;

DROP TABLE IF EXISTS orders;

DROP TABLE IF EXISTS users;

COMMIT;