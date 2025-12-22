package main

import (
	"log"
	"net/http"

	"infps.drop/internal/config"
	"infps.drop/internal/handlers/users"
)

func main() {
	// load config
	cfg := config.MustLoad()

	// db setup
	// routes setup
	router := http.NewServeMux()

	router.HandleFunc("POST /api/users/create", users.NewStudent())
	// server setup

	server := http.Server{
		Addr:    cfg.Address,
		Handler: router,
	}

	log.Printf("Server starting and running at %s", cfg.Address)
	err := server.ListenAndServe()

	if err != nil {
		log.Fatalf("Error while starting server: %s", err.Error())
	}

}
