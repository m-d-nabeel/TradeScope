-- name: CreateUser :one
INSERT INTO
    users (
        id,
        username,
        email,
        password_hash
    )
VALUES ($1, $2, $3, $4) RETURNING *;

-- name: GetUserByID :one
SELECT * FROM users WHERE id = $1 LIMIT 1;

-- name: UpdateUserEmail :exec
UPDATE users SET email = $2 WHERE id = $1;