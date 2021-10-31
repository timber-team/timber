// TODO: Application Handler functions

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

func (h *Handler) NewApplication(c *gin.Context) {
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
		log.WithContext(c).Error("Unable to extract user from the request context")
		return
	}

	u := user.(*models.User)

	err = h.UserController.Get(ctx, u)

	if err != nil {
		log.WithContext(ctx).WithError(err).Error(fmt.Sprintf("Unable to find user: %v", u.ID))
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

	application := &models.Application{
		UserID:    u.ID,
		ProjectID: p.ID,
	}

	err = h.ApplicationController.Applications.Create(ctx, application)

	if err != nil {
		// log.WithContext(ctx).WithError(err).Error("Failed to create application")
		// c.JSON(customresponse.Status(err), gin.H{
		// 	"error": err,
		// })
		utils.Respond(c, customresponse.NewInternal(), nil)
		return
	}

	// c.JSON(http.StatusCreated, gin.H{
	// 	"application": application,
	// })
	utils.Respond(c, customresponse.NewCreated(), application)
}
