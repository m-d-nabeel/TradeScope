-- name: GetOrderByID :one
SELECT * FROM orders WHERE id = $1;

-- name: GetOrdersByUserID :many
SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC;

-- name: CreateOrder :one
INSERT INTO
    orders (
        user_id,
        symbol,
        order_type,
        quantity,
        price,
        status
    )
VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;

-- name: UpdateOrderStatus :one
UPDATE orders SET status = $2 WHERE id = $1 RETURNING *;

-- name: DeleteOrder :exec
DELETE FROM orders WHERE id = $1;

-- name: GetOrdersBySymbol :many
SELECT * FROM orders WHERE symbol = $1 ORDER BY created_at DESC;