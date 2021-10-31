package middlewares

import (
	"errors"
	"strings"

	"github.com/gal/timber/controllers"
	"github.com/gal/timber/utils"
	"github.com/gal/timber/utils/customresponse"
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

				// err := customresponse.NewBadRequest("Invalid request parameters. See invalidArgs")

				// c.JSON(err.Status(), gin.H{
				// 	"error":       err,
				// 	"invalidArgs": invalidArgs,
				// })
				utils.Respond(c, customresponse.NewBadRequest("Invalid request parameters. See invalidArgs"), invalidArgs)
				c.Abort()
				return
			}

			// Error type is unknown
			// err := customresponse.NewInternal()
			// c.JSON(err.Status(), gin.H{
			// 	"error": err,
			// })
			utils.Respond(c, customresponse.NewInternal(), nil)
			c.Abort()
			return
		}

		accessTokenHeader := strings.Split(h.AccessToken, "Bearer ")

		if len(accessTokenHeader) < 2 {
			// err := customresponse.NewAuthorization("Must provide Authorization header")

			// c.JSON(err.Status(), gin.H{
			// 	"error": err,
			// })
			utils.Respond(c, customresponse.NewAuthorization("Must provide Authorization header"), nil)
			c.Abort()
			return
		}

		// Validate Access token
		user, err := tokenControl.ValidateAccessToken(accessTokenHeader[1])

		if err != nil {
			// err := customresponse.NewAuthorization("Provided token is invalid")
			// c.JSON(err.Status(), gin.H{
			// 	"error": err,
			// })
			utils.Respond(c, customresponse.NewAuthorization("Provided token is invalid"), nil)
			c.Abort()
			return
		}

		c.Set("user", user)

		c.Next()
	}
}
