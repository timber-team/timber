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
	TagController         controllers.TagController
}

type Config struct {
	R                     *gin.Engine
	UserController        controllers.UserController
	ProjectController     controllers.ProjectController
	ApplicationController controllers.ApplicationController
	TokenController       controllers.TokenController
	TagController         controllers.TagController
}

func NewHandler(c *Config) {
	h := &Handler{
		c.UserController,
		c.ProjectController,
		c.ApplicationController,
		c.TokenController,
		c.TagController,
	}

	// TODO: Routing and Handlers
	g := c.R.Group("/api")

	if gin.Mode() != gin.TestMode {
		g.GET("/profile", middlewares.AuthUser(h.TokenController), h.Profile)
		g.POST("/projects", middlewares.AuthUser(h.TokenController), h.NewProject)
		g.GET("/projects/:projectID", middlewares.AuthUser(h.TokenController), h.GetProject)
		g.GET("/projects", middlewares.AuthUser(h.TokenController), h.GetProjects)
		g.POST("/projects/:projectID/apply", middlewares.AuthUser(h.TokenController), h.NewApplication)
		g.GET("/tags", middlewares.AuthUser(h.TokenController), h.GetTags)
		g.POST("/tags", middlewares.AuthUser(h.TokenController), h.NewTag)
	} else {
		g.GET("/profile", h.Profile)
		g.POST("/projects", h.NewProject)
		g.GET("/projects/:projectID", h.GetProject)
		g.GET("/projects", h.GetProjects)
		g.POST("/projects/:projectID/apply", h.NewApplication)
		g.GET("/tags", h.GetTags)
		g.POST("/tags", h.NewTag)
	}

	authHandler := g.Group("/auth")

	authHandler.GET("/signin/:provider", h.SignIn)
	authHandler.GET("/callback/:provider", h.OauthCallback)
	authHandler.POST("/tokens", h.Tokens)
}
