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

func NewHandler(c *Config) {
	h := &Handler{
		c.UserController,
		c.ProjectController,
		c.ApplicationController,
		c.TokenController,
	}

	g := c.R

	userHandler := g.Group("/users")
	{
		userHandler.GET("/:id", h.GetUser)
	}

	authHandler := g.Group("/auth")
	{
		authHandler.GET("/signin/:provider", h.SignIn)
		g.GET("/auth/callback/:provider", h.OauthCallback)
	}
}
