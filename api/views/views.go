package views

import (
	"github.com/gal/timber/controllers"
	"github.com/gin-gonic/gin"
)

type Handler struct {
	UserController        controllers.UserController
	ProjectController     controllers.ProjectController
	ApplicationController controllers.ApplicationController
	TokenController       controllers.TokenController
}

type Config struct {
	R                     *gin.Engine
	UserController        controllers.UserController
	ProjectController     controllers.ProjectController
	ApplicationController controllers.ApplicationController
	TokenController       controllers.TokenController
}

func NewHandler(c *Config) { // Create the handler
	h := &Handler{
		c.UserController,
		c.ProjectController,
		c.ApplicationController,
		c.TokenController,
	}

	g := c.R

	g.POST("/signup", h.Signup)

	// TODO: Routing and Handlers

	//if gin.Mode() != gin.TestMode {
	//	//g.Use(middlewares.Timeout(c.TimeoutDuration, apperrors.NewServiceUnavailable()))
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
	//g.POST("/signin", h.Signin)
	//g.POST("/tokens", h.Tokens)
}

//func NewHandler(c *Config) { // Create the handler
//	h := &Handler{
//		UserHandler:        c.UserHandler,
//		ProjectHandler:     c.ProjectHandler,
//		ApplicationHandler: c.ApplicationHandler,
//		//TokenHandler:	c.TokenHandler,
//	}
//	r := c.R
//	r.Use(middleware.Logger)
//	r.Use(middlewares.CheckTokens)
//	r.Get("/", func(w http.ResponseWriter, r *http.Request) {
//		w.WriteHeader(http.StatusOK)
//	})
//
//	r.Handle("/users", userRoutes(h))
//	//r.Handle("/tokens", tokenRoutes(h))
//}
//
//func userRoutes(h *Handler) http.Handler {
//	r := chi.NewRouter()
//
//	r.Get("/{id}", h.GetUser)
//	r.Post("/signup", h.CreateUser)
//	r.Patch("/{id}", h.PatchUser)
//	r.Delete("/{id}", h.DeleteUser)
//
//	return r
//}
//
////func tokenRoutes(h *Handler) http.Handler {
////	r := chi.NewRouter()
////
////	r.Get("/", h.InspectAccessToken)
////	r.Post("/", h.CreateAccessToken)
////	r.Delete("/", h.DeleteAccessToken)
////
////	r.Get("/refresh", h.InspectRefreshToken)
////	r.Post("/refresh", h.CreateRefreshToken)
////	r.Delete("/refresh", h.DeleteRefreshToken)
////
////	return r
////}
