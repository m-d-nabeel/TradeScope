-- Assets Table
CREATE TABLE IF NOT EXISTS assets (
    id UUID PRIMARY KEY,
    seq_id INTEGER UNIQUE NOT NULL,
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
    attributes TEXT[]
);

-- Indexes
CREATE INDEX IF NOT EXISTS assets_symbol_idx ON assets (symbol);
CREATE INDEX IF NOT EXISTS idx_symbol_exchange ON assets (symbol, exchange);
CREATE INDEX IF NOT EXISTS idx_status_tradable ON assets (status, tradable);
CREATE INDEX IF NOT EXISTS idx_assets_seq_id ON assets(seq_id);