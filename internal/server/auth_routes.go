package server

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strings"

	"github.com/go-chi/chi/v5"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/markbates/goth"
	"github.com/markbates/goth/gothic"
	"github.com/trading-backend/internal/database/sqlc"
	"github.com/trading-backend/internal/lib"
	"github.com/trading-backend/internal/service/auth"
)

type contextKey string

const (
	FrontendURL            = "http://localhost:5173"
	providerKey contextKey = "__provider_key__"
	userKey     contextKey = "__user_key__"
)

/*************************************************/
/************GOTHIC AUTH HANDLER STARTS***********/
/*************************************************/

func (s *Server) authHandler(w http.ResponseWriter, r *http.Request) {
	provider := chi.URLParam(r, "provider")
	r = r.WithContext(context.WithValue(r.Context(), providerKey, provider))
	gothic.BeginAuthHandler(w, r)
}

func (s *Server) authCallbackHandler(w http.ResponseWriter, r *http.Request) {
	log.Println("handleAuthCallback")
	provider := chi.URLParam(r, "provider")
	r = r.WithContext(context.WithValue(r.Context(), providerKey, provider))

	// Retrieve the state parameter
	state := r.URL.Query().Get("state")
	if state == "" {
		log.Println("Missing state parameter")
		s.sendAuthResponse(w, "AUTH_ERROR", nil, "Missing state parameter", "")
		return
	}

	user, err := gothic.CompleteUserAuth(w, r)
	if err != nil {
		log.Println("Authentication failed: ", err)
		s.sendAuthResponse(w, "AUTH_ERROR", nil, err.Error(), state)
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
			log.Println("User creation failed: ", err)
			s.sendAuthResponse(w, "AUTH_ERROR", nil, "User creation failed", state)
			return
		}
	}

	accessToken, refreshToken, err := s.auth.GenerateTokenPair(&goth.User{
		UserID:    lib.UUIDToString(dbUser.ID),
		Email:     dbUser.Email,
		Name:      dbUser.Name,
		AvatarURL: dbUser.AvatarUrl.String,
	})

	if err != nil {
		log.Println("Token generation failed: ", err)
		s.sendAuthResponse(w, "AUTH_ERROR", nil, "Token generation failed", state)
		return
	}

	err = dbQuery.UpdateUserRefreshToken(r.Context(), sqlc.UpdateUserRefreshTokenParams{
		ID:               dbUser.ID,
		RefreshTokenHash: pgtype.Text{String: refreshToken, Valid: true},
	})

	if err != nil {
		log.Println("Token update failed: ", err)
		s.sendAuthResponse(w, "AUTH_ERROR", nil, "Token update failed", state)
		return
	}

	SetCookies(w, accessToken, refreshToken)

	userResponse := map[string]interface{}{
		"id":        lib.UUIDToString(dbUser.ID),
		"email":     dbUser.Email,
		"name":      dbUser.Name,
		"avatarUrl": dbUser.AvatarUrl.String,
	}

	s.sendAuthResponse(w, "AUTH_SUCCESS", userResponse, "", state)
}

func (s *Server) sendAuthResponse(w http.ResponseWriter, responseType string, user interface{}, errorMsg string, state string) {
	response := map[string]interface{}{
		"type":  responseType,
		"state": state,
	}
	if user != nil {
		response["user"] = user
	}
	if errorMsg != "" {
		response["error"] = errorMsg
	}

	jsonResponse, err := json.Marshal(response)
	if err != nil {
		log.Printf("Error marshaling JSON response: %v", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	// Escape single quotes in the JSON string
	escapedJSON := strings.Replace(string(jsonResponse), "'", "\\'", -1)

	w.Header().Set("Content-Type", "text/html")
	fmt.Fprintf(w, `
		<html>
		<body>
			<script>
				window.opener.postMessage('%s', '%s');
				window.close();
			</script>
		</body>
		</html>
	`, escapedJSON, FrontendURL)
}

/*************************************************/
/*************GOTHIC AUTH HANDLER ENDS************/
/*************************************************/

func (s *Server) logoutHandler(w http.ResponseWriter, r *http.Request) {
	RemoveCookies(w)
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	lib.RespondJSON(w, http.StatusOK, map[string]string{"message": "Logged out successfully"})
}

func (s *Server) AuthMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		log.Println("AuthMiddleware")

		var accessToken string

		// Check for access token in cookie
		accessTokenCookie, err := r.Cookie("access_token")
		if err == nil && accessTokenCookie != nil {
			accessToken = accessTokenCookie.Value
			log.Println("AccessTokenFromCookie")

		}

		// If not in cookie, check Authorization header
		if accessToken == "" {
			authHeader := r.Header.Get("Authorization")
			if strings.HasPrefix(authHeader, "Bearer ") {
				accessToken = strings.TrimPrefix(authHeader, "Bearer ")
				log.Println("AccessTokenFromHeader")
			}
		}

		// If no access token found, attempt to refresh
		if accessToken == "" {
			s.authHandler(w, r)
			return
		}

		// Validate access token
		claims, err := s.auth.ValidateAccessToken(accessToken)
		if err != nil {
			log.Printf("Access token validation failed: %v", err)
			// s.handleTokenRefresh(w, r, next)
			// s.handleTokenRefresh(w, r)
			lib.RespondError(w, http.StatusUnauthorized, "Unauthorized")
			return
		}

		log.Println(claims)

		// Token is valid, set user in context and proceed
		ctxWithUser := context.WithValue(r.Context(), userKey, claims)
		rWithUser := r.WithContext(ctxWithUser)

		next.ServeHTTP(w, rWithUser)
	})
}

func (s *Server) refreshTokenHandler(w http.ResponseWriter, r *http.Request) {
	log.Println("handleRefresh")

	var refreshToken string
	refreshTokenCookie, err := r.Cookie("refresh_token")
	if err == nil && refreshTokenCookie != nil {
		refreshToken = refreshTokenCookie.Value
	}

	log.Println("RefreshTokenFromCookie: ", refreshToken)

	// if refreshToken == "" {
	// 	authHeader := r.Header.Get("Authorization")
	// 	if strings.HasPrefix(authHeader, "Bearer ") {
	// 		refreshToken = strings.TrimPrefix(authHeader, "Bearer ")
	// 	}
	// }

	if refreshToken == "" {
		s.authHandler(w, r)
		return
	}

	// log.Println("RefreshTokenFromHeader: ", refreshToken)

	refreshClaims, err := s.auth.ValidateRefreshToken(refreshToken)
	if err != nil {
		log.Println("Refresh token validation failed: ", err)
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	dbQuery := sqlc.New(s.db.GetPool())

	userID, err := lib.UUIDFromString(refreshClaims.UserID)

	if err != nil {
		log.Println("User ID conversion failed: ", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	user, err := dbQuery.GetUserByID(r.Context(), userID)

	if err != nil {
		log.Println("User not found")
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	if user.RefreshTokenHash.String != refreshToken {
		log.Println("Refresh token mismatch")
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	newAccessToken, newRefreshToken, err := s.auth.RefreshTokens(&user)
	if err != nil {
		log.Println("Token refresh failed: ", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	log.Println("NewAccessToken: ", newAccessToken)
	log.Println("NewRefreshToken: ", newRefreshToken)

	err = dbQuery.UpdateUserRefreshToken(r.Context(), sqlc.UpdateUserRefreshTokenParams{
		ID:               user.ID,
		RefreshTokenHash: pgtype.Text{String: newRefreshToken, Valid: true},
	})
	if err != nil {
		log.Println("Token update failed: ", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	SetCookies(w, newAccessToken, newRefreshToken)

	claims, err := s.auth.ValidateAccessToken(newAccessToken)
	if err != nil {
		log.Println("Access token validation failed: ", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	lib.RespondJSON(w, http.StatusOK, claims)
}

func (s *Server) getAuthStatusHandler(w http.ResponseWriter, r *http.Request) {
	log.Println("handleAuthStatus")
	accessTokenCookie, err := r.Cookie("access_token")
	if err != nil {
		log.Println("No access token cookie")
		lib.RespondError(w, http.StatusUnauthorized, "Unauthorized")
		return
	}

	accessToken := accessTokenCookie.Value

	if accessToken == "" {
		log.Println("No access token")
		lib.RespondError(w, http.StatusUnauthorized, "Unauthorized")
		return
	}

	claims, err := s.auth.ValidateAccessToken(accessToken)
	if err != nil {
		log.Println("Access token validation failed: ", err)
		lib.RespondError(w, http.StatusUnauthorized, "Unauthorized")
		return
	}

	type StatusResponse struct {
		Status string           `json:"status"`
		User   *auth.UserClaims `json:"user"`
	}

	lib.RespondJSON(w, http.StatusOK, StatusResponse{
		Status: "Authenticated",
		User:   claims,
	})
}
