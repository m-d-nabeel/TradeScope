package server

import (
	"context"
	"fmt"
	"net/http"
	"time"

	"github.com/alpacahq/alpaca-trade-api-go/v3/alpaca"
	_ "github.com/joho/godotenv/autoload"
	"github.com/trading-backend/config"
	"github.com/trading-backend/internal/database"
	"github.com/trading-backend/internal/service/auth"
)

type Server struct {
	db   database.PostgresService
	rdb  database.RedisService
	auth *auth.AuthService
	apca *alpaca.Client
	http *http.Server
	Addr string
}

func New() (*Server, error) {
	postgresService, err := database.NewPostgresService()
	if err != nil {
		return nil, fmt.Errorf("failed to initialize database: %w", err)
	}

	redisService, err := database.NewRedisService()
	if err != nil {
		postgresService.Close()
		return nil, fmt.Errorf("failed to initialize Redis: %w", err)
	}

	authService := auth.NewAuthService()
	apcaCli := alpaca.NewClient(alpaca.ClientOpts{
		APIKey:    config.Envs.ApcaApiKeyId,
		APISecret: config.Envs.ApcaApiSecretKey,
		BaseURL:   config.Envs.ApcaApiBaseUrl,
	})

	newServer := &Server{
		db:   postgresService,
		rdb:  redisService,
		auth: authService,
		apca: apcaCli,
	}

	httpServer := &http.Server{
		Addr:         fmt.Sprintf(":%d", config.Envs.Port),
		Handler:      newServer.RegisterRoutes(),
		IdleTimeout:  time.Minute,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 30 * time.Second,
	}

	newServer.http = httpServer
	newServer.Addr = httpServer.Addr

	return newServer, nil
}

func (s *Server) Start() error {
	return s.http.ListenAndServe()
}

func (s *Server) Shutdown(ctx context.Context) error {
	err := s.http.Shutdown(ctx)
	if err != nil {
		return fmt.Errorf("error during server shutdown: %w", err)
	}

	s.Close()
	return nil
}

func (s *Server) Close() {
	s.db.Close()
	s.rdb.Close()
}
