package views

import (
	"fmt"
	"strconv"
	"strings"

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

func (h *Handler) Profiles(c *gin.Context) {
	ctx := c.Request.Context()

	// GET /users?q=1,2,3,4,5,6,7,8,9,10
	query := c.Query("q")
	// userStringIds := query.split(",")
	userStringIds := strings.Split(query, ",")
	userIds := []int{}

	for _, user_id := range userStringIds {
		userId, err := strconv.Atoi(user_id)
		if err != nil {
			utils.Respond(c, customresponse.NewBadRequest("userID must be an integer"), nil)
			return
		}
		userIds = append(userIds, userId)
	}

	users, err := h.UserController.GetMany(ctx, userIds)
	if err != nil {
		utils.Respond(c, customresponse.NewInternal(), nil)
		return
	}

	utils.Respond(c, customresponse.NewOK(), users)
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
	AvatarUrl   string `json:"avatar_url" binding:"omitempty,url,lte=90"`
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
	err = h.UserController.Update(ctx, u)
	if err != nil {
		utils.Respond(c, customresponse.NewInternal(), nil)
		return
	}

	utils.Respond(c, customresponse.NewOK(), u)
}
