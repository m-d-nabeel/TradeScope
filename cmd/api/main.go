package main

import (
	"context"
	"log"
	"net/http"
	"os"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/joho/godotenv"
)

var dbpool *pgxpool.Pool
var router *chi.Mux

// Set up the router
func setupRouter() *chi.Mux {
	r := chi.NewRouter()
	r.Use(middleware.Logger)
	r.Get("/", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("Hello World!"))
	})
	return r
}

func main() {
	// Load environment variables
	if err := godotenv.Load("../.env"); err != nil {
		log.Fatalf("Error loading .env file: %v", err)
	}

	// Check that the DATABASE_URL is properly loaded
	databaseURL := os.Getenv("DATABASE_URL")
	port := os.Getenv("PORT")
	if databaseURL == "" {
		log.Fatalf("DATABASE_URL not set in environment")
	}
	log.Printf("Connecting to database at: %s", databaseURL)

	// Initialize database connection
	var err error
	dbpool, err = pgxpool.New(context.Background(), databaseURL)
	if err != nil {
		log.Fatalf("Unable to connect to database: %v", err)
	}
	defer dbpool.Close()

	log.Println("Connected to database successfully!")

	// Start HTTP server
	r := setupRouter()
	log.Printf("Starting server on :%v", port)
	if err := http.ListenAndServe(":"+port, r); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}
