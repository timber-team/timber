package models

import "gorm.io/gorm"

type ProjectStore struct {
	db *gorm.DB
}

func NewProjectStore(db *gorm.DB) *ProjectStore {
	return &ProjectStore{db}
}

func (projStore *ProjectStore) Get(id int) error {
	return projStore.db.First(&Project{}, "id = ?", id).Error
}

func (projStore *ProjectStore) Create(project *Project) error {
	return projStore.db.Create(&project).Error
}

func (projStore *ProjectStore) Patch(project *Project) error {
	return projStore.db.Save(&project).Error
}

func (projStore *ProjectStore) Delete(project *Project) error {
	projStore.Get(project.ID)
	return projStore.db.Delete(&project).Error
}
