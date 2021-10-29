package models

import (
	"context"

	"gorm.io/gorm"
)

type UserStore struct {
	db *gorm.DB
}

func NewUserStore(db *gorm.DB) *UserStore {
	return &UserStore{db}
}

func (userStore *UserStore) Get(ctx context.Context, user *User) error {
	return userStore.db.WithContext(ctx).Preload("Projects").Preload("Applications").Omit("Projects.Collaborators").First(&user).Error
}

func (userStore *UserStore) GetByEmail(ctx context.Context, email string) (*User, error) {
	var user *User
	err := userStore.db.WithContext(ctx).Preload("Projects").Preload("Applications").Omit("Projects.Collaborators").First(&user, "email = ?", email).Error
	return user, err
}

func (userStore *UserStore) Create(ctx context.Context, user *User) error {
	return userStore.db.WithContext(ctx).Create(&user).Error
}

func (userStore *UserStore) Patch(ctx context.Context, user *User) error {
	return userStore.db.WithContext(ctx).Save(&user).Error
}

func (userStore *UserStore) Delete(ctx context.Context, user *User) error {
	userStore.Get(ctx, user)
	return userStore.db.WithContext(ctx).Delete(user).Error
}
