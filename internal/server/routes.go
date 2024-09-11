package server

import (
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
)

type contextKey string

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

	r.Group(func(r chi.Router) {
		// r.Use(s.AuthMiddleware)
		r.Get("/dashboard", s.handleDashboard)
		r.Get("/profile", s.handleProfile)
		r.Get("/settings", s.handleSettings)
		r.Get("/settings/{setting}", s.handleSetting)
	})

	return r
}
