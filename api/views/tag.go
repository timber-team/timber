package views

import (
	"fmt"
	"strconv"

	"github.com/Strum355/log"
	"github.com/gin-gonic/gin"

	"github.com/gal/timber/models"
	"github.com/gal/timber/utils"
	"github.com/gal/timber/utils/customresponse"
)

func (h *Handler) NewTag(c *gin.Context) {
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

	var tag *models.Tag

	if ok := utils.BindData(c, &tag); !ok {
		log.WithContext(c).Error("Unable to extract tag data from request")
		return
	}

	tag.ID = 0
	err = h.TagController.Tags.Create(ctx, tag)
	if err != nil {
		utils.Respond(c, customresponse.NewInternal(), nil)
		return
	}

	if err != nil {
		utils.Respond(c, customresponse.NewInternal(), nil)
		return
	}
	utils.Respond(c, customresponse.NewCreated(), tag)
}

func (h *Handler) GetTags(c *gin.Context) {
	user, exists := c.Get("user")
	if !exists {
		utils.Respond(c, customresponse.NewInternal(), nil)
		return
	}

	ctx := c.Request.Context()

	u := user.(*models.User)
	if err := h.UserController.Get(ctx, u); err != nil {
		utils.Respond(c, customresponse.NewInternal(), nil)
		return
	}

	tags, err := h.TagController.Tags.GetAll(ctx)
	if err != nil {
		utils.Respond(c, customresponse.NewInternal(), nil)
		return
	}

	utils.Respond(c, customresponse.NewOK(), tags)
}

// get tag by tagID handler
func (h *Handler) GetTag(c *gin.Context) {
	user, exists := c.Get("user")
	if !exists {
		utils.Respond(c, customresponse.NewInternal(), nil)
		return
	}

	ctx := c.Request.Context()

	u := user.(*models.User)
	if err := h.UserController.Get(ctx, u); err != nil {
		utils.Respond(c, customresponse.NewInternal(), nil)
		return
	}

	tagIDstr := c.Param("tagID")
	tagID, err := strconv.Atoi(tagIDstr)
	if err != nil {
		utils.Respond(c, customresponse.NewInternal(), nil)
		return
	}

	tag := &models.Tag{
		ID: tagID,
	}
	err = h.TagController.Tags.Get(ctx, tag)
	if err != nil {
		utils.Respond(c, customresponse.NewInternal(), nil)
		return
	}

	utils.Respond(c, customresponse.NewOK(), tag)
}

func (h *Handler) GetTagsByProjectID(c *gin.Context) {
	user, exists := c.Get("user")
	if !exists {
		utils.Respond(c, customresponse.NewInternal(), nil)
		return
	}

	ctx := c.Request.Context()

	u := user.(*models.User)
	if err := h.UserController.Get(ctx, u); err != nil {
		utils.Respond(c, customresponse.NewInternal(), nil)
		return
	}

	projectIDstr := c.Param("projectID")
	projectID, err := strconv.Atoi(projectIDstr)
	if err != nil {
		utils.Respond(c, customresponse.NewInternal(), nil)
		return
	}

	project := &models.Project{
		ID: projectID,
	}

	err = h.ProjectController.Projects.Get(ctx, project)

	if err != nil {
		utils.Respond(c, customresponse.NewInternal(), nil)
		return
	}

	utils.Respond(c, customresponse.NewOK(), project.RequiredSkills)
}
