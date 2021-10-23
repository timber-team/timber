// TODO: Add more functions to the User Handler

package views

import (
	"net/http"

	"github.com/Strum355/log"
	"github.com/gal/timber/models"
	"github.com/gal/timber/utils"
	"github.com/gal/timber/utils/customerror"
	"github.com/gin-gonic/gin"
)

// signupRequest is used for json marshalling and validation
type signupRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,gte=6,lte=30"`
}

// Signup handler
func (h *Handler) Signup(c *gin.Context) {
	// Variable to hold the incoming json body {email, password}
	var req signupRequest

	// Bind incoming json to the struct and check for validation errors
	if ok := utils.BindData(c, &req); !ok {
		return
	}

	u := &models.User{
		Email:    req.Email,
		Password: req.Password,
	}

	ctx := c.Request.Context()

	err := h.UserController.Signup(ctx, u)

	if err != nil {
		log.WithContext(ctx).WithError(err).Error("Failed to sign up user")
		c.JSON(customerror.Status(err), gin.H{
			"error": err,
		})
		return
	}

	// Create a token pair as strings
	tokens, err := h.TokenController.NewPairFromUser(ctx, u, "")

	if err != nil {
		log.WithContext(ctx).WithError(err).Error("Failed to create tokens for user")

		c.JSON(customerror.Status(err), gin.H{
			"error": err,
		})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"tokens": tokens,
	})
}
