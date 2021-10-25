package views

import (
	"github.com/gal/timber/controllers"
	"github.com/gal/timber/middlewares"
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

func NewHandler(c *Config) {
	h := &Handler{
		c.UserController,
		c.ProjectController,
		c.ApplicationController,
		c.TokenController,
	}

	g := c.R

	// TODO: Routing and Handlers

	if gin.Mode() != gin.TestMode {
		g.GET("/profile", middlewares.AuthUser(h.TokenController), h.Profile)
		g.POST("/projects", middlewares.AuthUser(h.TokenController), h.NewProject)
	} else {
		g.GET("/profile", middlewares.AuthUser(h.TokenController), h.Profile)
		g.GET("/profile", h.Profile)
	}

	g.POST("/signup", h.Signup)
	g.POST("/signin", h.Signin)
}
