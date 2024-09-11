package server

import "net/http"

func (s *Server) handleProfile(w http.ResponseWriter, r *http.Request) {
	s.respondJSON(w, http.StatusOK, map[string]string{"message": "Profile"})
}
