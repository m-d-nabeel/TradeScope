-- users_queries.sql

-- Get a user by ID
-- name: GetUserByID :one
SELECT id, name, email, password_hash, avatar_url, provider, is_active, role, refresh_token_hash, created_at, updated_at
FROM users
WHERE id = $1;

-- Get a user by email
-- name: GetUserByEmail :one
SELECT id, name, email, password_hash, avatar_url, provider, is_active, role, refresh_token_hash, created_at, updated_at
FROM users
WHERE email = $1;

-- Create a new user
-- name: CreateUser :one
INSERT INTO users (name, email, password_hash, avatar_url, provider, role)
VALUES ($1, $2, $3, $4, $5, $6)
RETURNING id, name, email, password_hash, avatar_url, provider, is_active, role, refresh_token_hash, created_at, updated_at;

-- Update user details (excluding password)
-- name: UpdateUser :exec
UPDATE users
SET name = $2, email = $3, avatar_url = $4, provider = $5, role = $6, updated_at = CURRENT_TIMESTAMP
WHERE id = $1;

-- Update user password
-- name: UpdateUserPassword :exec
UPDATE users
SET password_hash = $2, updated_at = CURRENT_TIMESTAMP
WHERE id = $1;

-- Update user refresh token hash
-- name: UpdateUserRefreshToken :exec
UPDATE users
SET refresh_token_hash = $2, updated_at = CURRENT_TIMESTAMP
WHERE id = $1;

-- Deactivate (soft-delete) a user
-- name: DeactivateUser :exec
UPDATE users
SET is_active = FALSE, updated_at = CURRENT_TIMESTAMP
WHERE id = $1;

-- Reactivate a deactivated user
-- name: ReactivateUser :exec
UPDATE users
SET is_active = TRUE, updated_at = CURRENT_TIMESTAMP
WHERE id = $1;

-- Delete a user (hard-delete)
-- name: DeleteUser :exec
DELETE FROM users
WHERE id = $1;

-- List all active users
-- name: ListActiveUsers :many
SELECT id, name, email, avatar_url, provider, is_active, role, created_at, updated_at
FROM users
WHERE is_active = TRUE
ORDER BY created_at DESC;

-- Check if a user with the given email exists
-- name: UserExistsByEmail :one
SELECT EXISTS(
    SELECT 1 FROM users WHERE email = $1
) AS exists;
