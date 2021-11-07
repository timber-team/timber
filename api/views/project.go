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
	Name string `json:"name" binding:"required,gte=4,lte=30"`
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

	p := &models.Project{
		Name:          req.Name,
		OwnerID:       uid,
		Collaborators: []*models.User{u},
	}

	err = h.ProjectController.Projects.Create(ctx, p)

	if err != nil {
		utils.Respond(c, customresponse.NewInternal(), nil)
		return
	}

	err = h.ProjectController.Projects.Patch(ctx, p)

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

	log.WithContext(ctx).Info(fmt.Sprintf("%+v", queryProjects))
	utils.Respond(c, customresponse.NewOK(), queryProjects)
}

// get projects by ownerID handler
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
	pid, err := strconv.Atoi(ownerID)
	if err != nil {
		utils.Respond(c, customresponse.NewInternal(), nil)
		return
	}

	p := &models.Project{
		OwnerID: pid,
	}

	err = h.ProjectController.Projects.Get(ctx, p)

	if err != nil {
		utils.Respond(c, customresponse.NewNotFound("user", fmt.Sprintf("%d", u.ID)), nil)
		return
	}

	utils.Respond(c, customresponse.NewOK(), p)
}
