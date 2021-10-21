package main

import (
	"github.com/Strum355/log"
	"github.com/gal/timber/controllers"
	"github.com/gal/timber/models"
	"github.com/go-chi/chi"
)

func inject(d *dataSources) (*chi.Mux, error) {
	log.Info("Injecting data sources")

	// Migrate postgres
	d.DB.Exec("CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";") // enable uuid generation on server
	d.DB.AutoMigrate(&models.User{}, &models.UserAuth{}, &models.Project{}, &models.Application{})

	/*
	 * Model layer
	 */
	userStore := models.NewUserStore(d.DB)
	authStore := models.NewAuthStore(d.DB)
	projectStore := models.NewProjectStore(d.DB)
	// TODO:
	//applicationStore := models.NewApplicationStore(d.DB)

	//tokenStore := models.NewTokenRepository(d.RedisClient)

	/*
	 * Controller layer
	 */
	userHandler := controllers.NewUserHandler(*userStore, *authStore)
	projectHandler := controllers.NewProjectHandler(*projectStore)
	// TODO:
	//applicationHandler := controllers.NewApplicationHandler(applicationStore)

	//tokenHandler := controllers.NewTokenHandler(tokenStore)

	// TODO:
	//// Load auth key from env variable
	//authKey := viper.GetString("auth.key")

	// TODO:
	//// Load expiration lengths from env variables and parse as int
	//accessTokenExp := time.Minute * 15
	//refreshTokenExp := time.Hour * 24 * 30
	//
	//
	//tokenHandler := controllers.NewTokenHandler(&controllers.TokenHandlerConfig{
	//	tokenStore:       tokenStore,
	//	AuthKey:         authKey,
	//	AccessExpiration:      accessTokenExp,
	//	RefreshExpiration: refreshTokenExp,
	//})

	// Initialize chi Router
	router := chi.NewRouter()

	controllers.NewHandler(&controllers.Config{
		R:              router,
		UserHandler:    *userHandler,
		ProjectHandler: *projectHandler,
		// TODO:
		//ApplicationHandler: ApplicationHandler,
		//TokenHandler:	TokenHandler,
	})

	return router, nil
}
