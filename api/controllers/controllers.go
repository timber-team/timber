package controllers

import (
	"net/http"

	"github.com/gal/timber/middlewares"
	"github.com/go-chi/chi"
)

// TODO: The whole ass file

type Handler struct {
	UserHandler UserHandler
	//AuthHandler AuthHandler
	//ProjectHandler ProjectHandler
	//ApplicationHandler ApplicationHandler
	//TokenHandler TokenHandler
}

type Config struct {
	R           *chi.Mux
	UserHandler UserHandler
	//AuthHandler AuthHandler
	//ProjectHandler ProjectHandler
	//ApplicationHandler ApplicationHandler
	//TokenHandler	TokenHandler
}

func NewHandler(c *Config) { // Create the handler
	h := &Handler{
		UserHandler: c.UserHandler,
		//AuthHandler: c.AuthHandler,
		//ProjectHandler: c.ProjectHandler,
		//ApplicationHandler: c.ApplicationHandler,
		//TokenHandler:	c.TokenHandler,
	}
	r := c.R
	r.Use(middlewares.CheckTokens)
	r.Get("/", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
	})

	r.Handle("/users", userRoutes(*h))
	//r.Handle("/tokens", tokenRoutes(h))
}

func userRoutes(h Handler) http.Handler {
	r := chi.NewRouter()

	r.Get("/{id}", h.GetUser)
	//r.Post("/", h.CreateUser)
	//r.Patch("/{id}", h.PatchUser)
	//r.Delete("/{id}", h.DeleteUser)

	return r
}

//func tokenRoutes(h *Handler) http.Handler {
//	r := chi.NewRouter()
//
//	r.Get("/", h.InspectAccessToken)
//	r.Post("/", h.CreateAccessToken)
//	r.Delete("/", h.DeleteAccessToken)
//
//	r.Get("/refresh", h.InspectRefreshToken)
//	r.Post("/refresh", h.CreateRefreshToken)
//	r.Delete("/refresh", h.DeleteRefreshToken)
//
//	return r
//}

//if gin.Mode() != gin.TestMode {
//	g.Use(middlewares.Timeout(c.TimeoutDuration, apperrors.NewServiceUnavailable()))
//	g.GET("/me", middlewares.AuthUser(h.TokenService), h.Me)
//	g.POST("/signout", middlewares.AuthUser(h.TokenService), h.Signout)
//	g.PUT("/details", middlewares.AuthUser(h.TokenService), h.Details)
//	g.POST("/image", middlewares.AuthUser(h.TokenService), h.UploadImage)
//	g.DELETE("/image", middlewares.AuthUser(h.TokenService), h.DeleteImage)
//} else {
//	g.GET("/me", h.Me)
//	g.POST("/signout", h.Signout)
//	g.PUT("/details", h.Details)
//	g.POST("/image", h.UploadImage)
//	g.DELETE("/image", h.DeleteImage)
//}
//g.POST("/signup", h.Signup)
//g.POST("/signin", h.Signin)
//g.POST("/tokens", h.Tokens)
// }
