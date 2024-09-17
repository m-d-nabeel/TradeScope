package server

import (
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
	db   database.Service
	auth *auth.AuthService
	apca *alpaca.Client
}

func New() (*http.Server, error) {
	dbService, err := database.New()
	if err != nil {
		return nil, fmt.Errorf("failed to initialize database: %v", err)
	}

	authService := auth.NewAuthService()
	apcaCli := alpaca.NewClient(alpaca.ClientOpts{
		APIKey:    config.Envs.ApcaApiKeyId,
		APISecret: config.Envs.ApcaApiSecretKey,
		BaseURL:   config.Envs.ApcaApiBaseUrl,
	})

	newServer := &Server{
		db:   dbService,
		auth: authService,
		apca: apcaCli,
	}

	// Declare Server config
	server := &http.Server{
		Addr:         fmt.Sprintf(":%d", config.Envs.Port),
		Handler:      newServer.RegisterRoutes(),
		IdleTimeout:  time.Minute,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 30 * time.Second,
	}

	return server, nil
}

func (s *Server) Close() {
	s.db.Close()
}
