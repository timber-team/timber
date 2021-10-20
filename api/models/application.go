package models

import "time"

// TODO: Move methods to applicationStore
// func (app *Application) Get() error {
// 	return db.First(&app, "id = ?", app.ID).Error
// }

// func (app *Application) Create() error {
// 	app.Timestamp = time.Now()
// 	return db.Create(&app).Error
// }

// func (app *Application) Delete() error {
// 	app.Get()
// 	return db.Delete(&app).Error
// }

type Application struct {
	ID        int       `gorm:"primaryKey;autoIncrement" json:"id,omitempty"`
	User      User      `json:"user,omitempty"`
	Project   Project   `json:"project,omitempty"`
	Timestamp time.Time `json:"timestamp,omitempty"`
}
