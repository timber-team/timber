package models

func (proj *Project) Get() error {
	return db.First(&proj, "id = ?", proj.ID).Error
}

func (proj *Project) Create() error {
	return db.Create(&proj).Error
}

func (proj *Project) Patch() error {
	return db.Save(&proj).Error
}

func (proj *Project) Delete() error {
	proj.Get()
	return db.Delete(&proj).Error
}
