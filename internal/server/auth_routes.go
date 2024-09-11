package server

import (
	"context"
	"log"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/markbates/goth/gothic"
	"github.com/trading-backend/internal/database/sqlc"
)

const providerKey contextKey = "provider"

func (s *Server) handleAuth(w http.ResponseWriter, r *http.Request) {

	provider := chi.URLParam(r, "provider")
	r = r.WithContext(context.WithValue(r.Context(), providerKey, provider))

	if gothUser, err := gothic.CompleteUserAuth(w, r); err == nil {
		log.Printf("User already authenticated! %v", gothUser)
		s.respondJSON(w, http.StatusOK, gothUser)
	} else {
		log.Printf("User not authenticated! %v", err)
		gothic.BeginAuthHandler(w, r)
	}
}

func (s *Server) handleAuthCallback(w http.ResponseWriter, r *http.Request) {

	log.Printf("Auth Callback")

	provider := chi.URLParam(r, "provider")
	r = r.WithContext(context.WithValue(r.Context(), providerKey, provider))

	user, err := gothic.CompleteUserAuth(w, r)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	err = s.auth.StoreUserSession(w, r, user)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	queries := sqlc.New(s.db.GetPool())
	dbUser, _ := queries.CreateUser(r.Context(), sqlc.CreateUserParams{
		ID: pgtype.UUID{
			Valid: true,
			Bytes: uuid.New(),
		},
		Username: user.NickName,
		Email:    user.Email,
	})

	log.Printf("User: %v", dbUser)

	http.Redirect(w, r, "http://localhost:5173/dashboard", http.StatusTemporaryRedirect)
}

func (s *Server) handleLogout(w http.ResponseWriter, r *http.Request) {
	log.Printf("User %s is logging out", r.Context().Value("user").(string))
	err := gothic.Logout(w, r)
	if err != nil {
		log.Printf("Error logging out: %v", err)
		return
	}
	s.auth.RemoveUserSession(w, r)
	http.Redirect(w, r, "/", http.StatusTemporaryRedirect)
}
