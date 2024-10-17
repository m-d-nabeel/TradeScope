CREATE TABLE IF NOT EXISTS symbols (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    symbol VARCHAR(255) NOT NULL
);


CREATE INDEX IF NOT EXISTS symbols_name_idx ON symbols (name);
CREATE INDEX IF NOT EXISTS symbols_symbol_idx ON symbols (symbol);