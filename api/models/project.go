package models

import (
	"context"
	"sort"

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
	err := projectStore.db.WithContext(ctx).Preload("Collaborators").Preload("Applications").Preload("PreferredSkills").Preload("RequiredSkills").Preload("Owner").Preload("Collaborators.Projects").Preload("Collaborators.Tags").Preload("Owner.Projects").Preload("Owner.Tags").Find(&projects).Error
	if err != nil {
		return nil, err
	}

	projectScores := make(map[int]int)

	userTags := user.Tags

	for _, project := range projects {
		projectScores[project.ID] = 0
		for _, tag := range project.PreferredSkills {
			for _, userTag := range userTags {
				if tag.ID == userTag.ID {
					projectScores[project.ID] += 1
				}
			}
		}
		for _, tag := range project.RequiredSkills {
			for _, userTag := range userTags {
				if tag.ID == userTag.ID {
					projectScores[project.ID] += 1
				}
			}
		}
	}

	var sortedProjects []*Project
	for _, project := range projects {
		sortedProjects = append(sortedProjects, project)
	}
	sort.Slice(sortedProjects, func(i, j int) bool {
		return projectScores[sortedProjects[i].ID] > projectScores[sortedProjects[j].ID]
	})

	return sortedProjects, nil
}

func (projectStore *ProjectStore) Update(ctx context.Context, project *Project) error {
	projectStore.db.WithContext(ctx).Model(&project).Association("PreferredSkills").Replace(project.PreferredSkills)
	projectStore.db.WithContext(ctx).Model(&project).Association("RequiredSkills").Replace(project.RequiredSkills)
	return projectStore.db.WithContext(ctx).Save(&project).Error
}

func (projectStore *ProjectStore) Delete(ctx context.Context, project *Project) error {
	return projectStore.db.WithContext(ctx).Delete(&project).Error
}
