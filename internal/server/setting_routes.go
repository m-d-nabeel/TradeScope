package server

import (
	"net/http"

	"github.com/go-chi/chi/v5"
)

func (s *Server) handleSettings(w http.ResponseWriter, r *http.Request) {
	s.respondJSON(w, http.StatusOK, map[string]string{"message": "Settings"})
}

func (s *Server) handleSetting(w http.ResponseWriter, r *http.Request) {
	setting := chi.URLParam(r, "setting")
	s.respondJSON(w, http.StatusOK, map[string]string{"message": setting})
}
