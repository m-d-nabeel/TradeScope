package server

import "net/http"

func (s *Server) handleHome(w http.ResponseWriter, r *http.Request) {
	resp := map[string]string{"message": "Welcome to the Trading Backend API"}
	s.respondJSON(w, http.StatusOK, resp)
}

func (s *Server) handleHealthCheck(w http.ResponseWriter, r *http.Request) {
	health := s.db.Health()
	status := http.StatusOK
	if health["status"] != "up" {
		status = http.StatusServiceUnavailable
	}
	s.respondJSON(w, status, health)
}
