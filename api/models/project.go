package models

import (
	"context"

	"gorm.io/gorm"
)

type ProjectStore struct {
	db *gorm.DB
}

func NewProjectStore(db *gorm.DB) *ProjectStore {
	return &ProjectStore{db}
}

func (projectStore *ProjectStore) Create(ctx context.Context, project *Project) error {
	return projectStore.db.WithContext(ctx).Create(&project).Error
}

func (projectStore *ProjectStore) Get(ctx context.Context, project *Project) error {
	return projectStore.db.WithContext(ctx).Preload("Collaborators").Preload("Applications").Preload("PreferredSkills").Preload("RequiredSkills").Preload("Owner").Preload("Collaborators.Projects").Preload("Collaborators.Tags").Preload("Owner.Projects").Preload("Owner.Tags").First(&project).Error
}

// get all projects
func (projectStore *ProjectStore) GetAll(ctx context.Context) ([]*Project, error) {
	var projects []*Project
	err := projectStore.db.WithContext(ctx).Preload("Collaborators").Preload("Applications").Preload("PreferredSkills").Preload("RequiredSkills").Preload("Owner").Preload("Collaborators.Projects").Preload("Collaborators.Tags").Preload("Owner.Projects").Preload("Owner.Tags").Find(&projects).Error
	return projects, err
}

func (projectStore *ProjectStore) GetByOwnerID(ctx context.Context, ownerID int) ([]*Project, error) {
	var projects []*Project
	err := projectStore.db.WithContext(ctx).Preload("Collaborators").Preload("Applications").Preload("PreferredSkills").Preload("RequiredSkills").Preload("Owner").Preload("Collaborators.Projects").Preload("Collaborators.Tags").Preload("Owner.Projects").Preload("Owner.Tags").Where("owner_id = ?", ownerID).Find(&projects).Error
	return projects, err
}

func (projectStore *ProjectStore) GetByPopularity(ctx context.Context) ([]*Project, error) {
	var projects []*Project
	if err := projectStore.db.WithContext(ctx).Preload("Collaborators").Preload("Applications").
		Preload("PreferredSkills").Preload("RequiredSkills").Preload("Owner").Preload("Collaborators.Projects").Preload("Collaborators.Tags").Preload("Owner.Projects").
		Preload("Owner.Tags").Order("(SELECT count(*) FROM applications WHERE applications.project_id = projects.id) DESC").Limit(10).Find(&projects).Error; err != nil {
		return nil, err
	}
	return projects, nil
}

func (projectStore *ProjectStore) GetRecommended(ctx context.Context, user *User) ([]*Project, error) {
	var projects []*Project
	var err error
	if err = projectStore.db.WithContext(ctx).Preload("Collaborators").Preload("Applications").Preload("PreferredSkills").Preload("RequiredSkills").Preload("Owner").Omit("Collaborators.Projects").Omit("Owner.Projects").Find(&projects).Error; err != nil {
		return nil, err
	}
	var recommendedProjects []*Project
	for _, project := range projects {
		for _, tag := range user.Tags {
			for _, requiredSkill := range project.RequiredSkills {
				if requiredSkill.ID == tag.ID {
					recommendedProjects = append(recommendedProjects, project)
				}
			}
		}
	}
	// Sort recommendedProjects by number of applications
	for i := 0; i < len(recommendedProjects)-1; i++ {
		for j := i + 1; j < len(recommendedProjects); j++ {
			if len(recommendedProjects[i].Applications) < len(recommendedProjects[j].Applications) {
				recommendedProjects[i], recommendedProjects[j] = recommendedProjects[j], recommendedProjects[i]
			}
		}
	}
	return recommendedProjects, nil
}

func (projectStore *ProjectStore) Update(ctx context.Context, project *Project) error {
	return projectStore.db.WithContext(ctx).Save(&project).Error
}

func (projectStore *ProjectStore) Delete(ctx context.Context, project *Project) error {
	return projectStore.db.WithContext(ctx).Delete(&project).Error
}
