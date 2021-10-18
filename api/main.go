package main

import (
	"net/http"
	"os"

	"github.com/Strum355/log"
	"github.com/go-chi/chi"

	"github.com/gal/timber/config"
	"github.com/gal/timber/router"
)

func main() {
	log.InitJSONLogger(&log.Config{
		Output: os.Stdout,
	})

	config.InitConfig()

	r := chi.NewRouter()
	router.Route(r)

	panic(http.ListenAndServe(":8080", r))
}
