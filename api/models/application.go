package models

import (
	"gorm.io/gorm"
)
type ApplicationStore struct {
	db *gorm.DB
}

func NewApplicationStore(db *gorm.DB) *ApplicationStore {
	return &ApplicationStore{db}
}

// TODO: Move methods to be applicationStore (see user.go)
//func (app *Application) Get() error {
//	return db.First(&app, "id = ?", app.ID).Error
//}
//
//func (app *Application) Create() error {
//	app.Timestamp = time.Now()
//	return db.Create(&app).Error
//}
//
//func (app *Application) Delete() error {
//	app.Get()
//	return db.Delete(&app).Error
//}


