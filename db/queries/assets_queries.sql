-- Get all assets
-- name: ListAssets :many
SELECT * FROM assets
ORDER BY symbol;

-- Get a single asset by ID
-- name: GetAssetByID :one
SELECT * FROM assets
WHERE id = $1;

-- Get assets by symbol (case-insensitive)
-- name: GetAssetsBySymbol :many
SELECT * FROM assets
WHERE LOWER(symbol) = LOWER($1)
ORDER BY exchange;

-- Insert a new asset
-- name: CreateAsset :exec
INSERT INTO assets (
    id, class, exchange, symbol, name, status, 
    tradable, marginable, shortable, easy_to_borrow, fractionable, 
    maintenance_margin_requirement, margin_requirement_long, margin_requirement_short, attributes
)
VALUES (
    $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15
)
ON CONFLICT (exchange, symbol) 
DO UPDATE SET
    class = EXCLUDED.class,
    name = EXCLUDED.name,
    status = EXCLUDED.status,
    tradable = EXCLUDED.tradable,
    marginable = EXCLUDED.marginable,
    shortable = EXCLUDED.shortable,
    easy_to_borrow = EXCLUDED.easy_to_borrow,
    fractionable = EXCLUDED.fractionable,
    maintenance_margin_requirement = EXCLUDED.maintenance_margin_requirement,
    margin_requirement_long = EXCLUDED.margin_requirement_long,
    margin_requirement_short = EXCLUDED.margin_requirement_short,
    attributes = EXCLUDED.attributes;

-- Update an existing asset
-- name: UpdateAsset :exec
UPDATE assets
SET 
    class = $2,
    exchange = $3,
    symbol = $4,
    name = $5,
    status = $6,
    tradable = $7,
    marginable = $8,
    shortable = $9,
    easy_to_borrow = $10,
    fractionable = $11,
    maintenance_margin_requirement = $12,
    margin_requirement_long = $13,
    margin_requirement_short = $14,
    attributes = $15
WHERE id = $1;

-- Delete an asset
-- name: DeleteAsset :exec
DELETE FROM assets
WHERE id = $1;

-- Get assets by status and tradability
-- name: GetAssetsByStatusAndTradability :many
SELECT * FROM assets
WHERE status = $1 AND tradable = $2
ORDER BY symbol;


-- Get assets with keyset pagination
-- name: GetAssetsWithKeysetPagination :many
SELECT * FROM assets
WHERE seq_id > $1 AND seq_id <= $2
ORDER BY seq_id ASC;