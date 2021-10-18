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
	ID          string   `gorm:"primaryKey;type:string;default:uuid_generate_v4()" json:"id,omitempty"`
	Username    string   `json:"username,omitempty"`
	Email       string   `json:"email,omitempty"`
	Description string   `json:"description,omitempty"`
	AvatarURL   string   `json:"avatar_url,omitempty"`
	Tags        []string `json:"tags,omitempty"`
}

type UserAuth struct {
	ID      string `json:"id,omitempty"`
	Email   string `json:"email,omitempty"`
	Enabled bool   `json:"enabled,omitempty"`
	Hash    []byte `json:"hash,omitempty"`
}

type Project struct {
	ID              string        `gorm:"primaryKey;type:string;default:uuid_generate_v4()" json:"id,omitempty"`
	Name            string        `json:"name,omitempty"`
	Owner           User          `json:"owner,omitempty"`
	PreferredSkills []string      `json:"preferred_skills,omitempty"`
	RequiredSkills  []string      `json:"required_skills,omitempty"`
	Applications    []Application `json:"applications,omitempty"`
}

type Application struct {
	ID        string    `gorm:"primaryKey;type:string;default:uuid_generate_v4()" json:"id,omitempty"`
	User      User      `json:"user,omitempty"`
	Project   Project   `json:"project,omitempty"`
	Timestamp time.Time `json:"timestamp,omitempty"`
}

type GenericResponse struct {
	Detail string      `json:"detail,omitempty"`
	Msg    string      `json:"msg,omitempty"`
	Data   interface{} `json:"data,omitempty"`
	Code   int         `json:"code,omitempty"`
}

type LoginDetails struct {
	Username string `json:"username,omitempty"`
	Email    string `json:"email,omitempty"`
	Password string `json:"password,omitempty"`
}
