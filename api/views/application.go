// TODO: Application Handler functions

package views

import (
	"fmt"
	"net/http"
	"strconv"

	"github.com/Strum355/log"
	"github.com/gal/timber/models"
	"github.com/gal/timber/utils/customerror"
	"github.com/gin-gonic/gin"
)

func (h *Handler) NewApplication(c *gin.Context) {
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

	application := &models.Application{
		UserID:    u.ID,
		ProjectID: p.ID,
	}

	err = h.ApplicationController.Applications.Create(ctx, application)

	if err != nil {
		log.WithContext(ctx).WithError(err).Error("Failed to create application")
		c.JSON(customerror.Status(err), gin.H{
			"error": err,
		})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"application": application,
	})
}
