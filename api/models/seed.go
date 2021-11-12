package models

import (
	"math/rand"
	"strconv"

	"github.com/Strum355/log"
	"github.com/brianvoe/gofakeit/v6"
	"gorm.io/gorm"
)

type SeedStore struct {
	db *gorm.DB
}

func NewSeedStore(db *gorm.DB) *SeedStore {
	return &SeedStore{db}
}

// Seed the database with randomly generated data
func (ss *SeedStore) Seed() error {

	// Set gorm to full save associations
	ss.db.Set("gorm:save_associations", true)

	// string slice of software developer skills
	tagNames := []string{"C", "C++", "Java", "JavaScript", "Python", "SQL", "HTML", "CSS", "Go", "PHP", "Ruby", "Swift"}

	// Generate 50 random Tags and store them in a slice
	var generatedTags []*Tag
	for i := 0; i < len(tagNames); i++ {
		generatedTags = append(generatedTags, &Tag{Name: tagNames[i]})
	}

	// Seed the database with the generated tags
	err := ss.db.Create(&generatedTags).Error
	if err != nil {
		log.WithError(err).Error("Error seeding tags")
	}

	// Generate 50 random Users and store them in a slice
	var users []User
	for i := 0; i < 50; i++ {
		var user User
		// Generate a random username of real names

		user.Username = gofakeit.Username()
		user.Email = gofakeit.Email()
		user.Description = gofakeit.Paragraph(1, 10, 150, ".")
		user.AvatarURL = "https://i.pravatar.cc/600?img=" + strconv.Itoa(i)

		// Set the users Tags field to a slice of Tags randomly chosen from the slice of generatedTags
		for j := 0; j < 3; j++ {
			user.Tags = append(user.Tags, generatedTags[rand.Intn(len(generatedTags))])
		}
		users = append(users, user)
	}

	// Seed the database with the generated users
	err = ss.db.Create(&users).Error
	if err != nil {
		log.WithError(err).Error("Error seeding users")
	}

	// Generate 50 random Projects and store them in a slice
	var projects []Project
	for i := 0; i < 50; i++ {
		var project Project
		project.Name = gofakeit.AppName()
		project.Description = gofakeit.Paragraph(1, 10, 150, ".")

		owner := users[rand.Intn(len(users))]
		// Set the projects Owner field to a randomly chosen User from the slice of users
		project.OwnerID = owner.ID

		// Set the projects Collaborators field to a slice of Users randomly chosen from the slice of users
		for j := 0; j < 3; j++ {
			project.Collaborators = append(project.Collaborators, &users[rand.Intn(len(users))])
		}

		// If owner not in collaborators, add owner to collaborators
		exists := false
		for _, collaborator := range project.Collaborators {
			if collaborator.ID == owner.ID {
				exists = true
				break
			}
		}
		if !exists {
			project.Collaborators = append(project.Collaborators, &owner)
		}

		// Set the projects PreferredSkills field to a slice of Tags randomly chosen from the slice of generatedTags
		for j := 0; j < 3; j++ {
			project.PreferredSkills = append(project.PreferredSkills, generatedTags[rand.Intn(len(generatedTags))])
		}

		// Set the projects RequiredSkills field to a slice of Tags randomly chosen from the slice of generatedTags
		for j := 0; j < 3; j++ {
			project.RequiredSkills = append(project.RequiredSkills, generatedTags[rand.Intn(len(generatedTags))])
		}

		// Set the projects ImageURL field to a random image from the unsplash API
		project.ImageURL = "https://source.unsplash.com/random/800x600?sig=" + strconv.Itoa(i)

		projects = append(projects, project)
	}

	// Seed the database with the generated projects
	err = ss.db.Create(&projects).Error
	if err != nil {
		log.WithError(err).Error("Error seeding projects")
	}

	// Generate 50 random Applications and store them in a slice
	var applications []Application
	for i := 0; i < 50; i++ {
		var application Application
		application.UserID = users[rand.Intn(len(users))].ID
		application.ProjectID = projects[rand.Intn(len(projects))].ID

		applications = append(applications, application)
	}

	// Seed the database with the generated applications
	err = ss.db.Create(&applications).Error
	if err != nil {
		log.WithError(err).Error("Error seeding applications")
	}

	return nil
}
