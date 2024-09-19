BEGIN;

-- Drop the indexes
DROP INDEX IF EXISTS assets_symbol_idx;
DROP INDEX IF EXISTS idx_symbol_exchange;
DROP INDEX IF EXISTS idx_status_tradable;
DROP INDEX IF EXISTS idx_assets_seq_id;

-- Drop the table
DROP TABLE IF EXISTS assets;

COMMIT;