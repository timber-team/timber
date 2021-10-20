package models

import (
	"github.com/go-redis/redis/v8"
	"github.com/golang-jwt/jwt"
	"gorm.io/gorm"
)

type UserStore struct {
	db *gorm.DB
}

type AuthStore struct {
	db *gorm.DB
}

type ProjectStore struct {
	db *gorm.DB
}

type ApplicationStore struct {
	db *gorm.DB
}

type TokenStore struct {
	rdb *redis.Client
}

func NewUserStore(db *gorm.DB) *UserStore {
	return &UserStore{db}
}

func NewAuthStore(db *gorm.DB) *AuthStore {
	return &AuthStore{db}
}

func NewProjectStore(db *gorm.DB) *ProjectStore {
	return &ProjectStore{db}
}

func NewApplicationStore(db *gorm.DB) *ApplicationStore {
	return &ApplicationStore{db}
}

func NewTokenStore(rdb *redis.Client) *TokenStore {
	return &TokenStore{rdb}
}

// TODO: Remove all this commented stuff, struct's go to their own files
//// InitModels migrates models and initiates database connection
//func InitModels() {
//	db = database.InitDB()
// TODO: Add Exec and AutoMigrate to the data source initialisation
//	db.Exec("CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";") // enable uuid generation on server
//	db.AutoMigrate(&User{}, &UserAuth{}, &Project{}, &Application{})
//}
//
//type User struct {
//	ID          int      `gorm:"primaryKey;autoIncrement" json:"id,omitempty"`
//	Username    string   `json:"username,omitempty"`
//	Email       string   `json:"email,omitempty"`
//	Description string   `json:"description,omitempty"`
//	AvatarURL   string   `json:"avatar_url,omitempty"`
//	Tags        []string `json:"tags,omitempty"`
//	CreatedAt   int      `json:"created_at,omitempty"`
//	UpdatedAt   int      `json:"modified_at,omitempty"`
//}
//
//type UserAuth struct {
//	ID      int    `json:"id,omitempty"`
//	Email   string `json:"email,omitempty"`
//	Enabled bool   `json:"enabled,omitempty"`
//	Hash    []byte `json:"hash,omitempty"`
//}
//
//type Project struct {
//	ID              int           `gorm:"primaryKey;autoIncrement" json:"id,omitempty"`
//	Name            string        `json:"name,omitempty"`
//	Owner           User          `json:"owner,omitempty"`
//	PreferredSkills []string      `json:"preferred_skills,omitempty"`
//	RequiredSkills  []string      `json:"required_skills,omitempty"`
//	Applications    []Application `json:"applications,omitempty"`
//	CreatedAt       int           `json:"created_at,omitempty"`
//	UpdatedAt       int           `json:"modified_at,omitempty"`
//}
//
//type Application struct {
//	ID        int       `gorm:"primaryKey;autoIncrement" json:"id,omitempty"`
//	User      User      `json:"user,omitempty"`
//	Project   Project   `json:"project,omitempty"`
//	Timestamp time.Time `json:"timestamp,omitempty"`
//}
//
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

type TokenClaims struct {
	jwt.StandardClaims
	UID int    `json:"uid,omitempty"`
	Typ string `json:"typ,omitempty"`
}
