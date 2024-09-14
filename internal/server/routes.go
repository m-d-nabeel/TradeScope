package server

import (
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/rs/cors"
)

type contextKey string

func (s *Server) RegisterRoutes() http.Handler {
	r := chi.NewRouter()
	r.Use(middleware.Logger)
	r.Use(corsOptions().Handler)
	r.Use(setResponseHeaders)

	r.Get("/", s.handleHome)
	r.Get("/health", s.handleHealthCheck)
	r.Route("/auth", func(r chi.Router) {
		r.Get("/{provider}", s.handleAuth)
		r.Get("/{provider}/callback", s.handleAuthCallback)
	})
	r.Get("/logout/{provider}", s.handleLogout)

	r.Group(func(r chi.Router) {
		r.Use(s.AuthMiddleware)
		r.Get("/dashboard", s.handleDashboard)
		r.Get("/profile", s.handleProfile)
		r.Get("/settings", s.handleSettings)
		r.Get("/settings/{setting}", s.handleSetting)
	})

	return r
}

func corsOptions() *cors.Cors {
	return cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:5173"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: true,
		MaxAge:           300,
	})
}

func setResponseHeaders(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
		w.Header().Set("Access-Control-Allow-Credentials", "true")
		next.ServeHTTP(w, r)
	})
}
