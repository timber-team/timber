package views

import (
	"fmt"
	"strconv"

	"github.com/Strum355/log"
	"github.com/gal/timber/models"
	"github.com/gal/timber/utils"
	"github.com/gal/timber/utils/customresponse"
	"github.com/gin-gonic/gin"
)

type projectRequest struct {
	Name            string `json:"name" binding:"required,gte=4,lte=15"`
	Description     string `json:"description" binding:"required,gte=4,lte=85"`
	ImageURL        string `json:"image_url" binding:"omitempty,url,lte=50"`
	RequiredSkills  []int  `json:"required_skills" binding:"omitempty"`
	PreferredSkills []int  `json:"preferred_skills" binding:"omitempty"`
}

func (h *Handler) NewProject(c *gin.Context) {
	var req projectRequest

	if ok := utils.BindData(c, &req); !ok {
		log.WithContext(c).Error("Could not bind data for new project")
		return
	}

	user, exists := c.Get("user")

	if !exists {
		utils.Respond(c, customresponse.NewInternal(), nil)
		return
	}

	uid := user.(*models.User).ID

	ctx := c.Request.Context()

	u := user.(*models.User)

	err := h.UserController.Get(ctx, u)

	if err != nil {
		utils.Respond(c, customresponse.NewNotFound("user", fmt.Sprintf("%d", uid)), nil)
		return
	}

	// map req.RequiredSkills tag id's to []models.Tag
	requiredSkills := make([]*models.Tag, len(req.RequiredSkills))
	for i, tagID := range req.RequiredSkills {
		requiredSkills[i] = &models.Tag{
			ID: tagID,
		}
	}

	// map req.PreferredSkills tag id's to []models.Tag
	preferredSkills := make([]*models.Tag, len(req.PreferredSkills))
	for i, tagID := range req.PreferredSkills {
		preferredSkills[i] = &models.Tag{
			ID: tagID,
		}
	}

	p := &models.Project{
		Name:            req.Name,
		OwnerID:         uid,
		Collaborators:   []*models.User{u},
		Description:     req.Description,
		ImageURL:        req.ImageURL,
		RequiredSkills:  requiredSkills,
		PreferredSkills: preferredSkills,
	}

	err = h.ProjectController.Projects.Create(ctx, p)

	if err != nil {
		utils.Respond(c, customresponse.NewInternal(), nil)
		return
	}

	err = h.ProjectController.Projects.Update(ctx, p)

	if err != nil {
		utils.Respond(c, customresponse.NewInternal(), nil)
		return
	}

	err = h.ProjectController.Projects.Get(ctx, p)

	if err != nil {
		utils.Respond(c, customresponse.NewInternal(), nil)
		return
	}

	utils.Respond(c, customresponse.NewCreated(), p)
}

func (h *Handler) GetProject(c *gin.Context) {
	urlPID := c.Param("projectID")
	pid, err := strconv.Atoi(urlPID)
	ctx := c.Request.Context()
	if err != nil {
		utils.Respond(c, customresponse.NewInternal(), nil)
		return
	}

	user, exists := c.Get("user")

	if !exists {
		utils.Respond(c, customresponse.NewInternal(), nil)
		return
	}

	u := user.(*models.User)

	err = h.UserController.Get(ctx, u)

	if err != nil {
		utils.Respond(c, customresponse.NewNotFound("user", fmt.Sprintf("%d", u.ID)), nil)
		return
	}

	p := &models.Project{
		ID: pid,
	}

	err = h.ProjectController.Projects.Get(ctx, p)

	if err != nil {
		utils.Respond(c, customresponse.NewInternal(), nil)
		return
	}

	utils.Respond(c, customresponse.NewOK(), p)
}

func (h *Handler) GetRecommendedProjects(c *gin.Context) {
	user, exists := c.Get("user")

	if !exists {
		utils.Respond(c, customresponse.NewInternal(), nil)
		return
	}

	ctx := c.Request.Context()

	u := user.(*models.User)

	err := h.UserController.Get(ctx, u)

	if err != nil {
		utils.Respond(c, customresponse.NewNotFound("user", fmt.Sprintf("%d", u.ID)), nil)
		return
	}

	// var projects []*models.Project
	queryProjects, err := h.ProjectController.GetRecommended(ctx, u)
	if err != nil {
		utils.Respond(c, customresponse.NewInternal(), nil)
		return
	}

	log.WithContext(c).Info(fmt.Sprintf("Recommended projects: %v", queryProjects))

	// check if user has applied to any projects
	recommendations := []*models.Project{}

	for _, proj := range queryProjects {
		flag := false
		for _, app := range u.Applications {
			if app.ProjectID == proj.ID {
				flag = true
				break
			}
		}
		if !flag {
			recommendations = append(recommendations, proj)
		}
	}

	utils.Respond(c, customresponse.NewOK(), recommendations)
}

func (h *Handler) GetProjects(c *gin.Context) {
	user, exists := c.Get("user")

	if !exists {
		utils.Respond(c, customresponse.NewInternal(), nil)
		return
	}

	ctx := c.Request.Context()

	u := user.(*models.User)

	err := h.UserController.Get(ctx, u)

	if err != nil {
		utils.Respond(c, customresponse.NewNotFound("user", fmt.Sprintf("%d", u.ID)), nil)
		return
	}
	queryProjects, err := h.ProjectController.GetAll(ctx)

	if err != nil {
		utils.Respond(c, customresponse.NewNotFound("user", fmt.Sprintf("%d", u.ID)), nil)
		return
	}

	var projects []*models.Project
	for _, project := range queryProjects {
		for _, application := range u.Applications {
			if project.ID == application.ProjectID {
				project.UserApplied = true
			}
		}
		projects = append(projects, project)
	}

	log.WithContext(ctx).Info(fmt.Sprintf("%+v", projects))
	utils.Respond(c, customresponse.NewOK(), projects)
}

// get all projects by ownerID handler
func (h *Handler) GetProjectsByOwnerID(c *gin.Context) {
	user, exists := c.Get("user")

	if !exists {
		utils.Respond(c, customresponse.NewInternal(), nil)
		return
	}

	ctx := c.Request.Context()

	u := user.(*models.User)

	err := h.UserController.Get(ctx, u)

	if err != nil {
		utils.Respond(c, customresponse.NewNotFound("user", fmt.Sprintf("%d", u.ID)), nil)
		return
	}

	ownerID := c.Param("ownerID")
	oid, err := strconv.Atoi(ownerID)
	if err != nil {
		utils.Respond(c, customresponse.NewInternal(), nil)
		return
	}

	projects, err := h.ProjectController.Projects.GetByOwnerID(ctx, oid)

	if err != nil {
		utils.Respond(c, customresponse.NewInternal(), nil)
		return
	}

	utils.Respond(c, customresponse.NewOK(), projects)
}

// update project handler
func (h *Handler) UpdateProject(c *gin.Context) {
	urlPID := c.Param("projectID")
	pid, err := strconv.Atoi(urlPID)
	if err != nil {
		utils.Respond(c, customresponse.NewInternal(), nil)
		return
	}

	user, exists := c.Get("user")

	if !exists {
		utils.Respond(c, customresponse.NewInternal(), nil)
		return
	}

	ctx := c.Request.Context()

	u := user.(*models.User)

	err = h.UserController.Get(ctx, u)

	if err != nil {
		utils.Respond(c, customresponse.NewNotFound("user", fmt.Sprintf("%d", u.ID)), nil)
		return
	}

	p := &models.Project{
		ID: pid,
	}

	err = h.ProjectController.Projects.Get(ctx, p)

	if err != nil {
		utils.Respond(c, customresponse.NewNotFound("project", fmt.Sprintf("%d", p.ID)), nil)
		return
	}

	if p.OwnerID != u.ID {
		utils.Respond(c, customresponse.NewAuthorization(fmt.Sprintf("user: %d", u.ID)), nil)
		return
	}

	req := &projectRequest{}
	err = c.BindJSON(req)
	if err != nil {
		utils.Respond(c, customresponse.NewBadRequest(err.Error()), nil)
		return
	}

	// map req.RequiredSkills tag id's to []models.Tag
	requiredSkills := make([]*models.Tag, len(req.RequiredSkills))
	for i, tagID := range req.RequiredSkills {
		requiredSkills[i] = &models.Tag{
			ID: tagID,
		}
	}

	preferredSkills := make([]*models.Tag, len(req.PreferredSkills))
	for i, tagID := range req.PreferredSkills {
		preferredSkills[i] = &models.Tag{
			ID: tagID,
		}
	}

	p.Name = req.Name
	p.Description = req.Description
	p.RequiredSkills = requiredSkills
	p.PreferredSkills = preferredSkills

	log.WithContext(ctx).Info(fmt.Sprintf("%+v", p))

	err = h.ProjectController.Projects.Update(ctx, p)

	if err != nil {
		utils.Respond(c, customresponse.NewInternal(), nil)
		return
	}

	utils.Respond(c, customresponse.NewOK(), p)
}

func (h *Handler) GetProjectsByPopularity(c *gin.Context) {
	user, exists := c.Get("user")

	if !exists {
		utils.Respond(c, customresponse.NewInternal(), nil)
		return
	}

	ctx := c.Request.Context()

	u := user.(*models.User)

	err := h.UserController.Get(ctx, u)
	if err != nil {
		utils.Respond(c, customresponse.NewNotFound("user", fmt.Sprintf("%d", u.ID)), nil)
		return
	}

	popular, err := h.ProjectController.GetByPopularity(ctx)
	if err != nil {
		utils.Respond(c, customresponse.NewInternal(), nil)
		return
	}

	utils.Respond(c, customresponse.NewOK(), popular)
}
