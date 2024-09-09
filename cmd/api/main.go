package main

import (
	"fmt"
	"log"

	"github.com/trading-backend/internal/auth"
	"github.com/trading-backend/internal/server"
)

func main() {

	auth.NewAuth()
	server, err := server.NewServer()

	if err != nil {
		panic(fmt.Sprintf("cannot start server: %s", err))
	}

	log.Printf("Server is running on port %v", server.Addr)

	log.Fatal(server.ListenAndServe())
}
