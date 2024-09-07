package main

import (
	"context"
	"net/http"
	"net/http/httptest"
	"os"
	"testing"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/joho/godotenv"
)

// TestMain is the entry point for tests. It sets up shared resources before tests run.
func TestMain(m *testing.M) {
	// Load environment variables from .env file
	if err := godotenv.Load("../.env"); err != nil {
		os.Exit(1)
	}

	// Initialize the database connection
	var err error
	dbpool, err = pgxpool.New(context.Background(), os.Getenv("DATABASE_URL"))
	if err != nil {
		os.Exit(1)
	}
	defer dbpool.Close()

	// Initialize the router for tests
	router = setupRouter()

	// Run the tests
	os.Exit(m.Run())
}

// TestMainHandler tests the "/" endpoint.
func TestMainHandler(t *testing.T) {
	req, err := http.NewRequest("GET", "/", nil)
	if err != nil {
		t.Fatal(err)
	}

	rr := httptest.NewRecorder()
	router.ServeHTTP(rr, req)

	if status := rr.Code; status != http.StatusOK {
		t.Errorf("handler returned wrong status code: got %v want %v", status, http.StatusOK)
	}

	expected := "Hello World!"
	if rr.Body.String() != expected {
		t.Errorf("handler returned unexpected body: got %v want %v", rr.Body.String(), expected)
	}
}

// TestDatabaseConnection tests if the database connection is successfully established.
func TestDatabaseConnection(t *testing.T) {
	if err := dbpool.Ping(context.Background()); err != nil {
		t.Fatalf("Unable to ping the database: %v", err)
	}
}
