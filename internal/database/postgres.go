package database

import (
	"context"
	"fmt"
	"log"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
	_ "github.com/joho/godotenv/autoload"
	"github.com/trading-backend/config"
)

type PostgresService interface {
	Health() map[string]string
	Close()
	GetPool() *pgxpool.Pool
}

type postgresDBService struct {
	pool *pgxpool.Pool
}

var (
	database = config.Envs.DbDatabase
	password = config.Envs.DbPassword
	username = config.Envs.DbUsername
	port     = config.Envs.DbPort
	host     = config.Envs.DbHost
	schema   = config.Envs.DbSchema
)

func NewPostgresService() (PostgresService, error) {
	connStr := fmt.Sprintf("postgres://%s:%s@%s:%s/%s?sslmode=disable&search_path=%s", username, password, host, port, database, schema)

	config, err := pgxpool.ParseConfig(connStr)
	if err != nil {
		return nil, fmt.Errorf("unable to parse connection string: %v", err)
	}

	config.MaxConns = 20
	config.MinConns = 5
	config.MaxConnLifetime = 1 * time.Hour
	config.MaxConnIdleTime = 30 * time.Minute

	pool, err := pgxpool.NewWithConfig(context.Background(), config)
	if err != nil {
		return nil, fmt.Errorf("unable to create connection pool: %v", err)
	}

	return &postgresDBService{pool: pool}, nil
}

func (s *postgresDBService) Health() map[string]string {
	ctx, cancel := context.WithTimeout(context.Background(), 1*time.Second)
	defer cancel()

	stats := make(map[string]string)

	err := s.pool.Ping(ctx)
	if err != nil {
		stats["status"] = "down"
		stats["error"] = fmt.Sprintf("db down: %v", err)
		return stats
	}

	poolStats := s.pool.Stat()
	stats["status"] = "up"
	stats["total_connections"] = fmt.Sprintf("%d", poolStats.TotalConns())
	stats["acquired_connections"] = fmt.Sprintf("%d", poolStats.AcquiredConns())
	stats["idle_connections"] = fmt.Sprintf("%d", poolStats.IdleConns())

	return stats
}

func (s *postgresDBService) Close() {
	s.pool.Close()
	log.Printf("Disconnected from database: %s", database)
}

func (s *postgresDBService) GetPool() *pgxpool.Pool {
	return s.pool
}
