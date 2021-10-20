package models

// TODO: Move methods to userStore
//func (u *User) Get() error {
//	return db.First(&u, "id = ?", u.ID).Error
//}
//
//func (u *User) GetByEmail() error {
//	return db.Where(&u, "email = ?", u.Email).Error
//}
//
//func (u *User) Create() error {
//	return db.Create(&u).Error
//}
//
//func (u *User) Patch() error {
//	return db.Save(&u).Error
//}
//
//func (u *User) Delete() error {
//	u.Get()
//	return db.Delete(&u).Error
//}

type User struct {
	ID          int      `gorm:"primaryKey;autoIncrement" json:"id,omitempty"`
	Username    string   `json:"username,omitempty"`
	Email       string   `json:"email,omitempty"`
	Description string   `json:"description,omitempty"`
	AvatarURL   string   `json:"avatar_url,omitempty"`
	Tags        []string `json:"tags,omitempty"`
	CreatedAt   int      `json:"created_at,omitempty"`
	UpdatedAt   int      `json:"modified_at,omitempty"`
}
