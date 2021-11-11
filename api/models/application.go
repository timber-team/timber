package models

import (
	"context"
	"fmt"

	"github.com/gal/timber/utils/customresponse"
	"gorm.io/gorm"
)

type ApplicationStore struct {
	db *gorm.DB
}

func NewApplicationStore(db *gorm.DB) *ApplicationStore {
	return &ApplicationStore{db}
}

func (appStore *ApplicationStore) Create(ctx context.Context, app *Application) error {
	var existingApp Application
	if err := appStore.db.WithContext(ctx).Where("user_id = ? AND project_id = ?", app.UserID, app.ProjectID).First(&existingApp).Error; err != nil {
		app.ID = 0
		return appStore.db.WithContext(ctx).Create(&app).Error
	}
	return customresponse.NewConflict("Application already exists", fmt.Sprintf("userID: %d, projectID: %d", app.UserID, app.ProjectID))
}

func (appStore *ApplicationStore) Get(ctx context.Context, app *Application) error {
	return appStore.db.WithContext(ctx).First(&app).Error
}

func (appStore *ApplicationStore) GetByProjectID(ctx context.Context, projectID int) ([]*Application, error) {
	var apps []*Application
	if err := appStore.db.WithContext(ctx).Where("project_id = ?", projectID).Find(&apps).Error; err != nil {
		return nil, err
	}
	return apps, nil
}

func (appStore *ApplicationStore) GetByUserID(ctx context.Context, userID int) ([]*Application, error) {
	var apps []*Application
	if err := appStore.db.WithContext(ctx).Where("user_id = ?", userID).Find(&apps).Error; err != nil {
		return nil, err
	}
	return apps, nil
}

func (appStore *ApplicationStore) Update(ctx context.Context, app *Application) error {
	return appStore.db.WithContext(ctx).Save(&app).Error
}

func (appStore *ApplicationStore) Delete(ctx context.Context, app *Application) error {
	return appStore.db.WithContext(ctx).Delete(&app).Error
}
