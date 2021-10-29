// TODO: Project Handler functions

package views

import (
	"fmt"
	"net/http"
	"strconv"

	"github.com/Strum355/log"
	"github.com/gal/timber/models"
	"github.com/gal/timber/utils"
	"github.com/gal/timber/utils/customerror"
	"github.com/gin-gonic/gin"
)

type projectRequest struct {
	Name string `json:"name" binding:"required,gte=4,lte=30"`
}

func (h *Handler) NewProject(c *gin.Context) {
	var req projectRequest

	if ok := utils.BindData(c, &req); !ok {
		return
	}

	user, exists := c.Get("user")

	if !exists {
		log.WithContext(c).Error("Unable to extract user from the request context")
		err := customerror.NewInternal()
		c.JSON(err.Status(), gin.H{
			"error": err,
		})
		return
	}

	uid := user.(*models.User).ID

	ctx := c.Request.Context()

	u := user.(*models.User)

	err := h.UserController.Get(ctx, u)

	if err != nil {
		log.WithContext(ctx).WithError(err).Error(fmt.Sprintf("Unable to find user: %v", uid))
		e := customerror.NewNotFound("user", fmt.Sprintf("%d", uid))

		c.JSON(e.Status(), gin.H{
			"error": e,
		})
		return
	}

	p := &models.Project{
		Name:          req.Name,
		OwnerID:       uid,
		Collaborators: []*models.User{u},
	}

	err = h.ProjectController.Projects.Create(ctx, p)

	if err != nil {
		log.WithContext(ctx).WithError(err).Error("Failed to create project")
		c.JSON(customerror.Status(err), gin.H{
			"error": err,
		})
		return
	}

	err = h.ProjectController.Projects.Patch(ctx, p)

	if err != nil {
		log.WithContext(ctx).WithError(err).Error("Failed to create project")
		c.JSON(customerror.Status(err), gin.H{
			"error": err,
		})
		return
	}

	err = h.ProjectController.Projects.Get(ctx, p)

	if err != nil {
		log.WithContext(ctx).WithError(err).Error("Failed to create project")
		c.JSON(customerror.Status(err), gin.H{
			"error": err,
		})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"project": p,
	})
}

func (h *Handler) GetProject(c *gin.Context) {
	urlPID := c.Param("projectID")
	pid, err := strconv.Atoi(urlPID)
	ctx := c.Request.Context()
	if err != nil {
		log.WithContext(ctx).WithError(err).Error(fmt.Sprintf("Unable to parse ID from url: %v", urlPID))
		e := customerror.NewInternal()

		c.JSON(e.Status(), gin.H{
			"error": e,
		})
		return
	}

	user, exists := c.Get("user")

	if !exists {
		log.WithContext(c).Error("Unable to extract user from the request context")
		err := customerror.NewInternal()
		c.JSON(err.Status(), gin.H{
			"error": err,
		})
		return
	}

	u := user.(*models.User)

	err = h.UserController.Get(ctx, u)

	if err != nil {
		log.WithContext(ctx).WithError(err).Error(fmt.Sprintf("Unable to find user: %v", u.ID))
		e := customerror.NewNotFound("user", fmt.Sprintf("%d", u.ID))

		c.JSON(e.Status(), gin.H{
			"error": e,
		})
		return
	}

	p := &models.Project{
		ID: pid,
	}

	err = h.ProjectController.Projects.Get(ctx, p)

	if err != nil {
		log.WithContext(ctx).WithError(err).Error("Failed to get project")
		c.JSON(customerror.Status(err), gin.H{
			"error": err,
		})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"project": p,
	})
}

func (h *Handler) GetProjects(c *gin.Context) {
	user, exists := c.Get("user")

	if !exists {
		log.WithContext(c).Error("Unable to extract user from the request context")
		err := customerror.NewInternal()
		c.JSON(err.Status(), gin.H{
			"error": err,
		})
		return
	}

	ctx := c.Request.Context()

	u := user.(*models.User)

	err := h.UserController.Get(ctx, u)

	if err != nil {
		log.WithContext(ctx).WithError(err).Error(fmt.Sprintf("Unable to find user: %v", u.ID))
		e := customerror.NewNotFound("user", fmt.Sprintf("%d", u.ID))

		c.JSON(e.Status(), gin.H{
			"error": e,
		})
		return
	}
	projects := u.Projects
	err = h.ProjectController.GetAll(ctx, projects)

	if err != nil {
		log.WithContext(ctx).WithError(err).Error(fmt.Sprintf("Unable to find user: %v", u.ID))
		e := customerror.NewNotFound("user", fmt.Sprintf("%d", u.ID))

		c.JSON(e.Status(), gin.H{
			"error": e,
		})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"projects": projects,
	})
}
