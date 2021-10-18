package router

import (
	"net/http"

	"github.com/gal/timber/views"
	"github.com/go-chi/chi"
)

func Route(r *chi.Mux) {
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
