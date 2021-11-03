package views

import (
	"fmt"
	"strconv"

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
