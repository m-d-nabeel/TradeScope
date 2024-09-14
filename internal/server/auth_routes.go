package server

import (
	"context"
	"log"
	"net/http"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/markbates/goth/gothic"
	"github.com/trading-backend/internal/service/auth"
)

const (
	FrontendURL            = "http://localhost:3000"
	providerKey contextKey = "provider"
	userKey     contextKey = "user"
)

func (s *Server) handleAuth(w http.ResponseWriter, r *http.Request) {
	provider := chi.URLParam(r, "provider")
	r = r.WithContext(context.WithValue(r.Context(), providerKey, provider))
	gothic.BeginAuthHandler(w, r)
}

func (s *Server) handleAuthCallback(w http.ResponseWriter, r *http.Request) {
	provider := chi.URLParam(r, "provider")
	r = r.WithContext(context.WithValue(r.Context(), providerKey, provider))

	user, err := gothic.CompleteUserAuth(w, r)
	if err != nil {
		http.Error(w, "Authentication failed: "+err.Error(), http.StatusInternalServerError)
		return
	}

	log.Printf("User authenticated! %v", user)

	accessToken, refreshToken, err := s.auth.GenerateTokenPair(&user)
	if err != nil {
		http.Error(w, "Token generation failed: "+err.Error(), http.StatusInternalServerError)
		return
	}

	http.SetCookie(w, &http.Cookie{
		Name:     "access_token",
		Value:    accessToken,
		HttpOnly: true,
		SameSite: http.SameSiteStrictMode,
		Secure:   true,
		Path:     "/",
		Expires:  time.Now().Add(auth.AccessTokenExpiry),
	})

	http.SetCookie(w, &http.Cookie{
		Name:     "refresh_token",
		Value:    refreshToken,
		HttpOnly: true,
		SameSite: http.SameSiteStrictMode,
		Secure:   true,
		Path:     "/",
		Expires:  time.Now().Add(auth.RefreshTokenExpiry),
	})

	http.Redirect(w, r, FrontendURL+"/dashboard", http.StatusTemporaryRedirect)
}

func (s *Server) handleLogout(w http.ResponseWriter, r *http.Request) {
	http.SetCookie(w, &http.Cookie{
		Name:     "access_token",
		Value:    "",
		HttpOnly: true,
		Secure:   true,
		SameSite: http.SameSiteStrictMode,
		Path:     "/",
		Expires:  time.Now().Add(-1 * time.Hour),
	})

	http.SetCookie(w, &http.Cookie{
		Name:     "refresh_token",
		Value:    "",
		HttpOnly: true,
		Secure:   true,
		SameSite: http.SameSiteStrictMode,
		Path:     "/",
		Expires:  time.Now().Add(-1 * time.Hour),
	})

	http.Redirect(w, r, "/", http.StatusTemporaryRedirect)
}

func (s *Server) HandleRefresh(w http.ResponseWriter, r *http.Request) {
	refreshTokenCookie, err := r.Cookie("refresh_token")
	if err != nil {
		http.Error(w, "Refresh token not found", http.StatusUnauthorized)
		return
	}

	refreshToken := refreshTokenCookie.Value
	newAccessToken, newRefreshToken, err := s.auth.RefreshTokens(refreshToken)
	if err != nil {
		http.Error(w, "Token refresh failed: "+err.Error(), http.StatusUnauthorized)
		return
	}

	http.SetCookie(w, &http.Cookie{
		Name:     "access_token",
		Value:    newAccessToken,
		HttpOnly: true,
		SameSite: http.SameSiteStrictMode,
		Secure:   true,
		Path:     "/",
		Expires:  time.Now().Add(auth.AccessTokenExpiry),
	})

	http.SetCookie(w, &http.Cookie{
		Name:     "refresh_token",
		Value:    newRefreshToken,
		HttpOnly: true,
		SameSite: http.SameSiteStrictMode,
		Secure:   true,
		Path:     "/",
		Expires:  time.Now().Add(auth.RefreshTokenExpiry),
	})

	w.WriteHeader(http.StatusOK)
}

func (s *Server) AuthMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		accessTokenCookie, err := r.Cookie("access_token")
		if err != nil {
			s.handleTokenRefresh(w, r, next)
			return
		}

		claims, err := s.auth.ValidateAccessToken(accessTokenCookie.Value)
		if err != nil {
			s.handleTokenRefresh(w, r, next)
			return
		}

		ctx := context.WithValue(r.Context(), userKey, claims)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

func (s *Server) handleTokenRefresh(w http.ResponseWriter, r *http.Request, next http.Handler) {
	refreshTokenCookie, err := r.Cookie("refresh_token")
	if err != nil {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	newAccessToken, newRefreshToken, err := s.auth.RefreshTokens(refreshTokenCookie.Value)
	if err != nil {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	http.SetCookie(w, &http.Cookie{
		Name:     "access_token",
		Value:    newAccessToken,
		HttpOnly: true,
		SameSite: http.SameSiteStrictMode,
		Secure:   true,
		Path:     "/",
		Expires:  time.Now().Add(auth.AccessTokenExpiry),
	})

	http.SetCookie(w, &http.Cookie{
		Name:     "refresh_token",
		Value:    newRefreshToken,
		HttpOnly: true,
		SameSite: http.SameSiteStrictMode,
		Secure:   true,
		Path:     "/",
		Expires:  time.Now().Add(auth.RefreshTokenExpiry),
	})

	claims, err := s.auth.ValidateAccessToken(newAccessToken)
	if err != nil {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}
	ctx := context.WithValue(r.Context(), userKey, claims)
	next.ServeHTTP(w, r.WithContext(ctx))
}
