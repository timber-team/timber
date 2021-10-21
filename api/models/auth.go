package models

import "gorm.io/gorm"

type AuthStore struct {
	db *gorm.DB
}

func NewAuthStore(db *gorm.DB) *AuthStore {
	return &AuthStore{db}
}

func (as *AuthStore) Get(id int) error {
	return as.db.First(&UserAuth{}, "id = ?", id).Error
}

func (as *AuthStore) GetByEmail(email string) error {
	return as.db.Where("email = ?", email).First(&UserAuth{}).Error
}

func (as *AuthStore) Create(userAuth *UserAuth) error {
	as.Get(userAuth.ID)
	return as.db.Create(&userAuth).Error
}

func (as *AuthStore) Patch(userAuth *UserAuth) error {
	return as.db.Save(&userAuth).Error
}

func (as *AuthStore) Delete(userAuth *UserAuth) error {
	as.Get(userAuth.ID)
	return as.db.Delete(&userAuth).Error
}
