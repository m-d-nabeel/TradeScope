package database

import (
	"context"
	"fmt"
	"time"

	"github.com/redis/go-redis/v9"
)

type RedisService interface {
	Get(ctx context.Context, key string) (string, error)
	Set(ctx context.Context, key string, value interface{}, expiration time.Duration) error
	Del(ctx context.Context, keys ...string) error
	Health() map[string]string
	Close()
}

type redisService struct {
	client *redis.Client
}

func NewRedisService() (RedisService, error) {
	client := redis.NewClient(&redis.Options{
		Addr:     "localhost:6379",
		Password: "",
		DB:       0,
	})

	_, err := client.Ping(context.Background()).Result()
	if err != nil {
		return nil, fmt.Errorf("unable to connect to Redis: %v", err)
	}

	return &redisService{client: client}, nil
}

func (s *redisService) Get(ctx context.Context, key string) (string, error) {
	return s.client.Get(ctx, key).Result()
}

func (s *redisService) Set(ctx context.Context, key string, value interface{}, expiration time.Duration) error {
	return s.client.Set(ctx, key, value, expiration).Err()
}

func (s *redisService) Del(ctx context.Context, keys ...string) error {
	return s.client.Del(ctx, keys...).Err()
}

func (s *redisService) Health() map[string]string {
	ctx, cancel := context.WithTimeout(context.Background(), 1*time.Second)
	defer cancel()

	stats := make(map[string]string)

	_, err := s.client.Ping(ctx).Result()
	if err != nil {
		stats["status"] = "down"
		stats["error"] = fmt.Sprintf("Redis down: %v", err)
		return stats
	}

	stats["status"] = "up"
	return stats
}

func (s *redisService) Close() {
	s.client.Close()
}
