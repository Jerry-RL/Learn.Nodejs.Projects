package main

import (
	"hitime/config"
	"hitime/router"
	"log"
)

func main() {
	cfg := config.Load()
	r := router.SetupRouter(cfg)
	if err := r.Run(cfg.Port); err != nil {
		log.Fatalf("server failed: %v", err)
	}
} 