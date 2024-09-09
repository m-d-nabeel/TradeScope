package auth

import (
	"log"
	"net/http"
	"os"

	"github.com/gorilla/sessions"
	"github.com/joho/godotenv"
	"github.com/markbates/goth"
	"github.com/markbates/goth/gothic"
	"github.com/markbates/goth/providers/google"
)

const (
	MaxAge = 60 * 60 * 24 * 7
	IsProd = false
)

func NewAuth() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	googleClientID := os.Getenv("GOOGLE_CLIENT_ID")
	googleClientSecret := os.Getenv("GOOGLE_CLIENT_SECRET")
	backendURL := os.Getenv("BACKEND_URL")

	store := sessions.NewCookieStore([]byte(os.Getenv("SECRET_KEY")))
	store.MaxAge(MaxAge)
	store.Options.Path = "/"
	store.Options.HttpOnly = true
	store.Options.Secure = IsProd

	gothic.Store = store

	goth.UseProviders(
		google.New(googleClientID, googleClientSecret, backendURL+"/auth/google/callback", "email", "profile"),
	)

	gothic.GetProviderName = func(req *http.Request) (string, error) {
		return "google", nil
	}
}
