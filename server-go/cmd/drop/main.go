package main

import (
	"fmt"
	"log"
	"net/http"

	"infps.drop/internal/config"
)

func main() {
	// load config
	cfg := config.MustLoad()

	// db setup
	// routes setup
	router := http.NewServeMux()

	router.HandleFunc("GET /", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("Running"))
	})
	// server setup

	server := http.Server{
		Addr:    cfg.Address,
		Handler: router,
	}

	fmt.Printf("Server starting and running at %s", cfg.Address)
	err := server.ListenAndServe()

	if err != nil {
		log.Fatalf("Error while starting server: %s", err.Error())
	}

}
