// TODO: Add more functions to the User Handler

package views

// type loginRequest struct {
// 	Username string `json:"username" binding:"omitempty,gte=6,lte=30"`
// 	Email    string `json:"email" binding:"required,email"`
// 	Password string `json:"password" binding:"required,gte=6,lte=30"`
// }

// revoke user access

// // output, err := json.Marshal(contents)
// if err != nil {
// 	log.WithContext(ctx).WithError(err).Error(err.Error())
// 	e := customerror.NewInternal()

// 	c.JSON(e.Status(), gin.H{
// 		"error": e,
// 	})
// 	return
// }

// c.JSON(http.StatusOK, gin.H{
// 	"pog": string(contents),
// })

// var req loginRequest

// if ok := utils.BindData(c, &req); !ok {
// 	return
// }

// u := &models.User{
// 	Email:    req.Email,
// 	Password: req.Password,
// }
// ctx := c.Request.Context()
// err := h.UserController.Signin(ctx, u)

// if err != nil {
// 	log.WithContext(ctx).WithError(err).Error("Failed to sign in user")
// 	c.JSON(customerror.Status(err), gin.H{
// 		"error": err,
// 	})
// 	return
// }

// tokens, err := h.TokenController.NewPairFromUser(ctx, u, "")

// if err != nil {
// 	log.WithContext(ctx).WithError(err).Error("Failed to create tokens for user")

// 	c.JSON(customerror.Status(err), gin.H{
// 		"error": err,
// 	})
// 	return
// }

// c.JSON(http.StatusOK, gin.H{
// 	"tokens": tokens,
// })
// }

// func (h *Handler) Profile(c *gin.Context) {
// 	user, exists := c.Get("user")

// 	if !exists {
// 		log.WithContext(c).Error("Unable to extract user from the request context")
// 		err := customerror.NewInternal()
// 		c.JSON(err.Status(), gin.H{
// 			"error": err,
// 		})
// 		return
// 	}

// 	uid := user.(*models.User).ID

// 	ctx := c.Request.Context()

// 	u, err := h.UserController.GetByID(ctx, uid)

// 	if err != nil {
// 		log.WithContext(ctx).WithError(err).Error(fmt.Sprintf("Unable to find user: %v", uid))
// 		e := customerror.NewNotFound("user", fmt.Sprintf("%d", uid))

// 		c.JSON(e.Status(), gin.H{
// 			"error": e,
// 		})
// 		return
// 	}

// 	c.JSON(http.StatusOK, gin.H{
// 		"user": u,
// 	})
// }
