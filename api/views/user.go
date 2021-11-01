// TODO: Add more functions to the User Handler

package views

import (
	"fmt"

	"github.com/gal/timber/models"
	"github.com/gal/timber/utils"
	"github.com/gal/timber/utils/customresponse"
	"github.com/gin-gonic/gin"
)

func (h *Handler) Profile(c *gin.Context) {
	user, exists := c.Get("user")

	if !exists {
		// log.WithContext(c).Error("Unable to extract user from the request context")
		// err := customresponse.NewInternal()
		// c.JSON(err.Status(), gin.H{
		// 	"error": err,
		// })
		utils.Respond(c, customresponse.NewInternal(), nil)
		return
	}

	uid := user.(*models.User).ID

	ctx := c.Request.Context()

	u := user.(*models.User)

	err := h.UserController.Get(ctx, u)

	if err != nil {
		// log.WithContext(ctx).WithError(err).Error(fmt.Sprintf("Unable to find user: %v", uid))
		// e := customresponse.NewNotFound("user", fmt.Sprintf("%d", uid))

		// c.JSON(e.Status(), gin.H{
		// 	"error": e,
		// })
		utils.Respond(c, customresponse.NewNotFound("user", fmt.Sprintf("%d", uid)), nil)
		return
	}

	// c.JSON(http.StatusOK, gin.H{
	// 	"user": u,
	// })
	utils.Respond(c, customresponse.NewOK(), u)
}
