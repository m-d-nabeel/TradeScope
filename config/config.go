package config

import (
	"fmt"
	"os"
	"strconv"

	_ "github.com/joho/godotenv/autoload"
)

type Config struct {
	DatabaseUrl             string
	DbDatabase              string
	DbPassword              string
	DbUsername              string
	DbPort                  string
	DbHost                  string
	DbSchema                string
	Port                    int
	BackendUrl              string
	SecretKey               string
	GoogleClientId          string
	GoogleClientSecret      string
	ApcaApiKeyId            string
	ApcaApiSecretKey        string
	ApcaApiBaseUrl          string
	CookiesAuthSecret       string
	CookiesAuthAgeInSeconds int
	CookiesAuthIsSecure     bool
	CookiesAuthIsHttpOnly   bool
}

var Envs = initConfig()

func initConfig() Config {
	return Config{
		DatabaseUrl:             getEnv("DATABASE_URL", ""),
		DbDatabase:              getEnv("DB_DATABASE", ""),
		DbPassword:              getEnv("DB_PASSWORD", ""),
		DbUsername:              getEnv("DB_USERNAME", ""),
		DbPort:                  getEnv("DB_PORT", "5432"),
		DbHost:                  getEnv("DB_HOST", ""),
		DbSchema:                getEnv("DB_SCHEMA", ""),
		Port:                    getEnvAsInt("PORT", 5000),
		BackendUrl:              getEnv("BACKEND_URL", "http://localhost:8080"),
		SecretKey:               getEnvOrError("SECRET_KEY"),
		GoogleClientId:          getEnvOrError("GOOGLE_CLIENT_ID"),
		GoogleClientSecret:      getEnvOrError("GOOGLE_CLIENT_SECRET"),
		ApcaApiKeyId:            getEnvOrError("APCA_API_KEY_ID"),
		ApcaApiSecretKey:        getEnvOrError("APCA_API_SECRET_KEY"),
		ApcaApiBaseUrl:          getEnvOrError("APCA_API_BASE_URL"),
		CookiesAuthSecret:       getEnv("COOKIES_AUTH_SECRET", "some-very-secret-key"),
		CookiesAuthAgeInSeconds: getEnvAsInt("COOKIES_AUTH_AGE_IN_SECONDS", 60*60*24*2),
		CookiesAuthIsSecure:     getEnvAsBool("COOKIES_AUTH_IS_SECURE", false),
		CookiesAuthIsHttpOnly:   getEnvAsBool("COOKIES_AUTH_IS_HTTP_ONLY", false),
	}
}

func getEnv(key, fallback string) string {
	if value, ok := os.LookupEnv(key); ok {
		return value
	}

	return fallback
}

func getEnvOrError(key string) string {
	if value, ok := os.LookupEnv(key); ok {
		return value
	}

	panic(fmt.Sprintf("Environment variable %s is not set", key))

}

func getEnvAsInt(key string, fallback int) int {
	if value, ok := os.LookupEnv(key); ok {
		i, err := strconv.Atoi(value)
		if err != nil {
			return fallback
		}

		return i
	}

	return fallback
}

func getEnvAsBool(key string, fallback bool) bool {
	if value, ok := os.LookupEnv(key); ok {
		b, err := strconv.ParseBool(value)
		if err != nil {
			return fallback
		}

		return b
	}

	return fallback
}
