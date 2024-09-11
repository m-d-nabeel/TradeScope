package server

import (
	"log"
	"net/http"
)

func (s *Server) handleDashboard(w http.ResponseWriter, r *http.Request) {
	user, err := s.auth.GetSessionUser(r)
	if err != nil {
		s.respondError(w, http.StatusUnauthorized, err.Error())
		return
	}
	log.Printf("User %s is accessing the dashboard", user.Email)
	s.respondJSON(w, http.StatusOK, map[string]string{"message": "Dashboard"})
}
