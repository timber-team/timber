package models

func (u *UserAuth) Get() error {
	return db.First(&u, "id = ?", u.ID).Error
}

func (u *UserAuth) GetByEmail() error {
	return db.Where("email = ?", u.Email).First(&u).Error
}

func (u *UserAuth) Create() error {
	u.Get()
	return db.Create(&u).Error
}

func (u *UserAuth) Patch() error {
	return db.Save(&u).Error
}

func (u *UserAuth) Delete() error {
	u.Get()
	return db.Delete(&u).Error
}
