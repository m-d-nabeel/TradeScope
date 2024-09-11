package main

import (
	"fmt"
	"log"

	"github.com/trading-backend/internal/server"
)

func main() {

	server, err := server.New()

	if err != nil {
		panic(fmt.Sprintf("cannot start server: %s", err))
	}

	log.Printf("Server is running on port %v", server.Addr)

	log.Fatal(server.ListenAndServe())
}
