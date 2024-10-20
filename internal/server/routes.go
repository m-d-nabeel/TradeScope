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

	// Root routes
	r.Get("/", s.handleHome)
	r.Get("/health", s.checkHealthHandler)

	// Authentication routes
	r.Route("/auth", func(r chi.Router) {
		r.Get("/{provider}/callback", s.authCallbackHandler)
		r.Get("/status", s.getAuthStatusHandler)
		r.Get("/{provider}", s.authHandler)
		r.Post("/refresh", s.refreshTokenHandler)
		r.Post("/logout/{provider}", s.logoutHandler)
	})

	// Protected routes
	r.Group(func(r chi.Router) {
		r.Use(s.AuthMiddleware)

		r.Get("/profile", s.profileHandler)
		r.Get("/settings", s.settingsHandler)
		r.Get("/settings/{setting}", s.settingHandler)

		r.Route("/api/alpaca", func(r chi.Router) {
			r.Get("/dashboard", s.getDashboardHandler)
			r.Get("/portfolio", s.getPortfolioHandler)
			r.Get("/account", s.getAccountHandler)
			r.Get("/positions", s.getPositionsHandler)
			r.Get("/calendar", s.getTradingCalendarHandler)

			// Assets routes
			r.Route("/assets", func(r chi.Router) {
				r.Get("/get", s.getAssetsHandler)
				r.Get("/page/{page}", s.assetsPaginationHandler)
				r.Get("/{symbol}", s.getAssetHandler)
				r.Get("/{id}", s.getAssetByIdHandler)
				r.Get("/symbols", s.getAssetSymbolsHandler)
			})

			// Market routes
			r.Route("/market", func(r chi.Router) {
				r.Get("/bars", s.getHistoricalBarsHandler)
				r.Get("/auctions", s.getHistoricalAuctionsHandler)
				r.Get("/stocks/exchanges", s.getStocksExchangesHandler)
			})
		})
	})

	return r
}

func corsOptions() *cors.Cors {
	return cors.New(cors.Options{
		AllowedOrigins:     []string{"http://localhost:5173"},
		AllowedMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:     []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token", "X-Requested-With"},
		ExposedHeaders:     []string{"Link"},
		AllowCredentials:   true,
		MaxAge:             300,
		OptionsPassthrough: true,
	})
}

func setResponseHeaders(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", r.Header.Get("Origin"))
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Accept, Authorization, Content-Type, X-CSRF-Token, X-Requested-With")
		w.Header().Set("Access-Control-Allow-Credentials", "true")
		w.Header().Set("X-Content-Type-Options", "nosniff")
		w.Header().Set("X-Frame-Options", "DENY")
		w.Header().Set("Strict-Transport-Security", "max-age=31536000; includeSubDomains")
		next.ServeHTTP(w, r)
	})
}
