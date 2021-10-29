// TODO: Add more functions to the User Handler

package views

import (
	"github.com/gal/timber/models"
	"github.com/gin-gonic/gin"
	"net/http"
	"strconv"
)

func (h *Handler) GetUser(c *gin.Context) {
	if user, exists := c.Get("user"); exists {
		userID, err := strconv.Atoi(c.Param("id"))
		if err != nil {
			// do stuff
			c.AbortWithStatus(http.StatusBadRequest)
		}
		// TODO check if has access
		if user.(models.User).ID == userID {
			fetchingUser := &models.User{
				ID: userID,
			}

			if err = h.UserController.Get(c, fetchingUser); err != nil {
				// do stuff
				c.AbortWithStatus(http.StatusNotFound)
			}

			c.JSON(http.StatusOK, gin.H{
				"user": *fetchingUser,
			})
		}
	}

	c.AbortWithStatus(http.StatusUnauthorized)
}
