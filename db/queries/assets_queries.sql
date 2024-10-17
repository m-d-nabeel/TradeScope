-- name: ListAssets :many
SELECT * FROM assets
ORDER BY symbol;

-- name: GetAssetByID :one
SELECT * FROM assets
WHERE id = $1;

-- name: GetAssetsBySymbol :many
SELECT * FROM assets
WHERE LOWER(symbol) = LOWER($1)
ORDER BY exchange;

-- name: CreateAsset :exec
INSERT INTO assets (
    id, seq_id, class, exchange, symbol, name, status, 
    tradable, marginable, shortable, easy_to_borrow, fractionable, 
    maintenance_margin_requirement, margin_requirement_long, margin_requirement_short, attributes
)
VALUES (
    $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16
);

-- name: TruncateAssets :exec
TRUNCATE TABLE assets;

-- name: GetAssetsByStatusAndTradability :many
SELECT * FROM assets
WHERE status = $1 AND tradable = $2
ORDER BY symbol;


-- name: GetAssetsWithKeysetPagination :many
SELECT * FROM assets
WHERE seq_id > $1
ORDER BY seq_id ASC
LIMIT $2;




-- name: CreateAssetsBatch :copyfrom
INSERT INTO assets (
    id, seq_id, class, exchange, symbol, name, 
    tradable, marginable, shortable, easy_to_borrow, fractionable,
    status, maintenance_margin_requirement, attributes
) VALUES (
    $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14
);