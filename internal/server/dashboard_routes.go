package server

import (
	"net/http"
)

func (s *Server) handleDashboard(w http.ResponseWriter, r *http.Request) {
	s.respondJSON(w, http.StatusOK, map[string]string{"message": "Dashboard"})
}
