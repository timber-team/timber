package middlewares

import (
	"errors"
	"strings"

	"github.com/gal/timber/controllers"
	"github.com/gal/timber/utils/customerror"
	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
)

type authHeader struct {
	AccessToken string `header:"Authorization"`
}

// Used for extracting validation errors
type invalidArgument struct {
	Field string `json:"field"`
	Value string `json:"value"`
	Tag   string `json:"tag"`
	Param string `json:"param"`
}

func AuthUser(tokenControl controllers.TokenController) gin.HandlerFunc {
	return func(c *gin.Context) {
		h := authHeader{}

		// Bind Authorization Header to h and check for validation errors
		if err := c.ShouldBindHeader(&h); err != nil {
			var errs validator.ValidationErrors
			if ok := errors.Is(err, errs); ok {
				var invalidArgs []invalidArgument

				for _, err := range errs {
					invalidArgs = append(invalidArgs, invalidArgument{
						err.Field(),
						err.Value().(string),
						err.Tag(),
						err.Param(),
					})
				}

				err := customerror.NewBadRequest("Invalid request parameters. See invalidArgs")

				c.JSON(err.Status(), gin.H{
					"error":       err,
					"invalidArgs": invalidArgs,
				})
				c.Abort()
				return
			}

			// Error type is unknown
			err := customerror.NewInternal()
			c.JSON(err.Status(), gin.H{
				"error": err,
			})
			c.Abort()
			return
		}

		accessTokenHeader := strings.Split(h.AccessToken, "Bearer ")

		if len(accessTokenHeader) < 2 {
			err := customerror.NewAuthorization("Must provide Authorization header")

			c.JSON(err.Status(), gin.H{
				"error": err,
			})
			c.Abort()
			return
		}

		// Validate Access token
		user, err := tokenControl.ValidateAccessToken(accessTokenHeader[1])

		if err != nil {
			err := customerror.NewAuthorization("Provided token is invalid")
			c.JSON(err.Status(), gin.H{
				"error": err,
			})
			c.Abort()
			return
		}

		c.Set("user", user)

		c.Next()
	}
}
