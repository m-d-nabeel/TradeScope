package server

import (
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/rs/cors"
)

func (s *Server) RegisterRoutes() http.Handler {
	r := chi.NewRouter()

	// Apply global middleware
	r.Use(middleware.Logger)
	r.Use(corsOptions().Handler)
	r.Use(setResponseHeaders)

	// Define route groups
	r.Get("/", s.handleHome)
	r.Get("/health", s.checkHealthHandler)

	// Authentication routes
	r.Route("/auth", func(r chi.Router) {
		r.Get("/refresh", s.refreshTokenHandler)
		r.Get("/{provider}", s.authHandler)
		r.Get("/{provider}/callback", s.authCallbackHandler)
		r.Get("/status", s.getAuthStatusHandler)
	})

	// Logout route
	r.Get("/logout/{provider}", s.logoutHandler)

	// Authenticated routes
	r.With(s.AuthMiddleware).Group(func(r chi.Router) {
		r.Get("/dashboard", s.dashboardHandler)
		r.Get("/profile", s.profileHandler)
		r.Get("/settings", s.settingsHandler)
		r.Get("/settings/{setting}", s.settingHandler)
	})

	// Alpaca API routes
	r.With(s.AuthMiddleware).Route("/api/alpaca", func(r chi.Router) {
		r.Get("/account", s.getAccountHandler)
		r.Get("/positions", s.getPositionsHandler)
		r.Get("/assets/{symbol}", s.getAssetHandler)
		r.Get("/assets/refresh", s.updateAssetsHandler)
		r.Get("/assets/get", s.getAssetsHandler)
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
		w.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173")
		w.Header().Set("Access-Control-Allow-Credentials", "true")
		next.ServeHTTP(w, r)
	})
}
