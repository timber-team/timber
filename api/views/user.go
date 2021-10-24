// TODO: Add more functions to the User Handler

package views

import (
	"fmt"
	"net/http"

	"github.com/Strum355/log"
	"github.com/gal/timber/models"
	"github.com/gal/timber/utils"
	"github.com/gal/timber/utils/customerror"
	"github.com/gin-gonic/gin"
)

type loginRequest struct {
	Username string `json:"username" binding:"omitempty,gte=6,lte=30"`
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,gte=6,lte=30"`
}

// Signup handler
func (h *Handler) Signup(c *gin.Context) {
	// Variable to hold the incoming json body {email, password}
	var req loginRequest

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

// Signin handler
func (h *Handler) Signin(c *gin.Context) {
	var req loginRequest

	if ok := utils.BindData(c, &req); !ok {
		return
	}

	u := &models.User{
		Email:    req.Email,
		Password: req.Password,
	}
	ctx := c.Request.Context()
	err := h.UserController.Signin(ctx, u)

	if err != nil {
		log.WithContext(ctx).WithError(err).Error("Failed to sign in user")
		c.JSON(customerror.Status(err), gin.H{
			"error": err,
		})
		return
	}

	tokens, err := h.TokenController.NewPairFromUser(ctx, u, "")

	if err != nil {
		log.WithContext(ctx).WithError(err).Error("Failed to create tokens for user")

		c.JSON(customerror.Status(err), gin.H{
			"error": err,
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"tokens": tokens,
	})
}

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

	u, err := h.UserController.Get(ctx, uid)

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
