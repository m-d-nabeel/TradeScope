# Install golang-migrate with postgres support
go install -tags "postgres,mysql" github.com/golang-migrate/migrate/v4/cmd/migrate@latest

# Create a new migration file with a sequence number and the name init_schema with both up and down migrations
migrate create -ext sql -dir ./db/migrations -seq init_schema

# Apply all up migrations
migrate -database "postgres://tradinguser:tradingpass@localhost:5432/tradingdb?sslmode=disable" -path ./db/migrations up

# Apply all down migrations
migrate -database "postgres://tradinguser:tradingpass@localhost:5432/tradingdb?sslmode=disable" -path ./db/migrations down

# Apply the next migration
migrate -database "postgres://tradinguser:tradingpass@localhost:5432/tradingdb?sslmode=disable" -path ./db/migrations next

# Apply the previous migration
migrate -database "postgres://tradinguser:tradingpass@localhost:5432/tradingdb?sslmode=disable" -path ./db/migrations prev

# Rollback the last migration
migrate -database "postgres://tradinguser:tradingpass@localhost:5432/tradingdb?sslmode=disable" -path ./db/migrations force 1

# Rollback all migrations
migrate -database "postgres://tradinguser:tradingpass@localhost:5432/tradingdb?sslmode=disable" -path ./db/migrations force

# Install sqlc
go install github.com/sqlc-dev/sqlc/cmd/sqlc@latest

# Generate Go code from SQL queries
sqlc generate