package models

import (
	"context"

	"gorm.io/gorm"
)

type ApplicationStore struct {
	db *gorm.DB
}

func NewApplicationStore(db *gorm.DB) *ApplicationStore {
	return &ApplicationStore{db}
}

func (appStore *ApplicationStore) Get(ctx context.Context, app *Application) error {
	return appStore.db.WithContext(ctx).First(&app).Error
}

func (appStore *ApplicationStore) Create(ctx context.Context, app *Application) error {
	return appStore.db.WithContext(ctx).Create(&app).Error
}

func (appStore *ApplicationStore) Patch(ctx context.Context, app *Application) error {
	return appStore.db.WithContext(ctx).Save(&app).Error
}

func (appStore *ApplicationStore) Delete(ctx context.Context, app *Application) error {
	appStore.Get(ctx, app)
	return appStore.db.WithContext(ctx).Delete(&app).Error
}
