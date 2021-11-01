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

func (projectStore *ProjectStore) GetAll(ctx context.Context) ([]*Project, error) {
	var projects []*Project
	var err error
	if err = projectStore.db.WithContext(ctx).Preload("Collaborators").Preload("Applications").Preload("PreferredSkills").Preload("RequiredSkills").Omit("Collaborators.Projects").Find(&projects).Error; err != nil {
		return nil, err
	}
	return projects, nil
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

func (projectStore *ProjectStore) GetRecommended(ctx context.Context, user *User) ([]*Project, error) {
	var projects []*Project
	var err error
	if err = projectStore.db.WithContext(ctx).Preload("Collaborators").Preload("Applications").Preload("PreferredSkills").Preload("RequiredSkills").Omit("Collaborators.Projects").Find(&projects).Error; err != nil {
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

func (projectStore *ProjectStore) GetTrending(ctx context.Context) ([]*Project, error) {
	var projects []*Project
	err := projectStore.db.WithContext(ctx).Preload("Collaborators").Preload("Applications").Preload("PreferredSkills").Preload("RequiredSkills").Omit("Collaborators.Projects").Order("count(applications) desc").Find(&projects).Error
	if err != nil {
		return nil, err
	}
	return projects, nil
}

func (projectStore *ProjectStore) GetByTag(ctx context.Context, tag *Tag) ([]*Project, error) {
	projects, err := projectStore.GetAll(ctx)
	if err != nil {
		return nil, err
	}
	var projectsWithTag []*Project
	for _, project := range projects {
		for _, requiredTag := range project.RequiredSkills {
			if requiredTag.ID == tag.ID {
				projectsWithTag = append(projectsWithTag, project)
			}
		}
	}
	return projectsWithTag, nil
}
