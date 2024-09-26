-- orders_queries.sql

-- Create a new order
-- name: CreateOrder :one
INSERT INTO orders (
    user_id, symbol, order_type, quantity, price, status
) VALUES (
    $1, $2, $3, $4, $5, $6
)
RETURNING id, user_id, symbol, order_type, quantity, price, status, created_at, updated_at;

-- Get an order by ID
-- name: GetOrderByID :one
SELECT id, user_id, symbol, order_type, quantity, price, status, created_at, updated_at
FROM orders
WHERE id = $1;

-- Update the status of an order
-- name: UpdateOrderStatus :one
UPDATE orders
SET status = $2, updated_at = CURRENT_TIMESTAMP
WHERE id = $1
RETURNING id, user_id, symbol, order_type, quantity, price, status, created_at, updated_at;

-- List orders by user ID with pagination
-- name: ListOrdersByUserID :many
SELECT id, user_id, symbol, order_type, quantity, price, status, created_at, updated_at
FROM orders
WHERE user_id = $1
ORDER BY created_at DESC
LIMIT $2 OFFSET $3;

-- Delete an order by ID
-- name: DeleteOrder :exec
DELETE FROM orders
WHERE id = $1;

-- Get count of orders grouped by status
-- name: GetOrderCountByStatus :many
SELECT status, COUNT(*) AS count
FROM orders
GROUP BY status;

-- Get all orders for a specific user
-- name: GetUserOrders :many
SELECT o.id, o.user_id, o.symbol, o.order_type, o.quantity, o.price, o.status, o.created_at, o.updated_at
FROM orders o
JOIN users u ON u.id = o.user_id
WHERE u.id = $1
ORDER BY o.created_at DESC
LIMIT $2 OFFSET $3;

-- Get orders by symbol with pagination
-- name: GetOrdersBySymbol :many
SELECT id, user_id, symbol, order_type, quantity, price, status, created_at, updated_at
FROM orders
WHERE symbol = $1
ORDER BY created_at DESC
LIMIT $2 OFFSET $3;

-- Update multiple fields of an order
-- name: UpdateOrder :one
UPDATE orders
SET 
    symbol = COALESCE($2, symbol),
    order_type = COALESCE($3, order_type),
    quantity = COALESCE($4, quantity),
    price = COALESCE($5, price),
    status = COALESCE($6, status),
    updated_at = CURRENT_TIMESTAMP
WHERE id = $1
RETURNING id, user_id, symbol, order_type, quantity, price, status, created_at, updated_at;

-- Get total value of completed orders for a user
-- name: GetTotalOrderValueByUser :one
SELECT COALESCE(SUM(quantity * price), 0) AS total_value
FROM orders
WHERE user_id = $1 AND status = 'completed';
