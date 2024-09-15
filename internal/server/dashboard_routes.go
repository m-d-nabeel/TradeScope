package server

import (
	"log"
	"net/http"

	"github.com/golang-jwt/jwt"
)

type UserClaims struct {
	Email  string `json:"email"`
	Name   string `json:"name"`
	UserID string `json:"user_id"`
	jwt.StandardClaims
}

func (s *Server) handleDashboard(w http.ResponseWriter, r *http.Request) {
	log.Println("Dashboard")
	claims, ok := r.Context().Value(userKey).(*UserClaims)
	if !ok {
		s.respondError(w, http.StatusInternalServerError, "Error getting user claims")
		return
	}
	s.respondJSON(w, http.StatusOK, map[string]string{
		"message": "Dashboard",
		"user":    claims.Name,
	})
}
