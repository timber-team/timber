package main

import (
	"net/http"

	"github.com/gal/timber/config"
	"github.com/gal/timber/router"
	"github.com/go-chi/chi"
)

func main() {
	config.InitConfig()

	r := chi.NewRouter()
	router.Route(r)

	panic(http.ListenAndServe(":8080", r))
}
