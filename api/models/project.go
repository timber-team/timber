package models

import (
	"errors"

	"github.com/gal/timber/utils/customerror"
	"gorm.io/gorm"
)

type ProjectStore struct {
	db *gorm.DB
}

func NewProjectStore(db *gorm.DB) *ProjectStore {
	return &ProjectStore{db}
}

func (projectStore *ProjectStore) CheckExistsByID(id int) error {
	return projectStore.db.First(&Project{}, "id = ?", id).Error
}

func (projectStore *ProjectStore) CheckExistsByName(name string) error {
	return projectStore.db.First(&Project{}, "name = ?", name).Error
}

func (projectStore *ProjectStore) Get(id int) error {
	return projectStore.db.First(&Project{}, "id = ?", id).Error
}

func (projectStore *ProjectStore) Create(project *Project) error {
	err := projectStore.CheckExistsByName(project.Name)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return projectStore.db.Create(project).Error
		} else {
			return err
		}
	}
	return customerror.NewConflict("name", project.Name)
}

func (projectStore *ProjectStore) Patch(project *Project) error {
	return projectStore.db.Save(&project).Error
}

func (projectStore *ProjectStore) Delete(project *Project) error {
	projectStore.Get(project.ID)
	return projectStore.db.Delete(&project).Error
}
