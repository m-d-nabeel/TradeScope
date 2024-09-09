# Apply all up migrations
migrate-all-up:
	migrate -database "postgres://tradinguser:tradingpass@localhost:5432/tradingdb?sslmode=disable" -path ./db/migrations up

# Apply all down migrations
migrate-all-down:
	migrate -database "postgres://tradinguser:tradingpass@localhost:5432/tradingdb?sslmode=disable" -path ./db/migrations down

# Apply the next migration
migrate-next:
	migrate -database "postgres://tradinguser:tradingpass@localhost:5432/tradingdb?sslmode=disable" -path ./db/migrations next

# Apply the previous migration
migrate-prev:
	migrate -database "postgres://tradinguser:tradingpass@localhost:5432/tradingdb?sslmode=disable" -path ./db/migrations prev

# Force apply the next migration
migrate-force-1:
	migrate -database "postgres://tradinguser:tradingpass@localhost:5432/tradingdb?sslmode=disable" -path ./db/migrations force 1

# Force apply all migrations
migrate-force:
	migrate -database "postgres://tradinguser:tradingpass@localhost:5432/tradingdb?sslmode=disable" -path ./db/migrations force

# Generate Go code from SQL queries
sqlc-generate:
	sqlc generate

# Create a new migration file with a sequence number and the name init_schema with both up and down migrations
migrate-create:
	migrate create -ext sql -dir ./db/migrations -seq $(name)

# Start the Docker containers
docker-up:
	docker-compose up -d

# Stop the Docker containers
docker-down:
	docker-compose down

# Install global dependencies
install-global-deps:
	go install -tags "postgres,mysql" github.com/golang-migrate/migrate/v4/cmd/migrate@latest
	go install github.com/sqlc-dev/sqlc/cmd/sqlc@latest

.PHONY: migrate-all-up migrate-all-down migrate-next migrate-prev migrate-force-1 migrate-force sqlc-generate migrate-create docker-up docker-down install-global-deps