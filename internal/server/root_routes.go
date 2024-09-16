package server

import (
	"net/http"

	"github.com/trading-backend/internal/lib"
)

func (s *Server) handleHome(w http.ResponseWriter, r *http.Request) {
	resp := map[string]string{"message": "Welcome to the Trading Backend API"}
	lib.RespondJSON(w, http.StatusOK, resp)
}

func (s *Server) handleHealthCheck(w http.ResponseWriter, r *http.Request) {
	health := s.db.Health()
	status := http.StatusOK
	if health["status"] != "up" {
		status = http.StatusServiceUnavailable
	}
	lib.RespondJSON(w, status, health)
}
