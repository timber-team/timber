package models

import (
	"errors"

	"github.com/gal/timber/utils/customerror"
	"gorm.io/gorm"
)

type UserStore struct {
	db *gorm.DB
}

func NewUserStore(db *gorm.DB) *UserStore {
	return &UserStore{db}
}

func (userStore *UserStore) FindByID(user *User) error {
	return userStore.db.First(&user, "id = ?", user.ID).Error
}

func (userStore *UserStore) FindByEmail(user *User) error {
	return userStore.db.First(user, "email = ?", user.Email).Error
}

func (userStore *UserStore) Create(user *User) error {
	err := userStore.FindByEmail(user)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return userStore.db.Create(user).Error
		} else {
			return err
		}
	}
	return customerror.NewConflict("email", user.Email)
}

func (userStore *UserStore) Patch(user *User) error {
	return userStore.db.Save(user).Error
}

func (userStore *UserStore) Delete(user *User) error {
	if err := userStore.FindByID(user); err != nil {
		return err
	}
	return userStore.db.Delete(user).Error
}
