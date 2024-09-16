package server

import (
	"net/http"

	"github.com/trading-backend/internal/lib"
)

func (s *Server) handleProfile(w http.ResponseWriter, r *http.Request) {
	lib.RespondJSON(w, http.StatusOK, map[string]string{"message": "Profile"})
}
