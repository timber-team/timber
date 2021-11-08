package controllers

import (
	"context"

	"github.com/gal/timber/models"
)

type ApplicationController struct {
	Applications models.ApplicationStore
}

func NewApplicationController(appStore models.ApplicationStore) *ApplicationController {
	return &ApplicationController{appStore}
}

func (appControl *ApplicationController) Create(ctx context.Context, a *models.Application) error {
	return appControl.Applications.Create(ctx, a)
}

func (appControl *ApplicationController) Get(ctx context.Context, a *models.Application) error {
	return appControl.Applications.Get(ctx, a)
}

func (appControl *ApplicationController) GetByProjectID(ctx context.Context, projectID int) ([]*models.Application, error) {
	return appControl.Applications.GetByProjectID(ctx, projectID)
}

func (appControl *ApplicationController) GetByUserID(ctx context.Context, userID int) ([]*models.Application, error) {
	return appControl.Applications.GetByUserID(ctx, userID)
}

func (appControl *ApplicationController) Update(ctx context.Context, a *models.Application) error {
	return appControl.Applications.Update(ctx, a)
}

func (appControl *ApplicationController) Delete(ctx context.Context, a *models.Application) error {
	return appControl.Applications.Delete(ctx, a)
}
