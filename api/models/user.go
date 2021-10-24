package models

import (
	"context"
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

func (userStore *UserStore) CheckExistsByID(id int) error {
	return userStore.db.First(&User{}, "id = ?", id).Error
}

func (userStore *UserStore) CheckExistsByEmail(email string) error {
	return userStore.db.First(&User{}, "email = ?", email).Error
}

func (userStore *UserStore) FindByID(id int) (*User, error) {
	user := &User{}
	if err := userStore.db.First(user, "id = ?", id); err != nil {
		return user, err.Error
	}
	return user, nil
}

func (userStore *UserStore) FindByEmail(email string) (*User, error) {
	user := &User{}
	if err := userStore.db.First(user, "email = ?", email); err != nil {
		return user, err.Error
	}
	return user, nil
}

func (userStore *UserStore) Create(ctx context.Context, user *User) error {
	err := userStore.CheckExistsByEmail(user.Email)
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

// TODO:
func (userStore *UserStore) Delete(user *User) error {
	//userStore.Get(user.ID)
	return userStore.db.Delete(user).Error
}
