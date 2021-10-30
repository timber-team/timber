package models

import (
	"github.com/google/uuid"
)

type User struct {
	ID           int           `gorm:"primaryKey;autoIncrement;" json:"id"`
	CreatedAt    int64         `gorm:"autoCreateTime;<-:create" json:"created_at"`
	UpdatedAt    int64         `gorm:"autoUpdateTime;<-:create" json:"modified_at"`
	Username     string        `json:"username"`
	Email        string        `gorm:"unique" json:"email"`
	Password     string        `json:"-"`
	Verified     bool          `gorm:"default:false" json:"verified"`
	Description  string        `json:"description"`
	AvatarURL    string        `json:"avatar_url"`
	Tags         []string      `gorm:"type:text[]" json:"tags"`
	Projects     []*Project    `gorm:"many2many:user_project;" json:"projects,omitempty"`
	Applications []Application `json:"applications,omitempty"`
}

type Project struct {
	ID              int           `gorm:"primaryKey;autoIncrement;" json:"id"`
	CreatedAt       int64         `gorm:"autoCreateTime;<-:create" json:"created_at"`
	UpdatedAt       int64         `gorm:"autoUpdateTime;<-:create" json:"modified_at"`
	Name            string        `gorm:"unique" json:"name"`
	Description     string        `json:"description"`
	OwnerID         int           `gorm:"not null;<-:create" json:"owner_id"`
	Collaborators   []*User       `gorm:"many2many:user_project;" json:"collaborators,omitempty"`
	PreferredSkills []string      `gorm:"type:text[]" json:"preferred_skills"`
	RequiredSkills  []string      `gorm:"type:text[]" json:"required_skills"`
	Applications    []Application `json:"applications,omitempty"`
}

type Application struct {
	ID        int   `gorm:"primaryKey;autoIncrement;" json:"id"`
	CreatedAt int64 `gorm:"autoCreateTime;<-:create" json:"created_at"`
	UpdatedAt int64 `gorm:"autoUpdateTime;<-:create" json:"modified_at"`
	UserID    int   `json:"user_id"`
	ProjectID int   `json:"project_id"`
}

type Tag struct {
	ID   int    `gorm:"primaryKey;autoIncrement;" json:"id,omitempty"`
	Name string `json:"name,omitempty"`
}

type GenericResponse struct {
	Detail string      `json:"detail"`
	Msg    string      `json:"msg"`
	Data   interface{} `json:"data"`
	Code   int         `json:"code"`
}

type RefreshToken struct {
	ID  uuid.UUID `json:"-"`
	UID int       `json:"-"`
	SS  string    `json:"refreshToken"`
}

type AccessToken struct {
	SS string `json:"accessToken"`
}

type TokenPair struct {
	AccessToken
	RefreshToken
}

type GithubEmail struct {
	Email      string `json:"email"`
	Primary    bool   `json:"primary"`
	Verified   bool   `json:"verified"`
	Visibility string `json:"visibility"`
}
