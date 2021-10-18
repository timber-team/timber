package models

import "time"

func (app *Application) Get() error {
	return db.First(&app, "id = ?", app.ID).Error
}

func (app *Application) Create() error {
	app.Timestamp = time.Now()
	return db.Create(&app).Error
}

func (app *Application) Delete() error {
	app.Get()
	return db.Delete(&app).Error
}
