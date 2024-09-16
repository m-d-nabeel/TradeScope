package server

import (
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/trading-backend/internal/lib"
)

func (s *Server) handleSettings(w http.ResponseWriter, r *http.Request) {
	lib.RespondJSON(w, http.StatusOK, map[string]string{"message": "Settings"})
}

func (s *Server) handleSetting(w http.ResponseWriter, r *http.Request) {
	setting := chi.URLParam(r, "setting")
	lib.RespondJSON(w, http.StatusOK, map[string]string{"message": setting})
}
