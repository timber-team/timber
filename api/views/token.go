// TODO: Token Handler functions

package views

import (
	"encoding/json"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/spf13/viper"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/github"
	"golang.org/x/oauth2/google"

	"github.com/gal/timber/models"
	"github.com/gal/timber/utils"
	"github.com/gal/timber/utils/customresponse"
)

var googleConfig *oauth2.Config
var githubConfig *oauth2.Config

func InitOauth() {
	googleConfig = &oauth2.Config{
		ClientID:     viper.GetString("oauth.google.id"),
		ClientSecret: viper.GetString("oauth.google.secret"),
		RedirectURL:  "http://localhost/oauth/callback/google",
		Scopes: []string{
			"https://www.googleapis.com/auth/userinfo.email",
		},
		Endpoint: google.Endpoint,
	}

	githubConfig = &oauth2.Config{
		ClientID:     viper.GetString("oauth.github.id"),
		ClientSecret: viper.GetString("oauth.github.secret"),
		RedirectURL:  "http://localhost/oauth/callback/github",
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
		// log.WithContext(ctx).WithError(err).Error(err.Error())
		// e := customresponse.NewInternal()

		// c.JSON(e.Status(), gin.H{
		// 	"error": e,
		// })
		utils.Respond(c, customresponse.NewInternal(), nil)
		return
	}

	response, err := http.Get("https://www.googleapis.com/oauth2/v2/userinfo?access_token=" + token.AccessToken)
	if err != nil {
		// log.WithContext(ctx).WithError(err).Error(err.Error())
		// e := customresponse.NewInternal()

		// c.JSON(e.Status(), gin.H{
		// 	"error": e,
		// })
		utils.Respond(c, customresponse.NewInternal(), nil)
		return
	}

	defer response.Body.Close()

	contents := make(map[string]interface{})
	err = json.NewDecoder(response.Body).Decode(&contents)
	if err != nil {
		// log.WithContext(ctx).WithError(err).Error(err.Error())
		// e := customresponse.NewInternal()

		// c.JSON(e.Status(), gin.H{
		// 	"error": e,
		// })
		utils.Respond(c, customresponse.NewInternal(), nil)
		return
	}

	if email, ok := contents["email"]; ok {
		// check for email in database
		user := &models.User{
			Email: email.(string),
		}

		tokenPair, err := h.TokenController.Signin(ctx, user)
		if err != nil {
			// log.WithContext(ctx).WithError(err).Error(err.Error())
			// e := customresponse.NewInternal()

			// c.JSON(e.Status(), gin.H{
			// 	"error": e,
			// })
			utils.Respond(c, customresponse.NewInternal(), nil)
			return
		}

		// c.JSON(http.StatusCreated,
		// 	gin.H{
		// 		"tokens": tokenPair,
		// 	})
		utils.Respond(c, customresponse.NewCreated(), tokenPair)
		return
	}
	utils.Respond(c, customresponse.NewInternal(), nil)
}

// GithubOauthCallback handles the user redirection after oauth with code
func (h *Handler) GithubOauthCallback(c *gin.Context) {
	code := c.Query("code")

	// TODO redirect from state
	// state := c.Query("state")

	ctx := c.Request.Context()
	token, err := githubConfig.Exchange(ctx, code)
	if err != nil {
		utils.Respond(c, customresponse.NewInternal(), nil)
		return
	}

	apiRequest, err := http.NewRequest("GET", "https://api.github.com/user/emails", nil)
	if err != nil {
		utils.Respond(c, customresponse.NewInternal(), nil)
		return
	}

	apiRequest.Header.Add("Authorization", "token "+token.AccessToken)
	client := http.Client{}
	apiResponse, err := client.Do(apiRequest)
	if err != nil {
		utils.Respond(c, customresponse.NewInternal(), nil)
		return
	}

	defer apiResponse.Body.Close()

	contents := make([]models.GithubEmail, 1)
	err = json.NewDecoder(apiResponse.Body).Decode(&contents)
	if err != nil {
		// log.WithContext(ctx).WithError(err).Error(err.Error())
		// e := customresponse.NewInternal()

		// c.JSON(e.Status(), gin.H{
		// 	"error": e,
		// })
		utils.Respond(c, customresponse.NewInternal(), nil)
		return
	}

	for _, githubEmail := range contents {
		if githubEmail.Primary && githubEmail.Verified {
			user := &models.User{
				Email: githubEmail.Email,
			}

			tokenPair, err := h.TokenController.Signin(ctx, user)
			if err != nil {
				// log.WithContext(ctx).WithError(err).Error(err.Error())
				// e := customresponse.NewInternal()

				// c.JSON(e.Status(), gin.H{
				// 	"error": e,
				// })
				utils.Respond(c, customresponse.NewInternal(), nil)
				return
			}

			// c.JSON(http.StatusCreated,
			// 	gin.H{
			// 		"tokens": tokenPair,
			// 	})
			utils.Respond(c, customresponse.NewCreated(), tokenPair)
		}
	}
}

type tokensRequest struct {
	RefreshToken string `json:"refresh_token" binding:"required"`
}

// Tokens handler, generates a new tokenPair for the user, then responds with the new tokenPair
func (h *Handler) Tokens(c *gin.Context) {
	var req tokensRequest
	if ok := utils.BindData(c, &req); !ok {
		return
	}

	ctx := c.Request.Context()

	// Verify refresh JWT
	refreshToken, err := h.TokenController.ValidateRefreshToken(req.RefreshToken)
	if err != nil {
		utils.Respond(c, customresponse.NewInternal(), nil)
		return
	}

	// Get user from refresh token UID
	user, err := h.UserController.Users.GetByID(ctx, refreshToken.UID)
	if err != nil {
		utils.Respond(c, customresponse.NewInternal(), nil)
		return
	}

	// Create fresh pair of tokens (h.TokenController.NewPairFromUser())
	tokenPair, err := h.TokenController.NewPairFromUser(ctx, user, refreshToken.ID.String())
	if err != nil {
		utils.Respond(c, customresponse.NewInternal(), nil)
		return
	}

	utils.Respond(c, customresponse.NewCreated(), tokenPair)
}

func (h *Handler) Delete(c *gin.Context) {
	ctx := c.Request.Context()
	user := &models.User{}
	if ok := utils.BindData(c, user); !ok {
		return
	}

	err := h.UserController.Users.Delete(ctx, user)
	if err != nil {
		utils.Respond(c, customresponse.NewInternal(), nil)
		return
	}

	utils.Respond(c, customresponse.NewOK(), nil)
}
