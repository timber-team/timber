// TODO: Add more functions to the User Handler

package views

import (
	"github.com/gal/timber/models"
	"github.com/gin-gonic/gin"
	"net/http"
	"strconv"
)

func (h *Handler) Profile(c *gin.Context) {
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

	c.JSON(http.StatusOK, gin.H{
		"user": u,
	})
}
