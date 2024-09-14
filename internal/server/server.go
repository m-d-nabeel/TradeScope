package server

import (
	"encoding/json"
	"fmt"
	"log"
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

func (s *Server) respondJSON(w http.ResponseWriter, status int, payload interface{}) {
	data, err := json.Marshal(payload)
	if err != nil {
		log.Printf("Error marshalling JSON: %v", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	w.Write(data)
}

// func (s *Server) respondError(w http.ResponseWriter, statusCode int, message string) {
// 	if statusCode > 499 {
// 		log.Printf("Responding with 5XX error: %s", message)
// 	}
// 	type errorResponse struct {
// 		Error string `json:"error"`
// 	}
// 	s.respondJSON(w, statusCode, errorResponse{
// 		Error: message,
// 	})
// }
