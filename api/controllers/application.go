package controllers

import "github.com/gal/timber/models"

type ApplicationController struct {
	Applications models.ApplicationStore
}

func NewApplicationController(appStore models.ApplicationStore) *ApplicationController {
	return &ApplicationController{appStore}
}

// TODO: Application Controller functions
