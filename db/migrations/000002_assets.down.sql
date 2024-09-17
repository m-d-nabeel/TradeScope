BEGIN;

-- Drop the indexes
DROP INDEX IF EXISTS assets_symbol_idx;
DROP INDEX IF EXISTS idx_symbol_exchange;
DROP INDEX IF EXISTS idx_status_tradable;

-- Drop the table
DROP TABLE IF EXISTS assets;

-- Drop the enums
DROP TYPE IF EXISTS asset_class_enum;
DROP TYPE IF EXISTS exchange_enum;
DROP TYPE IF EXISTS attributes_enum;
DROP TYPE IF EXISTS asset_status_enum;

COMMIT;