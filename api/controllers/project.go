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

func (projectControl *ProjectController) GetAll(ctx context.Context) ([]*models.Project, error) {
	return projectControl.Projects.GetAll(ctx)
}

func (projectControl *ProjectController) Create(ctx context.Context, p *models.Project) error {
	return projectControl.Projects.Create(ctx, p)
}

func (projectControl *ProjectController) Update(ctx context.Context, p *models.Project) error {
	return projectControl.Projects.Update(ctx, p)
}

func (projectControl *ProjectController) Delete(ctx context.Context, p *models.Project) error {
	return projectControl.Projects.Delete(ctx, p)
}

// Function called GetTrending that takes in a context, and returns a slice of projects ordered by how many users have applied to the project
func (projectControl *ProjectController) GetByPopularity(ctx context.Context) ([]*models.Project, error) {
	return projectControl.Projects.GetByPopularity(ctx)
}

// Function called GetRecommended that takes in a context, and a user, and returns a slice of projects ordered by how many tags are shared between the projects RequiredSkills and the users Tags
func (projectControl *ProjectController) GetRecommended(ctx context.Context, u *models.User) ([]*models.Project, error) {
	return projectControl.Projects.GetRecommended(ctx, u)
}
