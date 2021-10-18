package models

import (
	"time"

	"gorm.io/gorm"

	"github.com/gal/timber/database"
)

var db *gorm.DB

// InitModels migrates models and initiates database connection
func InitModels() {
	db = database.InitDB()

	db.Exec("CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";") // enable uuid generation on server
	db.AutoMigrate(&User{}, &UserAuth{}, &Project{}, &Application{})
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
	Hash    []byte
}

type Project struct {
	ID              string
	Name            string
	Owner           User
	PreferredSkills []string
	RequiredSkills  []string
	Applications    []Application
}

type Application struct {
	ID        string
	User      User
	Project   Project
	Timestamp time.Time
}

type GenericResponse struct {
	Detail string      `json:"detail,omitempty"`
	Msg    string      `json:"msg,omitempty"`
	Data   interface{} `json:"data,omitempty"`
	Code   int         `json:"code,omitempty"`
}

type LoginDetails struct {
	Username string
	Email    string
	Password string
}
