package auth

import (
	"errors"
	"net/http"
	"time"

	"github.com/golang-jwt/jwt"
	"github.com/markbates/goth"
	"github.com/markbates/goth/gothic"
	"github.com/markbates/goth/providers/google"
	"github.com/trading-backend/config"
	"github.com/trading-backend/internal/database/sqlc"
	"github.com/trading-backend/internal/lib"
	"golang.org/x/crypto/bcrypt"
)

const (
	AccessTokenExpiry  = 15 * time.Minute
	RefreshTokenExpiry = 7 * 24 * time.Hour
	AccessAudience     = "access"
	RefreshAudience    = "refresh"
)

type AuthService struct {
	jwtSecret []byte
}

type UserClaims struct {
	Email  string `json:"email"`
	Name   string `json:"name"`
	UserID string `json:"user_id"`
	jwt.StandardClaims
}

type RefreshClaims struct {
	UserID string `json:"user_id"`
	jwt.StandardClaims
}

func NewAuthService() *AuthService {
	goth.UseProviders(
		google.New(
			config.Envs.GoogleClientId,
			config.Envs.GoogleClientSecret,
			"http://localhost:5000/auth/google/callback",
			"email",
			"profile",
		),
	)

	gothic.GetProviderName = func(req *http.Request) (string, error) {
		return "google", nil
	}

	return &AuthService{
		jwtSecret: []byte(config.Envs.JWTSecret),
	}
}

func (s *AuthService) GenerateTokenPair(user *goth.User) (string, string, error) {
	accessToken, err := s.generateAccessToken(user)
	if err != nil {
		return "", "", err
	}

	refreshToken, err := s.generateRefreshToken(user)
	if err != nil {
		return "", "", err
	}

	return accessToken, refreshToken, nil
}

func (s *AuthService) generateAccessToken(user *goth.User) (string, error) {
	claims := UserClaims{
		Email:  user.Email,
		Name:   user.Name,
		UserID: user.UserID,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: time.Now().Add(AccessTokenExpiry).Unix(),
			IssuedAt:  time.Now().Unix(),
			Audience:  AccessAudience,
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(s.jwtSecret)
}

func (s *AuthService) generateRefreshToken(user *goth.User) (string, error) {
	claims := RefreshClaims{
		UserID: user.UserID,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: time.Now().Add(RefreshTokenExpiry).Unix(),
			IssuedAt:  time.Now().Unix(),
			Audience:  RefreshAudience,
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(s.jwtSecret)
}

func (s *AuthService) RefreshTokens(user *sqlc.User) (string, string, error) {
	if user == nil {
		return "", "", errors.New("user is nil")
	}

	userIDString := lib.UUIDToString(user.ID)

	claims := &goth.User{
		UserID: userIDString,
		Name:   user.Name,
		Email:  user.Email,
	}

	return s.GenerateTokenPair(claims)
}

// Validate Utility function to validate a token
func (s *AuthService) ValidateAccessToken(tokenString string) (*UserClaims, error) {
	token, err := jwt.ParseWithClaims(tokenString, &UserClaims{}, func(token *jwt.Token) (interface{}, error) {
		return s.jwtSecret, nil
	})
	if err != nil {
		return nil, err
	}
	if claims, ok := token.Claims.(*UserClaims); ok && token.Valid {
		return claims, nil
	}
	return nil, errors.New("invalid token")
}

func (s *AuthService) ValidateRefreshToken(tokenString string) (*RefreshClaims, error) {
	token, err := jwt.ParseWithClaims(tokenString, &RefreshClaims{}, func(token *jwt.Token) (interface{}, error) {
		return s.jwtSecret, nil
	})
	if err != nil {
		return nil, err
	}
	if claims, ok := token.Claims.(*RefreshClaims); ok && token.Valid {
		return claims, nil
	}
	return nil, errors.New("invalid token")
}

// Hashing and Salting Secrets
func (s *AuthService) HashSecret(secret string) (string, error) {
	hash, err := bcrypt.GenerateFromPassword([]byte(secret), bcrypt.DefaultCost)
	if err != nil {
		return "", err
	}
	return string(hash), nil
}

func (s *AuthService) CompareHashedSecret(hashedSecret, secret string) error {
	return bcrypt.CompareHashAndPassword([]byte(hashedSecret), []byte(secret))
}
