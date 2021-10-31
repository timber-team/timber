package views

import (
	"fmt"

	"github.com/Strum355/log"
	"github.com/gin-gonic/gin"

	"github.com/gal/timber/models"
	"github.com/gal/timber/utils"
	"github.com/gal/timber/utils/customresponse"
)

func (h *Handler) NewTag(c *gin.Context) {
	user, exists := c.Get("user")
	if !exists {
		// log.Info("burh")
		// log.WithContext(c).Error("Unable to extract user from request context")
		// err := customresponse.NewInternal()
		// c.JSON(err.Status(), gin.H{
		// 	"error": err,
		// })
		utils.Respond(c, customresponse.NewInternal(), nil)
		return
	}
	ctx := c.Request.Context()

	u := user.(*models.User)
	err := h.UserController.Get(ctx, u)
	if err != nil {
		// log.WithContext(c).WithError(err).Error(fmt.Sprintf("Unable to find user: %v", u.ID))
		// e := customresponse.NewNotFound("user", fmt.Sprintf("%d", u.ID))

		// c.JSON(e.Status(), gin.H{
		// 	"error": e,
		// })
		utils.Respond(c, customresponse.NewNotFound("user", fmt.Sprintf("%d", u.ID)), nil)
		return
	}

	if !u.Verified {
		// log.WithContext(ctx).Error(fmt.Sprintf("User %v not enabled", u.ID))
		// e := customresponse.NewAuthorization("user not enabled")

		// c.JSON(e.Status(), gin.H{
		// 	"error": e,
		// })
		utils.Respond(c, customresponse.NewAuthorization("user not enabled"), nil)
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
		// log.WithContext(ctx).WithError(err).Error("Failed to create tag")
		// c.JSON(customresponse.Status(err), gin.H{
		// 	"error": err,
		// })
		utils.Respond(c, customresponse.NewInternal(), nil)
		return
	}

	if err != nil {
		// log.WithContext(ctx).WithError(err).Error("Failed to create tag")
		// c.JSON(customresponse.Status(err), gin.H{
		// 	"error": err,
		// })
		utils.Respond(c, customresponse.NewInternal(), nil)
		return
	}

	// c.JSON(http.StatusCreated, gin.H{
	// 	"tag": tag,
	// })
	utils.Respond(c, customresponse.NewCreated(), tag)
}

func (h *Handler) GetTags(c *gin.Context) {
	user, exists := c.Get("user")
	if !exists {
		// log.WithContext(c).Error("Unable to extract user from request context")
		// err := customresponse.NewInternal()
		// c.JSON(err.Status(), gin.H{
		// 	"error": err,
		// })
		utils.Respond(c, customresponse.NewInternal(), nil)
		return
	}

	ctx := c.Request.Context()

	u := user.(*models.User)
	if err := h.UserController.Get(ctx, u); err != nil {
		// log.WithContext(ctx).Error(fmt.Sprintf("User %v not found", u.ID))
		// err := customresponse.NewInternal()
		// c.JSON(err.Status(), gin.H{
		// 	"error": err,
		// })
		utils.Respond(c, customresponse.NewInternal(), nil)
		return
	}

	if !u.Verified {
		// log.WithContext(ctx).Error(fmt.Sprintf("User %v not enabled", u.ID))
		// err := customresponse.NewAuthorization("user not enabled")
		// c.JSON(err.Status(), gin.H{
		// 	"error": err,
		// })
		utils.Respond(c, customresponse.NewAuthorization("user not enabled"), nil)
		return
	}

	tags, err := h.TagController.Tags.GetAll(ctx)
	if err != nil {
		utils.Respond(c, customresponse.NewInternal(), nil)
		return
	}

	// c.JSON(http.StatusOK, gin.H{
	// 	"data": tags,
	// })
	utils.Respond(c, customresponse.NewOK(), tags)
}
