package models

import (
	"time"

	"gorm.io/gorm"
)

type ApplicationStore struct {
	db *gorm.DB
}

func NewApplicationStore(db *gorm.DB) *ApplicationStore {
	return &ApplicationStore{db}
}

func (appStore *ApplicationStore) Get(id int) error {
	return appStore.db.First(&Application{}, "id = ?", id).Error
}

func (appStore *ApplicationStore) Create(app *Application) error {
	app.Timestamp = time.Now().Unix()
	return appStore.db.Create(&app).Error
}

func (appStore *ApplicationStore) Delete(app *Application) error {
	appStore.Get(app.ID)
	return appStore.db.Delete(&app).Error
}
