package models

// TODO: Move methods to projectStore
// func (proj *Project) Get() error {
// 	return db.First(&proj, "id = ?", proj.ID).Error
// }

// func (proj *Project) Create() error {
// 	return db.Create(&proj).Error
// }

// func (proj *Project) Patch() error {
// 	return db.Save(&proj).Error
// }

// func (proj *Project) Delete() error {
// 	proj.Get()
// 	return db.Delete(&proj).Error
// }

type Project struct {
	ID              int           `gorm:"primaryKey;autoIncrement" json:"id,omitempty"`
	Name            string        `json:"name,omitempty"`
	Owner           User          `json:"owner,omitempty"`
	PreferredSkills []string      `json:"preferred_skills,omitempty"`
	RequiredSkills  []string      `json:"required_skills,omitempty"`
	Applications    []Application `json:"applications,omitempty"`
	CreatedAt       int           `json:"created_at,omitempty"`
	UpdatedAt       int           `json:"modified_at,omitempty"`
}
