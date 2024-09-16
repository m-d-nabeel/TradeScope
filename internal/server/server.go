package server

import (
	"fmt"
	"net/http"
	"time"

	_ "github.com/joho/godotenv/autoload"
	"github.com/trading-backend/config"
	"github.com/trading-backend/internal/database"
	"github.com/trading-backend/internal/service/auth"
)

type Server struct {
	db   database.Service
	auth *auth.AuthService
}

func New() (*http.Server, error) {
	dbService, err := database.New()
	if err != nil {
		return nil, fmt.Errorf("failed to initialize database: %v", err)
	}

	authService := auth.NewAuthService()

	newServer := &Server{
		db:   dbService,
		auth: authService,
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
