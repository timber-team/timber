// TODO: Token Handler functions

package views

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/Strum355/log"
	"github.com/gin-gonic/gin"
	"github.com/spf13/viper"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/github"
	"golang.org/x/oauth2/google"

	"github.com/gal/timber/models"
	"github.com/gal/timber/utils/customerror"
)

var googleConfig *oauth2.Config
var githubConfig *oauth2.Config

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

	githubConfig = &oauth2.Config{
		ClientID:     viper.GetString("oauth.github.id"),
		ClientSecret: viper.GetString("oauth.github.secret"),
		RedirectURL:  "http://" + "localhost:8080" + "/auth/callback/github",
		Scopes: []string{
			"user:email",
		},
		Endpoint: github.Endpoint,
	}
}

// SignIn Handler
func (h *Handler) SignIn(c *gin.Context) {
	// TODO ensure redirect_url's domain same zas $API_DOMAIN

	// based off provider, use different redirect
	switch c.Param("provider") {
	case "google":
		c.Redirect(http.StatusTemporaryRedirect, googleConfig.AuthCodeURL(c.Query("redirect_url")))
	case "github":
		c.Redirect(http.StatusTemporaryRedirect, githubConfig.AuthCodeURL(c.Query("redirect_url")))
	default:
		c.AbortWithStatus(http.StatusNotFound)
	}
}

// OauthCallback generic handler for callbacks from OAuth providers
func (h *Handler) OauthCallback(c *gin.Context) {
	// based off provider, use different redirect
	switch c.Param("provider") {
	case "google":
		h.GoogleOauthCallback(c)
	case "github":
		h.GithubOauthCallback(c)
	default:
		c.AbortWithStatus(http.StatusInternalServerError)
	}
}

// GoogleOauthCallback handles the user redirection after oauth with code
func (h *Handler) GoogleOauthCallback(c *gin.Context) {
	code := c.Query("code")
	// TODO redirect from state
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

// GithubOauthCallback handles the user redirection after oauth with code
func (h *Handler) GithubOauthCallback(c *gin.Context) {
	code := c.Query("code")

	// TODO redirect from state
	// state := c.Query("state")

	ctx := c.Request.Context()
	token, err := githubConfig.Exchange(ctx, code)
	if err != nil {
		fmt.Println("bruh")
		return
	}

	apiRequest, err := http.NewRequest("GET", "https://api.github.com/user/emails", nil)
	if err != nil {
		c.AbortWithStatus(http.StatusInternalServerError)
		return
	}

	apiRequest.Header.Add("Authorization", "token "+token.AccessToken)
	client := http.Client{}
	apiResponse, err := client.Do(apiRequest)
	if err != nil {
		c.AbortWithStatus(http.StatusInternalServerError)
	}

	defer apiResponse.Body.Close()

	contents := make([]models.GithubEmail, 1)
	err = json.NewDecoder(apiResponse.Body).Decode(&contents)
	if err != nil {
		log.WithContext(ctx).WithError(err).Error(err.Error())
		e := customerror.NewInternal()

		c.JSON(e.Status(), gin.H{
			"error": e,
		})
		return
	}

	for _, githubEmail := range contents {
		if githubEmail.Primary && githubEmail.Verified {
			user := &models.User{
				Email: githubEmail.Email,
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
}
