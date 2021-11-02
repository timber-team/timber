// TODO: Project Handler functions

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
		// log.WithContext(c).Error("Unable to extract user from the request context")
		// err := customresponse.NewInternal()
		// c.JSON(err.Status(), gin.H{
		// 	"error": err,
		// })
		utils.Respond(c, customresponse.NewInternal(), nil)
		return
	}

	uid := user.(*models.User).ID

	ctx := c.Request.Context()

	u := user.(*models.User)

	err := h.UserController.Get(ctx, u)

	if err != nil {
		// log.WithContext(ctx).WithError(err).Error(fmt.Sprintf("Unable to find user: %v", uid))
		// e := customresponse.NewNotFound("user", fmt.Sprintf("%d", uid))

		// c.JSON(e.Status(), gin.H{
		// 	"error": e,
		// })
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
		// log.WithContext(ctx).WithError(err).Error("Failed to create project")
		// c.JSON(customresponse.Status(err), gin.H{
		// 	"error": err,
		// })
		utils.Respond(c, customresponse.NewInternal(), nil)
		return
	}

	err = h.ProjectController.Projects.Patch(ctx, p)

	if err != nil {
		// log.WithContext(ctx).WithError(err).Error("Failed to create project")
		// c.JSON(customresponse.Status(err), gin.H{
		// 	"error": err,
		// })
		utils.Respond(c, customresponse.NewInternal(), nil)
		return
	}

	err = h.ProjectController.Projects.Get(ctx, p)

	if err != nil {
		// log.WithContext(ctx).WithError(err).Error("Failed to create project")
		// c.JSON(customresponse.Status(err), gin.H{
		// 	"error": err,
		// })
		utils.Respond(c, customresponse.NewInternal(), nil)
		return
	}

	// c.JSON(http.StatusCreated, gin.H{
	// 	"project": p,
	// })
	utils.Respond(c, customresponse.NewCreated(), p)
}

func (h *Handler) GetProject(c *gin.Context) {
	urlPID := c.Param("projectID")
	pid, err := strconv.Atoi(urlPID)
	ctx := c.Request.Context()
	if err != nil {
		// log.WithContext(ctx).WithError(err).Error(fmt.Sprintf("Unable to parse ID from url: %v", urlPID))
		// e := customresponse.NewInternal()

		// c.JSON(e.Status(), gin.H{
		// 	"error": e,
		// })
		utils.Respond(c, customresponse.NewInternal(), nil)
		return
	}

	user, exists := c.Get("user")

	if !exists {
		// log.WithContext(c).Error("Unable to extract user from the request context")
		// err := customresponse.NewInternal()
		// c.JSON(err.Status(), gin.H{
		// 	"error": err,
		// })
		utils.Respond(c, customresponse.NewInternal(), nil)
		return
	}

	u := user.(*models.User)

	err = h.UserController.Get(ctx, u)

	if err != nil {
		// log.WithContext(ctx).WithError(err).Error(fmt.Sprintf("Unable to find user: %v", u.ID))
		// e := customresponse.NewNotFound("user", fmt.Sprintf("%d", u.ID))

		// c.JSON(e.Status(), gin.H{
		// 	"error": e,
		// })
		utils.Respond(c, customresponse.NewNotFound("user", fmt.Sprintf("%d", u.ID)), nil)
		return
	}

	p := &models.Project{
		ID: pid,
	}

	err = h.ProjectController.Projects.Get(ctx, p)

	if err != nil {
		// log.WithContext(ctx).WithError(err).Error("Failed to get project")
		// c.JSON(customresponse.Status(err), gin.H{
		// 	"error": err,
		// })
		utils.Respond(c, customresponse.NewInternal(), nil)
		return
	}

	// c.JSON(http.StatusCreated, gin.H{
	// 	"project": p,
	// })
	utils.Respond(c, customresponse.NewOK(), p)
}

func (h *Handler) GetProjects(c *gin.Context) {
	user, exists := c.Get("user")

	if !exists {
		// log.WithContext(c).Error("Unable to extract user from the request context")
		// err := customresponse.NewInternal()
		// c.JSON(err.Status(), gin.H{
		// 	"error": err,
		// })
		utils.Respond(c, customresponse.NewInternal(), nil)
		return
	}

	ctx := c.Request.Context()

	u := user.(*models.User)

	err := h.UserController.Get(ctx, u)

	if err != nil {
		// log.WithContext(ctx).WithError(err).Error(fmt.Sprintf("Unable to find user: %v", u.ID))
		// e := customresponse.NewNotFound("user", fmt.Sprintf("%d", u.ID))

		// c.JSON(e.Status(), gin.H{
		// 	"error": e,
		// })
		utils.Respond(c, customresponse.NewNotFound("user", fmt.Sprintf("%d", u.ID)), nil)
		return
	}
	projects, err := h.ProjectController.GetAll(ctx)

	if err != nil {
		// log.WithContext(ctx).WithError(err).Error(fmt.Sprintf("Unable to find user: %v", u.ID))
		// e := customresponse.NewNotFound("user", fmt.Sprintf("%d", u.ID))

		// c.JSON(e.Status(), gin.H{
		// 	"error": e,
		// })
		utils.Respond(c, customresponse.NewNotFound("user", fmt.Sprintf("%d", u.ID)), nil)
		return
	}

	// c.JSON(http.StatusCreated, gin.H{
	// 	"projects": projects,
	// })
	log.WithContext(ctx).Info(fmt.Sprintf("%+v", projects))
	utils.Respond(c, customresponse.NewOK(), projects)
}
