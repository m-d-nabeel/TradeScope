package database

import (
	"context"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)

type Service interface {
	// PostgreSQL operations
	GetPool() *pgxpool.Pool

	// Redis operations
	Get(ctx context.Context, key string) (string, error)
	Set(ctx context.Context, key string, value interface{}, expiration time.Duration) error
	Del(ctx context.Context, keys ...string) error

	// Common operations
	Health() map[string]string
	Close()
}

type CompositeService struct {
	pgService    *postgresDBService
	redisService RedisService
}

func NewCompositeService() (Service, error) {
	pgService, err := NewPostgresService()
	if err != nil {
		return nil, err
	}

	redisService, err := NewRedisService()
	if err != nil {
		pgService.Close()
		return nil, err
	}

	return &CompositeService{
		pgService:    pgService.(*postgresDBService),
		redisService: redisService,
	}, nil
}

// Implement the Service interface methods for CompositeService
func (s *CompositeService) GetPool() *pgxpool.Pool {
	return s.pgService.GetPool()
}

func (s *CompositeService) Get(ctx context.Context, key string) (string, error) {
	return s.redisService.Get(ctx, key)
}

func (s *CompositeService) Set(ctx context.Context, key string, value interface{}, expiration time.Duration) error {
	return s.redisService.Set(ctx, key, value, expiration)
}

func (s *CompositeService) Del(ctx context.Context, keys ...string) error {
	return s.redisService.Del(ctx, keys...)
}

func (s *CompositeService) Health() map[string]string {
	pgHealth := s.pgService.Health()
	redisHealth := s.redisService.Health()

	combinedHealth := make(map[string]string)
	for k, v := range pgHealth {
		combinedHealth["pg_"+k] = v
	}
	for k, v := range redisHealth {
		combinedHealth["redis_"+k] = v
	}

	return combinedHealth
}

func (s *CompositeService) Close() {
	s.pgService.Close()
	s.redisService.Close()
}
