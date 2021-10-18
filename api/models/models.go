package models

import (
	"gorm.io/gorm"

	"github.com/gal/timber/database"
)

var db *gorm.DB

// InitModels migrates modesls and initiates database connection
func InitModels() {
	db = database.InitDB()

	db.Exec("CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";") // enable uuid generation on server
	db.AutoMigrate(&User{}, &UserAuth{}, &Project{})
}

type User struct {
}

type UserAuth struct {
}

type Project struct {
}
