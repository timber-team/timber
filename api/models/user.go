package models

import "gorm.io/gorm"

type UserStore struct {
	db *gorm.DB
}

func NewUserStore(db *gorm.DB) *UserStore {
	return &UserStore{db}
}

func (us *UserStore) Get(id int) error {
	return us.db.First(&User{}, "id = ?", id).Error
}

func (us *UserStore) GetByEmail(email string) error {
	return us.db.Where(&User{}, "email = ?", email).Error
}

func (us *UserStore) Create(user *User) error {
	return us.db.Create(user).Error
}

func (us *UserStore) Patch(user *User) error {
	return us.db.Save(user).Error
}

func (us *UserStore) Delete(user *User) error {
	us.Get(user.ID)
	return us.db.Delete(user).Error
}