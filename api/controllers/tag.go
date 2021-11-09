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

func (tagControl *TagController) Get(ctx context.Context, tag *models.Tag) error {
	return tagControl.Tags.Get(ctx, tag)
}

func (tagControl *TagController) Create(ctx context.Context, tag *models.Tag) error {
	return tagControl.Tags.Create(ctx, tag)
}

func (tagControl *TagController) Update(ctx context.Context, tag *models.Tag) error {
	return tagControl.Tags.Update(ctx, tag)
}
