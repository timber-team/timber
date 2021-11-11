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

type ApplicationUpdateRequest struct {
	UserID    int  `json:"user_id" binding:"required,gt=0"`
	ProjectID int  `json:"project_id" binding:"required,gt=0"`
	Accepted  bool `json:"accepted" binding:"omitempty"`
	Denied    bool `json:"denied" binding:"omitempty"`
}

func (h *Handler) NewApplication(c *gin.Context) {
	urlPID := c.Param("projectID")
	pid, err := strconv.Atoi(urlPID)
	ctx := c.Request.Context()
	if err != nil {
		utils.Respond(c, customresponse.NewBadRequest("id invalid"), nil)
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
		utils.Respond(c, customresponse.NewNotFound("user", fmt.Sprintf("%d", u.ID)), nil)
		return
	}

	p := &models.Project{
		ID: pid,
	}

	err = h.ProjectController.Projects.Get(ctx, p)

	if err != nil {
		log.WithError(err).Info("failed to get project")
		utils.Respond(c, customresponse.NewInternal(), nil)
		return
	}

	application := &models.Application{
		UserID:    u.ID,
		ProjectID: p.ID,
	}

	err = h.ApplicationController.Applications.Create(ctx, application)

	if err != nil {
		utils.Respond(c, customresponse.NewConflict("application", ""), nil)
		return
	}

	utils.Respond(c, customresponse.NewCreated(), application)
}

// get all applications by project id by getting the project and then returning the project's applications
func (h *Handler) GetApplicationsByProjectID(c *gin.Context) {
	urlPID := c.Param("projectID")
	pid, err := strconv.Atoi(urlPID)
	ctx := c.Request.Context()
	if err != nil {
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

	utils.Respond(c, customresponse.NewOK(), p.Applications)
}

// get application by id
func (h *Handler) GetApplicationByID(c *gin.Context) {
	urlAID := c.Param("appID")
	aid, err := strconv.Atoi(urlAID)
	ctx := c.Request.Context()
	if err != nil {
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
		utils.Respond(c, customresponse.NewNotFound("user", fmt.Sprintf("%d", u.ID)), nil)
		return
	}

	a := &models.Application{
		ID: aid,
	}

	err = h.ApplicationController.Applications.Get(ctx, a)

	if err != nil {
		utils.Respond(c, customresponse.NewInternal(), nil)
		return
	}

	utils.Respond(c, customresponse.NewOK(), a)
}

func (h *Handler) GetOwnApplications(c *gin.Context) {
	user, exists := c.Get("user")
	if !exists {
		log.WithContext(c).Error("Unable to extract user from the request context")
		return
	}

	ctx := c.Request.Context()

	u := user.(*models.User)

	err := h.UserController.Get(ctx, u)
	if err != nil {
		utils.Respond(c, customresponse.NewNotFound("user", fmt.Sprintf("%d", u.ID)), nil)
		return
	}

	utils.Respond(c, customresponse.NewOK(), u.Applications)
}

// update application
func (h *Handler) UpdateApplication(c *gin.Context) {
	urlAID := c.Param("appID")
	aid, err := strconv.Atoi(urlAID)
	ctx := c.Request.Context()
	if err != nil {
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
		utils.Respond(c, customresponse.NewNotFound("user", fmt.Sprintf("%d", u.ID)), nil)
		return
	}

	a := &models.Application{
		ID: aid,
	}

	err = h.ApplicationController.Applications.Get(ctx, a)

	if err != nil {
		utils.Respond(c, customresponse.NewInternal(), nil)
		return
	}

	log.WithContext(ctx).Info(fmt.Sprintf("Updating application: %+v", a))

	req := &ApplicationUpdateRequest{}
	err = c.Bind(req)
	if err != nil {
		log.WithContext(c).WithError(err).Error(fmt.Sprintf("Unable to bind request: %+v", req))
		utils.Respond(c, customresponse.NewBadRequest("application"), nil)
		return
	}

	log.WithContext(ctx).Info(fmt.Sprintf("Updating application: %+v", req))

	updatedApp := &models.Application{
		ID:        a.ID,
		UserID:    req.UserID,
		ProjectID: req.ProjectID,
		Accepted:  req.Accepted,
		Denied:    req.Denied,
	}

	log.WithContext(ctx).Info(fmt.Sprintf("Updating application: %+v", updatedApp))

	err = h.ApplicationController.Applications.Update(ctx, updatedApp)

	if err != nil {
		utils.Respond(c, customresponse.NewInternal(), nil)
		return
	}

	utils.Respond(c, customresponse.NewOK(), updatedApp)
}
