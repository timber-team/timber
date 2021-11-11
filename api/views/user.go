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

func (h *Handler) Profile(c *gin.Context) {
	user, exists := c.Get("user")

	if !exists {
		utils.Respond(c, customresponse.NewInternal(), nil)
		return
	}

	ctx := c.Request.Context()

	u := user.(*models.User)

	err := h.UserController.Get(ctx, u)

	if err != nil {
		utils.Respond(c, customresponse.NewInternal(), nil)
		return
	}

	utils.Respond(c, customresponse.NewOK(), u)
}

func (h *Handler) ProfileByID(c *gin.Context) {
	uidStr := c.Param("userID")

	ctx := c.Request.Context()

	// cast uid to an int
	uid, err := strconv.Atoi(uidStr)
	if err != nil {
		utils.Respond(c, customresponse.NewBadRequest("userID must be an integer"), nil)
		return
	}

	u := &models.User{ID: uid}

	err = h.UserController.Get(ctx, u)
	if err != nil {
		utils.Respond(c, customresponse.NewNotFound("user", fmt.Sprintf("%d", uid)), nil)
		return
	}

	utils.Respond(c, customresponse.NewOK(), u)
}

type userRequest struct {
	Username    string `json:"username" binding:"omitempty"`
	Description string `json:"description" binding:"omitempty"`
	AvatarUrl   string `json:"avatar_url" binding:"omitempty,url"`
	Tags        []int  `json:"tags" binding:"omitempty"`
}

// update user from a post request containing a user object in the body
func (h *Handler) UpdateUser(c *gin.Context) {
	user, exists := c.Get("user")

	if !exists {
		utils.Respond(c, customresponse.NewInternal(), nil)
		return
	}

	ctx := c.Request.Context()

	u := user.(*models.User)

	err := h.UserController.Get(ctx, u)

	if err != nil {
		utils.Respond(c, customresponse.NewInternal(), nil)
		return
	}

	req := &userRequest{}
	err = c.BindJSON(req)
	if err != nil {
		log.WithContext(c).WithError(err).Error("failed to bind json")
		utils.Respond(c, customresponse.NewBadRequest(err.Error()), nil)
		return
	}

	// map req.RequiredSkills tag id's to []models.Tag
	tags := make([]*models.Tag, len(req.Tags))
	for i, tagID := range req.Tags {
		tags[i] = &models.Tag{
			ID: tagID,
		}
	}

	u.Username = req.Username
	u.Description = req.Description
	u.AvatarURL = req.AvatarUrl
	u.Tags = tags

	// err = c.BindJSON(&u)
	// if err != nil {
	// 	utils.Respond(c, customresponse.NewBadRequest("user object is invalid"), nil)
	// 	return
	// }

	// update the user
	err = h.UserController.Update(ctx, u, u)
	if err != nil {
		utils.Respond(c, customresponse.NewInternal(), nil)
		return
	}

	utils.Respond(c, customresponse.NewOK(), u)
}
