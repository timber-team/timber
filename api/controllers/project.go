package controllers

import (
	"context"

	"github.com/gal/timber/models"
)

type ProjectController struct {
	Projects models.ProjectStore
}

func NewProjectController(pStore models.ProjectStore) *ProjectController {
	return &ProjectController{pStore}
}

func (projectControl *ProjectController) Get(ctx context.Context, p *models.Project) error {
	return projectControl.Projects.Get(ctx, p)
}

func (projectControl *ProjectController) Create(ctx context.Context, p *models.Project) error {
	return projectControl.Projects.Create(ctx, p)
}

func (projectControl *ProjectController) Update(ctx context.Context, p *models.Project) error {
	return projectControl.Projects.Patch(ctx, p)
}
