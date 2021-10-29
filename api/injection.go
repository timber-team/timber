package main

import (
	"time"

	"github.com/Strum355/log"
	"github.com/gal/timber/controllers"
	"github.com/gal/timber/models"
	"github.com/gal/timber/views"
	"github.com/gin-gonic/gin"
	"github.com/spf13/viper"
)

func inject(d *dataSources) (*gin.Engine, error) {
	log.Info("Injecting data sources")

	// Migrate postgres
	d.DB.Exec("CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";") // enable uuid generation on server
	d.DB.AutoMigrate(&models.User{}, &models.Project{}, &models.Application{})

	d.DB.Preload("Projects").Preload("Applications").Find(&models.User{})
	d.DB.Preload("Collaborators").Preload("Applications").Find(&models.Project{})

	/*
	 * Model layer
	 */
	userStore := models.NewUserStore(d.DB)
	projectStore := models.NewProjectStore(d.DB)
	applicationStore := models.NewApplicationStore(d.DB)
	tokenStore := models.NewTokenStore(d.RedisClient)

	/*
	 * Controller layer
	 */
	userController := controllers.NewUserController(*userStore)
	projectController := controllers.NewProjectController(*projectStore)
	applicationController := controllers.NewApplicationController(*applicationStore)

	// Load auth key from env variable
	authKey := viper.GetString("auth.key")

	// Load expiration lengths
	accessTokenExp := int64(time.Minute * 10)
	refreshTokenExp := int64(time.Hour * 24 * 30)

	tokenController := controllers.NewTokenController(*tokenStore, *userStore, authKey, accessTokenExp, refreshTokenExp)

	// Initialize router
	router := gin.Default()

	views.NewHandler(&views.Config{
		R:                     router,
		UserController:        *userController,
		ProjectController:     *projectController,
		ApplicationController: *applicationController,
		TokenController:       *tokenController,
	})

	return router, nil
}
