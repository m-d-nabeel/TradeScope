-- Get all assets
-- name: ListAssets :many
SELECT id, class, exchange, symbol, name, status, tradable, marginable, shortable, easy_to_borrow, fractionable, margin_requirement_long, margin_requirement_short, attributes
FROM assets;

-- Get a single asset by ID
-- name: GetAssetByID :one
SELECT id, class, exchange, symbol, name, status, tradable, marginable, shortable, easy_to_borrow, fractionable, margin_requirement_long, margin_requirement_short, attributes
FROM assets
WHERE id = $1;

-- Insert a new asset
-- name: CreateAsset :exec
INSERT INTO assets (id, class, exchange, symbol, name, status, tradable, marginable, shortable, easy_to_borrow, fractionable, margin_requirement_long, margin_requirement_short, attributes)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
ON CONFLICT (exchange, symbol) DO NOTHING;

-- Update an existing asset
-- name: UpdateAsset :exec
UPDATE assets
SET class = $2, exchange = $3, symbol = $4, name = $5, status = $6, tradable = $7, marginable = $8, shortable = $9, easy_to_borrow = $10, fractionable = $11, margin_requirement_long = $12, margin_requirement_short = $13, attributes = $14
WHERE id = $1;

-- Delete an asset
-- name: DeleteAsset :exec
DELETE FROM assets
WHERE id = $1;
