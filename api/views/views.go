package views

import (
	"github.com/gal/timber/controllers"
	"github.com/gal/timber/middlewares"
	"github.com/gal/timber/utils"
	"github.com/gal/timber/utils/customresponse"
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

	g := c.R.Group("/api")

	if gin.Mode() != gin.TestMode {
		g.PATCH("/users", middlewares.AuthUser(h.TokenController), h.UpdateUser)
		g.GET("/profile", middlewares.AuthUser(h.TokenController), h.Profile)
		g.GET("/profile/:userID", middlewares.AuthUser(h.TokenController), h.ProfileByID)
		g.POST("/projects", middlewares.AuthUser(h.TokenController), h.NewProject)
		g.GET("/projects/:projectID", middlewares.AuthUser(h.TokenController), h.GetProject)
		g.GET("/projects", middlewares.AuthUser(h.TokenController), h.GetProjects)
		g.POST("/projects/:projectID/apply", middlewares.AuthUser(h.TokenController), h.NewApplication)
		g.GET("/users/:ownerID/projects", middlewares.AuthUser(h.TokenController), h.GetProjectsByOwnerID)
		g.GET("/applications/:appID", middlewares.AuthUser(h.TokenController), h.GetApplicationByID)
		g.GET("/projects/:projectID/applications", middlewares.AuthUser(h.TokenController), h.GetApplicationsByProjectID)
		g.GET("/tags", middlewares.AuthUser(h.TokenController), h.GetTags)
		g.GET("/tags/:tagID", middlewares.AuthUser(h.TokenController), h.GetTag)
		g.POST("/tags", middlewares.AuthUser(h.TokenController), h.NewTag)
		g.GET("/projects/:projectID/tags", middlewares.AuthUser(h.TokenController), h.GetTagsByProjectID)
	} else {
		g.GET("/profile", h.Profile)
		g.GET("/profile/:userID", h.ProfileByID)
		g.POST("/projects", h.NewProject)
		g.GET("/projects/:projectID", h.GetProject)
		g.GET("/projects", h.GetProjects)
		g.POST("/projects/:projectID/apply", h.NewApplication)
		g.GET("/users/:ownerID/projects", h.GetProjectsByOwnerID)
		g.GET("/applications/:appID", h.GetApplicationByID)
		g.GET("/projects/:projectID/applications", h.GetApplicationsByProjectID)
		g.GET("/tags", h.GetTags)
		g.GET("/tags/:tagID", h.GetTag)
		g.POST("/tags", h.NewTag)
		g.GET("/projects/:projectID/tags", h.GetTagsByProjectID)
	}

	c.R.NoRoute(func(c *gin.Context) {
		utils.Respond(c, customresponse.NewInternal(), nil)
	})

	authHandler := g.Group("/auth")

	authHandler.GET("/signin/:provider", h.SignIn)
	authHandler.GET("/callback/:provider", h.OauthCallback)
	authHandler.POST("/tokens", h.Tokens)
}
