package main

import (
	"context"
	"errors"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/Strum355/log"

	"github.com/gal/timber/config"
)

func main() {
	log.InitJSONLogger(&log.Config{
		Output: os.Stdout,
	})

	config.InitConfig()

	ds, err := initDS()
	if err != nil {
		log.WithError(err).Error("Error while initializing data sources")
		return
	}

	router, err := inject(ds)
	if err != nil {
		log.WithError(err).Error("Error while injecting data sources")
		return
	}

	srv := &http.Server{
		Addr:    ":8080",
		Handler: router,
	}

	// Server shutdown
	go func() {
		if err := srv.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
			log.WithError(err).Error("Failed to initialize server")
		}
	}()

	log.Info("Listening on port " + srv.Addr)

	// Wait for channel kill signal
	quit := make(chan os.Signal)

	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)

	// This blocks until a signal is passed into the quit channel
	<-quit

	// CTX tells the server it has 5 seconds to finish the request it is currently handling
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	// Shutdown data sources
	if err := ds.close(); err != nil {
		log.WithError(err).Error("Failed to shutdown data sources gracefully")
	}

	// Shutdown server
	log.Info("Shutting down server...")
	if err := srv.Shutdown(ctx); err != nil {
		log.WithError(err).Error("Server forced to shutdown")
	}
}
