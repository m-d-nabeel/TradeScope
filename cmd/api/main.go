package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/trading-backend/internal/server"
)

func main() {

	svr, err := server.New()
	if err != nil {
		log.Fatalf("failed to initialize server: %v", err)
	}
	cJob := svr.InitCronScheduler()

	defer cJob.Stop()
	defer svr.Close()

	errChan := make(chan error, 1)
	go func() {
		log.Printf("server is running on port %v", svr.Addr)
		if err := svr.Start(); err != nil && err != http.ErrServerClosed {
			errChan <- fmt.Errorf("failed to start server: %v", err)
		}
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)

	select {
	case <-quit:
		log.Println("Shutting down server...")
	case err := <-errChan:
		log.Fatalf("Server error: %v", err)
	}

	ctx, cancel := context.WithTimeout(context.Background(), 15*time.Second)
	defer cancel()

	if err := svr.Shutdown(ctx); err != nil {
		log.Fatalf("Server forced to shutdown: %v", err)
	}

	log.Println("Server exiting")
}
