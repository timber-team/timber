package router

import (
	"github.com/gal/timber/middlewares"
	"github.com/go-chi/chi/middleware"
	"net/http"

	"github.com/gal/timber/views"
	"github.com/go-chi/chi"
)

func Route(r *chi.Mux) {
	r.Use(middleware.DefaultLogger)
	r.Use(middlewares.CheckTokens)
	r.Get("/", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
	})

	r.Handle("/users", userHandler())
}

func userHandler() http.Handler {
	r := chi.NewRouter()

	r.Get("/{id}", views.GetUser)
	r.Post("/", views.CreateUser)
	r.Patch("/{id", views.PatchUser)
	r.Delete("/{id}", views.DeleteUser)

	return r
}
