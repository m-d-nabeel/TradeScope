-- BEGIN;

-- -- Asset Class Enum
-- CREATE TYPE asset_class_enum AS ENUM (
--     'us_equity',
--     'us_option',
--     'crypto'
-- );

-- -- Exchange Enum
-- CREATE TYPE exchange_enum AS ENUM (
--     'AMEX',
--     'ARCA',
--     'BATS',
--     'NYSE',
--     'NASDAQ',
--     'NYSEARCA',
--     'OTC'
-- );

-- -- Attributes Enum
-- CREATE TYPE attributes_enum AS ENUM (
--     'ptp_no_exception',
--     'ptp_with_exception',
--     'ipo',
--     'has_options',
--     'options_late_close'
-- );

-- -- Asset Status Enum
-- CREATE TYPE asset_status_enum AS ENUM (
--     'active',
--     'inactive'
-- );

-- -- Assets Table
-- CREATE TABLE IF NOT EXISTS assets (
--     id UUID PRIMARY KEY,
--     class asset_class_enum NOT NULL,
--     exchange exchange_enum NOT NULL,
--     symbol VARCHAR(20) NOT NULL,
--     name TEXT NOT NULL,
--     status asset_status_enum NOT NULL,
--     tradable BOOLEAN NOT NULL,
--     marginable BOOLEAN NOT NULL,
--     shortable BOOLEAN NOT NULL,
--     easy_to_borrow BOOLEAN NOT NULL,
--     fractionable BOOLEAN NOT NULL,
--     maintenance_margin_requirement INTEGER,
--     margin_requirement_long TEXT,
--     margin_requirement_short TEXT,
--     attributes attributes_enum[],
--     UNIQUE (exchange, symbol)
-- );

-- -- Indexes
-- CREATE INDEX IF NOT EXISTS assets_symbol_idx ON assets (symbol);
-- CREATE INDEX IF NOT EXISTS idx_symbol_exchange ON assets (symbol, exchange);
-- CREATE INDEX IF NOT EXISTS idx_status_tradable ON assets (status, tradable);

-- COMMIT;


-- Assets Table
CREATE TABLE IF NOT EXISTS assets (
    id UUID PRIMARY KEY,
    seq_id BIGSERIAL,
    class VARCHAR(20) NOT NULL,
    exchange VARCHAR(20) NOT NULL,
    symbol VARCHAR(20) NOT NULL,
    name TEXT NOT NULL,
    status VARCHAR(20) NOT NULL,
    tradable BOOLEAN NOT NULL,
    marginable BOOLEAN NOT NULL,
    shortable BOOLEAN NOT NULL,
    easy_to_borrow BOOLEAN NOT NULL,
    fractionable BOOLEAN NOT NULL,
    maintenance_margin_requirement INTEGER,
    margin_requirement_long TEXT,
    margin_requirement_short TEXT,
    attributes TEXT[],
    UNIQUE (exchange, symbol)
);

-- Indexes
CREATE INDEX IF NOT EXISTS assets_symbol_idx ON assets (symbol);
CREATE INDEX IF NOT EXISTS idx_symbol_exchange ON assets (symbol, exchange);
CREATE INDEX IF NOT EXISTS idx_status_tradable ON assets (status, tradable);
CREATE INDEX IF NOT EXISTS idx_assets_seq_id ON assets(seq_id);

COMMIT;