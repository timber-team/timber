// TODO: Token Handler functions

package views

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/Strum355/log"
	"github.com/gal/timber/models"
	"github.com/gal/timber/utils/customerror"
	"github.com/gin-gonic/gin"
	"github.com/spf13/viper"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
)

var googleConfig *oauth2.Config

// var githubConfig *oauth2.Config

func InitOauth() {
	googleConfig = &oauth2.Config{
		ClientID:     viper.GetString("oauth.google.id"),
		ClientSecret: viper.GetString("oauth.google.secret"),
		RedirectURL:  "http://" + "localhost:8080" + "/auth/callback/google",
		Scopes: []string{
			"https://www.googleapis.com/auth/userinfo.email",
		},
		Endpoint: google.Endpoint,
	}

	// githubConfig = &oauth2.Config{}

	fmt.Println("test", viper.GetString("oauth.google.id"))
}

// SignIn Handler
func (h *Handler) SignIn(c *gin.Context) {

	// based off provider, use different redirect
	// TODO ensure redirect_url is on same domain as $API_URL

	if c.Param("provider") == "google" {
		c.Redirect(http.StatusTemporaryRedirect, googleConfig.AuthCodeURL(c.Query("redirect_url")))
	}
}

func (h *Handler) OauthCallback(c *gin.Context) {
	// based off provider, use different redirect
	if c.Param("provider") == "google" {
		h.GoogleOauthCallback(c)
	}
}

// GoogleOauthCallback handles the user redirection after oauth with code
func (h *Handler) GoogleOauthCallback(c *gin.Context) {
	code := c.Query("code")
	// state := c.Query("state")

	ctx := c.Request.Context()

	token, err := googleConfig.Exchange(ctx, code)
	if err != nil {
		log.WithContext(ctx).WithError(err).Error(err.Error())
		e := customerror.NewInternal()

		c.JSON(e.Status(), gin.H{
			"error": e,
		})
		return
	}

	response, err := http.Get("https://www.googleapis.com/oauth2/v2/userinfo?access_token=" + token.AccessToken)
	if err != nil {
		log.WithContext(ctx).WithError(err).Error(err.Error())
		e := customerror.NewInternal()

		c.JSON(e.Status(), gin.H{
			"error": e,
		})
		return
	}

	defer response.Body.Close()

	contents := make(map[string]interface{})
	err = json.NewDecoder(response.Body).Decode(&contents)
	if err != nil {
		log.WithContext(ctx).WithError(err).Error(err.Error())
		e := customerror.NewInternal()

		c.JSON(e.Status(), gin.H{
			"error": e,
		})
		return
	}

	if email, ok := contents["email"]; ok {
		// check for email in database
		user := &models.User{
			Email: email.(string),
		}

		tokenPair, err := h.TokenController.Signin(ctx, user)
		if err != nil {
			log.WithContext(ctx).WithError(err).Error(err.Error())
			e := customerror.NewInternal()

			c.JSON(e.Status(), gin.H{
				"error": e,
			})
			return
		}

		c.JSON(http.StatusCreated,
			gin.H{
				"tokens": tokenPair,
			})

	}
}

