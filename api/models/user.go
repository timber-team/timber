package models

func (u *User) Get() error {
	return db.First(&u, "id = ?", u.ID).Error
}

func (u *User) GetByEmail() error {
	return db.Where(&u, "email = ?", u.Email).Error
}

func (u *User) Create() error {
	return db.Create(&u).Error
}

func (u *User) Patch() error {
	return db.Save(&u).Error
}

func (u *User) Delete() error {
	u.Get()
	return db.Delete(&u).Error
}
