package models

import (
	"gorm.io/gorm"

	"github.com/gal/timber/database"
)

var db *gorm.DB

// InitModels migrates models and initiates database connection
func InitModels() {
	db = database.InitDB()

	db.Exec("CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";") // enable uuid generation on server
	db.AutoMigrate(&User{}, &UserAuth{}, &Project{}, &Applications{})
}

type User struct {
	ID          string
	Username    string
	Email       string
	Description string
	AvatarURL   string
	Tags        []string
}

type UserAuth struct {
	ID      string
	Email   string
	Enabled bool
	Hash    string
}

type Project struct {
	ID              string
	Name            string
	Owner           User
	PreferredSkills []string
	RequiredSkills  []string
}

type Applications struct {
	Project    Project
	Applicants []User
}
