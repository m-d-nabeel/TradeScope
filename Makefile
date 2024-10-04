# Apply all up migrations
migrate-all-up:
	migrate -database "postgres://tradinguser:tradingpass@localhost:5432/trading_platform?sslmode=disable" -path ./db/migrations up

# Apply all down migrations
migrate-all-down:
	migrate -database "postgres://tradinguser:tradingpass@localhost:5432/trading_platform?sslmode=disable" -path ./db/migrations down


migrate-nth-up:
	migrate  -path ./db/migrations -database "postgres://tradinguser:tradingpass@localhost:5432/trading_platform?sslmode=disable" up $(version)

migrate-nth-down:
	migrate  -path ./db/migrations -database "postgres://tradinguser:tradingpass@localhost:5432/trading_platform?sslmode=disable" down $(version)

# Force apply all migrations
migrate-force:
	migrate -database "postgres://tradinguser:tradingpass@localhost:5432/trading_platform?sslmode=disable" -path ./db/migrations force $(version)

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

psql-cli-conn:
	psql postgres://tradinguser:tradingpass@localhost:5432/trading_platform?sslmode=disable


# Always run server
.PHONY: server
server:
	go run cmd/api/main.go

# Always run client
.PHONY: client
client:
	cd client && bun dev

# Ensure migration commands always run
.PHONY: migrate-all-up migrate-all-down migrate-create migrate-force migrate-nth-up migrate-nth-down

# Ensure other commands always run
.PHONY: sqlc-generate docker-up docker-down install-global-deps


start:
	docker-compose up -d
	go run cmd/api/main.go

stop:
	docker-compose down

# Build the binary
build-release:
	CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -ldflags "-s -w" -o bin/api cmd/api/main.go

# docker-up + server start + client start
start-all:
	docker-compose up -d
	go run cmd/api/main.go &
	cd client && bun dev