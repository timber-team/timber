package models

import (
	"context"
	"errors"

	"github.com/gal/timber/utils/customresponse"
	"gorm.io/gorm"
)

type UserStore struct {
	db *gorm.DB
}

func NewUserStore(db *gorm.DB) *UserStore {
	return &UserStore{db}
}

func (userStore *UserStore) Get(ctx context.Context, user *User) error {
	return userStore.db.WithContext(ctx).Preload("Projects").Preload("Applications").Preload("Tags").Omit("Projects.Collaborators").Omit("Projects.Owner").First(&user).Error
}

func (userStore *UserStore) GetByEmail(ctx context.Context, email string) (*User, error) {
	var user *User
	err := userStore.db.WithContext(ctx).Preload("Projects").Preload("Applications").Preload("Tags").Omit("Projects.Collaborators").Omit("Projects.Owner").First(&user, "email = ?", email).Error
	return user, err
}

// GetByID returns a user by id
func (userStore *UserStore) GetByID(ctx context.Context, id int) (*User, error) {
	var user *User
	err := userStore.db.WithContext(ctx).Preload("Projects").Preload("Applications").Preload("Tags").Omit("Projects.Collaborators").Omit("Projects.Owner").First(&user, "id = ?", id).Error
	return user, err
}

func (userStore *UserStore) CheckExistsByEmail(ctx context.Context, user *User) error {
	return userStore.db.WithContext(ctx).Preload("Projects").Preload("Applications").Preload("Tags").Omit("Projects.Collaborators").Omit("Projects.Owner").First(&user, "email = ?", user.Email).Error
}

func (userStore *UserStore) Create(ctx context.Context, user *User) error {
	_, err := userStore.GetByEmail(ctx, user.Email)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return userStore.db.WithContext(ctx).Create(&user).Error
		} else {
			return err
		}
	}
	return customresponse.NewConflict("email", user.Email)
}

func (userStore *UserStore) Patch(ctx context.Context, user *User) error {
	return userStore.db.WithContext(ctx).Save(&user).Error
}

func (userStore *UserStore) Delete(ctx context.Context, user *User) error {
	userStore.Get(ctx, user)
	return userStore.db.WithContext(ctx).Delete(user).Error
}

func (userStore *UserStore) GetAll(ctx context.Context) ([]User, error) {
	var users []User
	err := userStore.db.WithContext(ctx).Preload("Projects").Preload("Applications").Preload("Tags").Omit("Projects.Collaborators").Omit("Projects.Owner").Find(&users).Error
	return users, err
}
