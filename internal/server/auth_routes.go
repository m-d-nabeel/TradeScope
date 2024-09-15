package server

import (
	"context"
	"log"
	"net/http"
	"strings"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/markbates/goth/gothic"
	"github.com/trading-backend/internal/database/sqlc"
	"github.com/trading-backend/internal/service/auth"
)

type contextKey struct{}

var (
	FrontendURL            = "http://localhost:5173"
	providerKey contextKey = contextKey{}
	userKey     contextKey = contextKey{}
)

func (s *Server) handleAuth(w http.ResponseWriter, r *http.Request) {
	provider := chi.URLParam(r, "provider")
	r = r.WithContext(context.WithValue(r.Context(), providerKey, provider))
	gothic.BeginAuthHandler(w, r)
}

func (s *Server) handleAuthCallback(w http.ResponseWriter, r *http.Request) {
	log.Println("handleAuthCallback")
	provider := chi.URLParam(r, "provider")
	r = r.WithContext(context.WithValue(r.Context(), providerKey, provider))

	user, err := gothic.CompleteUserAuth(w, r)
	if err != nil {
		http.Error(w, "Authentication failed: "+err.Error(), http.StatusInternalServerError)
		return
	}

	dbQuery := sqlc.New(s.db.GetPool())
	dbUser, err := dbQuery.GetUserByEmail(r.Context(), user.Email)

	if err != nil {
		dbUser, err = dbQuery.CreateUser(r.Context(), sqlc.CreateUserParams{
			Email:     user.Email,
			Name:      user.Name,
			AvatarUrl: pgtype.Text{String: user.AvatarURL, Valid: true},
			Provider:  pgtype.Text{String: user.Provider, Valid: true},
			Role:      sqlc.NullRoleEnum{RoleEnum: sqlc.RoleEnumUser, Valid: true},
		})
		if err != nil {
			http.Error(w, "User creation failed: "+err.Error(), http.StatusInternalServerError)
			return
		}
	}

	accessToken, refreshToken, err := s.auth.GenerateTokenPair(&user)
	if err != nil {
		http.Error(w, "Token generation failed: "+err.Error(), http.StatusInternalServerError)
		return
	}
	log.Println("AccessToken: ", accessToken)
	log.Println("RefreshToken: ", refreshToken)

	// hashedRefreshToken, err := s.auth.HashSecret(refreshToken)

	// if err != nil {
	// 	http.Error(w, "Token hash failed: "+err.Error(), http.StatusInternalServerError)
	// 	return
	// }

	// err = dbQuery.UpdateUserRefreshToken(r.Context(), sqlc.UpdateUserRefreshTokenParams{
	// 	ID:               dbUser.ID,
	// 	RefreshTokenHash: pgtype.Text{String: hashedRefreshToken, Valid: true},
	// })

	err = dbQuery.UpdateUserRefreshToken(r.Context(), sqlc.UpdateUserRefreshTokenParams{
		ID:               dbUser.ID,
		RefreshTokenHash: pgtype.Text{String: refreshToken, Valid: true},
	})

	if err != nil {
		http.Error(w, "Token update failed: "+err.Error(), http.StatusInternalServerError)
		return
	}

	setCookies(w, accessToken, refreshToken)

	http.Redirect(w, r, FrontendURL+"/dashboard", http.StatusTemporaryRedirect)
}

func (s *Server) handleLogout(w http.ResponseWriter, r *http.Request) {
	removeCookies(w)
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

	setCookies(w, newAccessToken, newRefreshToken)

	w.WriteHeader(http.StatusOK)
}

func (s *Server) AuthMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		log.Println("AuthMiddleware")

		var accessToken string

		// Check for access token in cookie
		accessTokenCookie, err := r.Cookie("access_token")
		if err == nil && accessTokenCookie != nil {
			accessToken = accessTokenCookie.Value
		}

		// If not in cookie, check Authorization header
		if accessToken == "" {
			authHeader := r.Header.Get("Authorization")
			if strings.HasPrefix(authHeader, "Bearer ") {
				accessToken = strings.TrimPrefix(authHeader, "Bearer ")
			}
		}

		// If no access token found, attempt to refresh
		if accessToken == "" {
			s.handleTokenRefresh(w, r, next)
			return
		}

		// Validate access token
		claims, err := s.auth.ValidateAccessToken(accessToken)
		if err != nil {
			log.Printf("Access token validation failed: %v", err)
			s.handleTokenRefresh(w, r, next)
			return
		}

		log.Println(claims)

		// Token is valid, set user in context and proceed
		ctx := context.WithValue(r.Context(), userKey, claims)

		c, ok := ctx.Value(userKey).(*UserClaims)
		if !ok {
			s.respondError(w, http.StatusInternalServerError, "Error getting user claims in middleware")
			return
		}

		log.Println("User: ", c.Name)

		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

func (s *Server) handleTokenRefresh(w http.ResponseWriter, r *http.Request, next http.Handler) {
	refreshTokenCookie, err := r.Cookie("refresh_token")
	if err != nil {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}
	refreshClaims, err := s.auth.ValidateRefreshToken(refreshTokenCookie.Value)

	if err != nil {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	dbQuery := sqlc.New(s.db.GetPool())
	userIDBytes := [16]byte{}
	copy(userIDBytes[:], []byte(refreshClaims.UserID))
	user, err := dbQuery.GetUserByID(r.Context(), pgtype.UUID{
		Bytes: userIDBytes,
		Valid: true,
	})

	if err != nil {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	if user.RefreshTokenHash.String != refreshTokenCookie.Value {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	// err = s.auth.CompareHashedSecret(user.RefreshTokenHash.String, refreshTokenCookie.Value)
	// if err != nil {
	// 	http.Error(w, "Unauthorized", http.StatusUnauthorized)
	// 	return
	// }

	newAccessToken, newRefreshToken, err := s.auth.RefreshTokens(refreshTokenCookie.Value)

	if err != nil {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}
	err = dbQuery.UpdateUserRefreshToken(r.Context(), sqlc.UpdateUserRefreshTokenParams{
		ID:               user.ID,
		RefreshTokenHash: pgtype.Text{String: newRefreshToken, Valid: true},
	})

	if err != nil {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	setCookies(w, newAccessToken, newRefreshToken)

	claims, err := s.auth.ValidateAccessToken(newAccessToken)
	if err != nil {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}
	ctx := context.WithValue(r.Context(), userKey, claims)
	next.ServeHTTP(w, r.WithContext(ctx))
}

// Cookie functions
func setCookies(w http.ResponseWriter, accessToken, refreshToken string) {
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
}

func removeCookies(w http.ResponseWriter) {
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
}
