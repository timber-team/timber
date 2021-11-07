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
	Description  string        `json:"description"`
	AvatarURL    string        `json:"avatar_url,omitempty"`
	Tags         []Tag         `gorm:"many2many:user_tags" json:"tags,omitempty"`
	Projects     []*Project    `gorm:"many2many:user_project;" json:"projects,omitempty"`
	Applications []Application `json:"applications,omitempty"`
}

type Project struct {
	ID              int           `gorm:"primaryKey;autoIncrement;" json:"id"`
	CreatedAt       int64         `gorm:"autoCreateTime;<-:create" json:"created_at"`
	UpdatedAt       int64         `gorm:"autoUpdateTime;<-:create" json:"modified_at"`
	Name            string        `gorm:"unique" json:"name"`
	Description     string        `json:"description"`
	ImageURL        string        `json:"image_url,omitempty"`
	OwnerID         int           `gorm:"not null;<-:create" json:"owner_id"`
	Owner           User          `gorm:"foreignkey:OwnerID;association_foreignkey:ID" json:"owner,omitempty"`
	Collaborators   []*User       `gorm:"many2many:user_project;" json:"collaborators,omitempty"`
	PreferredSkills []Tag         `gorm:"many2many:project_preferred" json:"preferred_skills,omitempty"`
	RequiredSkills  []Tag         `gorm:"many2many:project_required" json:"required_skills,omitempty"`
	Applications    []Application `json:"applications,omitempty"`
	// Virtual fields
	OwnerUsername  string `gorm:"-" json:"owner_username,omitempty"`
	OwnerAvatarURL string `gorm:"-" json:"owner_avatar_url,omitempty"`
	UserApplied    bool   `gorm:"-" json:"user_applied,omitempty"`
}

type Application struct {
	ID        int   `gorm:"primaryKey;autoIncrement;" json:"id"`
	CreatedAt int64 `gorm:"autoCreateTime;<-:create" json:"created_at"`
	UpdatedAt int64 `gorm:"autoUpdateTime;<-:create" json:"modified_at"`
	UserID    int   `json:"user_id"`
	ProjectID int   `json:"project_id"`
}

type Tag struct {
	ID   int    `gorm:"primaryKey;autoIncrement;" json:"id"`
	Name string `gorm:"uniqueIndex" json:"name,omitempty"`
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
	SS  string    `json:"refresh_token"`
}

type AccessToken struct {
	SS string `json:"access_token"`
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
