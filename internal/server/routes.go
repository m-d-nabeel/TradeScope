package server

import (
	"context"
	"encoding/json"
	"log"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/markbates/goth/gothic"
)

type contextKey string

const providerKey contextKey = "provider"

func (s *Server) RegisterRoutes() http.Handler {
	r := chi.NewRouter()
	r.Use(middleware.Logger)

	r.Get("/", s.handleHome)
	r.Get("/health", s.handleHealthCheck)
	r.Route("/auth", func(r chi.Router) {
		r.Get("/{provider}", s.handleAuth)
		r.Get("/{provider}/callback", s.handleAuthCallback)
	})
	r.Get("/logout/{provider}", s.handleLogout)

	return r
}

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

func (s *Server) handleAuth(w http.ResponseWriter, r *http.Request) {
	provider := chi.URLParam(r, "provider")
	r = r.WithContext(context.WithValue(r.Context(), providerKey, provider))

	if gothUser, err := gothic.CompleteUserAuth(w, r); err == nil {
		s.respondJSON(w, http.StatusOK, gothUser)
	} else {
		gothic.BeginAuthHandler(w, r)
	}
}

func (s *Server) handleAuthCallback(w http.ResponseWriter, r *http.Request) {
	provider := chi.URLParam(r, "provider")
	r = r.WithContext(context.WithValue(r.Context(), providerKey, provider))

	user, err := gothic.CompleteUserAuth(w, r)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	log.Printf("User authenticated: %v", user)
	http.Redirect(w, r, "http://localhost:5173/dashboard", http.StatusTemporaryRedirect)
}

func (s *Server) handleLogout(w http.ResponseWriter, r *http.Request) {
	gothic.Logout(w, r)
	http.Redirect(w, r, "/", http.StatusTemporaryRedirect)
}

func (s *Server) respondJSON(w http.ResponseWriter, status int, payload interface{}) {
	data, err := json.Marshal(payload)
	if err != nil {
		log.Printf("Error marshalling JSON: %v", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	w.Write(data)
}
