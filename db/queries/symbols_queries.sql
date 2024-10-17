-- name: CreateSymbolsBatch :copyfrom
INSERT INTO symbols(
    symbol, name
) VALUES (
    $1, $2
);

-- name: GetSymbolsByName :many
SELECT * FROM symbols
WHERE name = $1;

-- name: ListSymbols :many
SELECT * FROM symbols;

-- name: TruncateSymbols :exec
TRUNCATE TABLE symbols;

-- -- name: SearchSymbolsByName :many
-- SELECT * FROM symbols
-- WHERE name LIKE '%' || $1 || '%';


-- -- name: GetSymbolBySymbol :one
-- SELECT * FROM symbols
-- WHERE symbol = $1
-- LIMIT 1;


-- -- name: GetSymbolsWithNameContaining :many
-- SELECT * FROM symbols
-- WHERE name ILIKE '%' || $1 || '%';
