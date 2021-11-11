package views

import (
	"fmt"
	"strconv"
	"strings"

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

	// get the user from the request body
	var newUser models.User
	err = c.BindJSON(&newUser)
	if err != nil {
		utils.Respond(c, customresponse.NewBadRequest("user object is invalid"), nil)
		return
	}

	// update the user
	err = h.UserController.Update(ctx, u, &newUser)
	if err != nil {
		utils.Respond(c, customresponse.NewInternal(), nil)
		return
	}

	utils.Respond(c, customresponse.NewOK(), u)
}
