package models

import "gorm.io/gorm"

type UserStore struct {
	db *gorm.DB
}

func NewUserStore(db *gorm.DB) *UserStore {
	return &UserStore{db}
}

func (userStore *UserStore) Get(id int) error {
	return userStore.db.First(&User{}, "id = ?", id).Error
}

func (userStore *UserStore) GetByEmail(email string) error {
	return userStore.db.Where(&User{}, "email = ?", email).Error
}

func (userStore *UserStore) Create(user *User) error {
	return userStore.db.Create(user).Error
}

func (userStore *UserStore) Patch(user *User) error {
	return userStore.db.Save(user).Error
}

func (userStore *UserStore) Delete(user *User) error {
	userStore.Get(user.ID)
	return userStore.db.Delete(user).Error
}
