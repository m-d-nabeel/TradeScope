package server

import (
	"log"
	"net/http"

	"github.com/trading-backend/internal/lib"
	"github.com/trading-backend/internal/service/auth"
)

func (s *Server) dashboardHandler(w http.ResponseWriter, r *http.Request) {
	log.Println("Dashboard")
	claims, ok := r.Context().Value(userKey).(*auth.UserClaims)
	if !ok {
		lib.RespondError(w, http.StatusInternalServerError, "Error getting user claims")
		return
	}
	lib.RespondJSON(w, http.StatusOK, claims)
}
