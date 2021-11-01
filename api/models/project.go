package models

import (
	"golang.org/x/net/context"
	"gorm.io/gorm"
)

type ProjectStore struct {
	db *gorm.DB
}

func NewProjectStore(db *gorm.DB) *ProjectStore {
	return &ProjectStore{db}
}

func (projectStore *ProjectStore) Get(ctx context.Context, project *Project) error {
	return projectStore.db.WithContext(ctx).Preload("Collaborators").Preload("Applications").Preload("PreferredSkills").Preload("RequiredSkills").Omit("Collaborators.Projects").First(&project).Error
}

func (projectStore *ProjectStore) GetAll(ctx context.Context, projects []*Project) error {
	for _, proj := range projects {
		if err := projectStore.Get(ctx, proj); err != nil {
			return err
		}
	}
	return nil
}

func (projectStore *ProjectStore) Create(ctx context.Context, project *Project) error {
	return projectStore.db.WithContext(ctx).Create(&project).Error
}

func (projectStore *ProjectStore) Patch(ctx context.Context, project *Project) error {
	return projectStore.db.WithContext(ctx).Save(&project).Error
}

func (projectStore *ProjectStore) Delete(ctx context.Context, project *Project) error {
	projectStore.Get(ctx, project)
	return projectStore.db.WithContext(ctx).Delete(&project).Error
}
