package models

import "gorm.io/gorm"

type AuthStore struct {
	db *gorm.DB
}

func NewAuthStore(db *gorm.DB) *AuthStore {
	return &AuthStore{db}
}

func (authStore *AuthStore) Get(id int) error {
	return authStore.db.First(&UserAuth{}, "id = ?", id).Error
}

func (authStore *AuthStore) GetByEmail(email string) error {
	return authStore.db.Where("email = ?", email).First(&UserAuth{}).Error
}

func (authStore *AuthStore) Create(userAuth *UserAuth) error {
	authStore.Get(userAuth.ID)
	return authStore.db.Create(&userAuth).Error
}

func (authStore *AuthStore) Patch(userAuth *UserAuth) error {
	return authStore.db.Save(&userAuth).Error
}

func (authStore *AuthStore) Delete(userAuth *UserAuth) error {
	authStore.Get(userAuth.ID)
	return authStore.db.Delete(&userAuth).Error
}
