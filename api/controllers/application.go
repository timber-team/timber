package controllers

import "github.com/gal/timber/models"

type ApplicationHandler struct {
	Applications models.ApplicationStore
}

func NewApplicationHandler(appStore models.ApplicationStore) *ApplicationHandler {
	return &ApplicationHandler{appStore}
}
// TODO: Application handler functions
