package models

import (
	"github.com/google/uuid"
)

type User struct {
	ID           int           `gorm:"primaryKey;autoIncrement;->" json:"id"`
	CreatedAt    int64         `gorm:"autoCreateTime;<-:create" json:"created_at,omitempty"`
	UpdatedAt    int64         `gorm:"autoUpdateTime;<-:create" json:"modified_at,omitempty"`
	Username     string        `json:"username,omitempty"`
	Email        string        `json:"email,omitempty"`
	Password     string        `json:"-"`
	Verified     bool          `gorm:"default:false" json:"verified"`
	Description  string        `json:"description"`
	AvatarURL    string        `json:"avatar_url"`
	Tags         []string      `gorm:"type:text[]" json:"tags"`
	Projects     []*Project    `gorm:"many2many:user_projects" json:"projects"`
	Applications []Application `json:"applications"`
}

// TODO: Pretty sure we don't need this anymore because we can just exclude fields on the main user
//type UserAuth struct {
//	ID      int    `json:"id,omitempty"`
//	Email   string `json:"email,omitempty"`
//	Enabled bool   `json:"enabled,omitempty"`
//	Hash    []byte `json:"hash,omitempty"`
//}

type Project struct {
	ID              int           `gorm:"primaryKey;autoIncrement;->" json:"id,omitempty"`
	CreatedAt       int64         `gorm:"autoCreateTime;<-:create" json:"created_at,omitempty"`
	UpdatedAt       int64         `gorm:"autoUpdateTime;<-:create" json:"modified_at,omitempty"`
	Name            string        `json:"name,omitempty"`
	OwnerID         int           `json:"owner_id,omitempty"`
	Collaborators   []*User       `gorm:"many2many:user_projects"`
	PreferredSkills []string      `gorm:"type:text[]" json:"preferred_skills,omitempty"`
	RequiredSkills  []string      `gorm:"type:text[]" json:"required_skills,omitempty"`
	Applications    []Application `json:"applications,omitempty"`
}

type Application struct {
	ID        int   `gorm:"primaryKey;autoIncrement;->" json:"id,omitempty"`
	CreatedAt int64 `gorm:"autoCreateTime;<-:create" json:"created_at,omitempty"`
	UpdatedAt int64 `gorm:"autoUpdateTime;<-:create" json:"modified_at,omitempty"`
	UserID    int   `json:"user_id,omitempty"`
	ProjectID int   `json:"project_id,omitempty"`
	Timestamp int64 `gorm:"type:time" json:"timestamp,omitempty"`
}

type GenericResponse struct {
	Detail string      `json:"detail,omitempty"`
	Msg    string      `json:"msg,omitempty"`
	Data   interface{} `json:"data,omitempty"`
	Code   int         `json:"code,omitempty"`
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
