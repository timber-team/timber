package middlewares

import (
	"errors"
	"strings"
	"time"

	"github.com/Strum355/log"
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

				utils.Respond(c, customresponse.NewBadRequest("Invalid request parameters. See invalidArgs"), invalidArgs)
				c.Abort()
				return
			}

			utils.Respond(c, customresponse.NewInternal(), nil)
			c.Abort()
			return
		}

		accessTokenHeader := strings.Split(h.AccessToken, "Bearer ")

		if len(accessTokenHeader) < 2 {
			utils.Respond(c, customresponse.NewAuthorization("Must provide Authorization header"), nil)
			c.Abort()
			return
		}

		// Validate Access token
		user, err := tokenControl.ValidateAccessToken(accessTokenHeader[1])

		if err != nil {
			utils.Respond(c, customresponse.NewAuthorization("Provided token is invalid"), nil)
			c.Abort()
			return
		}

		c.Set("user", user)

		c.Next()
	}
}
func JSONLogMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Start timer
		start := time.Now()

		// Process Request
		c.Next()

		// Stop timer
		duration := utils.GetDurationInMillseconds(start)

		entry := log.WithFields(log.Fields{
			"client_ip":  utils.GetClientIP(c),
			"duration":   duration,
			"method":     c.Request.Method,
			"path":       c.Request.RequestURI,
			"status":     c.Writer.Status(),
			"referrer":   c.Request.Referer(),
			"request_id": c.Writer.Header().Get("Request-Id"),
		})

		if c.Writer.Status() >= 500 {
			entry.Error(c.Errors.String())
		} else {
			entry.Info("")
		}
	}
}
