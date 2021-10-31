package controllers

import (
	"context"

	"github.com/gal/timber/models"
)

type TagController struct {
	Tags models.TagStore
}

func NewTagController(tagStore models.TagStore) *TagController {
	return &TagController{tagStore}
}

func (tagControl *TagController) Get(ctx context.Context, a *models.Tag) error {
	return tagControl.Tags.Get(ctx, a)
}

func (tagControl *TagController) Create(ctx context.Context, a *models.Tag) error {
	return tagControl.Tags.Create(ctx, a)
}

func (tagControl *TagController) Update(ctx context.Context, a *models.Tag) error {
	return tagControl.Tags.Patch(ctx, a)
}
