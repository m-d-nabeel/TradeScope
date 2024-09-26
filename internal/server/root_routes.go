package server

import (
	"net/http"

	"github.com/trading-backend/internal/lib"
)

func (s *Server) handleHome(w http.ResponseWriter, r *http.Request) {
	resp := map[string]string{"message": "Welcome to the Trading Backend API"}
	lib.RespondJSON(w, http.StatusOK, resp)
}

func (s *Server) checkHealthHandler(w http.ResponseWriter, r *http.Request) {
	postgresHealth := s.db.Health()
	redisHealth := s.rdb.Health()
	status := http.StatusOK
	if postgresHealth["status"] != "up" || redisHealth["status"] != "up" {
		status = http.StatusServiceUnavailable
	}
	health := map[string]interface{}{
		"postgres": postgresHealth,
		"redis":    redisHealth,
	}
	lib.RespondJSON(w, status, health)
}
