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

// Signin Handler
func (h *Handler) Signin(c *gin.Context) {

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

// GoogleOAuthCallback handles the user redirection after oauth with code
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

// import (
// 	"encoding/json"
// 	"net/http"
// 	"strings"

// 	"github.com/Strum355/log"
// 	"github.com/gal/timber/auth"
// 	"github.com/gal/timber/middlewares"
// 	"github.com/gal/timber/models"
// 	"github.com/gal/timber/utils"
// )

// type loginDetails struct {
// 	Username string
// 	Email    string
// 	Password string
// }

// func InspectAccessToken(w http.ResponseWriter, r *http.Request) {
// 	split := strings.Split(r.Header.Get("Authorization"), " ")
// 	if len(split) < 2 {
// 		w.WriteHeader(http.StatusUnauthorized)
// 		return
// 	}
// 	tokenString := strings.Split(r.Header.Get("Authorization"), " ")[1]

// 	_, uid, err := auth.CheckAccessToken(tokenString)
// 	if err != nil {
// 		log.WithError(err).Error("error checking access token")
// 		w.WriteHeader(http.StatusInternalServerError)
// 		return
// 	}
// 	if r.Method == "GET" {
// 		utils.RespondJSON(w, uid, "success", "", http.StatusOK)
// 	} else {
// 		w.WriteHeader(http.StatusOK)
// 	}
// }

// func InspectRefreshToken(w http.ResponseWriter, r *http.Request) {
// 	split := strings.Split(r.Header.Get("Authorization"), " ")
// 	if len(split) < 2 {
// 		w.WriteHeader(http.StatusUnauthorized)
// 		return
// 	}
// 	tokenString := strings.Split(r.Header.Get("Authorization"), " ")[1]

// 	uid, id, err := auth.CheckRefreshToken(tokenString)
// 	if err != nil {
// 		log.WithError(err).Error("error checking access token")
// 		w.WriteHeader(http.StatusInternalServerError)
// 		return
// 	}
// 	if id == "" || uid == 0 {
// 		log.Error("invalid refresh token")
// 		utils.RespondJSON(w, nil, "error", "invalid refresh token", http.StatusUnauthorized)
// 		return
// 	}

// 	utils.RespondJSON(w, middlewares.AuthStruct{ID: id, UID: uid}, "success", "", http.StatusOK)
// }

// func CreateAccessToken(w http.ResponseWriter, r *http.Request) {
// 	split := strings.Split(r.Header.Get("Authorization"), " ")
// 	if len(split) < 2 {
// 		w.WriteHeader(http.StatusUnauthorized)
// 		return
// 	}

// 	tokenString := strings.Split(r.Header.Get("Authorization"), " ")[1]

// 	_, id, err := auth.CheckRefreshToken(tokenString)
// 	if err != nil {
// 		log.WithError(err).Error("error checking access token")
// 		w.WriteHeader(http.StatusInternalServerError)
// 		return
// 	}
// 	if id == "" {
// 		utils.RespondJSON(w, nil, "error", "invalid refresh token", http.StatusUnauthorized)
// 	}

// 	_, accessToken, err := auth.GenerateAccessToken(tokenString)
// 	if err != nil {
// 		utils.RespondJSON(w, nil, "error", "failed to generate access token", http.StatusInternalServerError)
// 		return
// 	}

// 	utils.RespondJSON(w, accessToken, "success", "", http.StatusCreated)
// }

// func CreateRefreshToken(w http.ResponseWriter, r *http.Request) {
// 	var loginDetails *loginDetails
// 	var u *models.UserAuth

// 	if err := json.NewDecoder(r.Body).Decode(&loginDetails); err != nil {
// 		utils.RespondJSON(w, nil, "error", "invalid login", http.StatusBadRequest)
// 		log.WithError(err).Error("Couldn't decode json")
// 		return
// 	}

// 	if loginDetails.Email == "" && loginDetails.Username == "" {
// 		utils.RespondJSON(w, nil, "error", "invalid login", http.StatusBadRequest)
// 		log.Error("Email nor username provided")
// 		return
// 	}

// 	var err error
// 	if loginDetails.Email != "" {
// 		u = &models.UserAuth{Email: loginDetails.Email}
// 		err = u.GetByEmail()
// 	}

// 	if err != nil || u.ID == 0 {
// 		utils.RespondJSON(w, nil, "error", "failed to create token", http.StatusInternalServerError)
// 		log.WithError(err).Error("Error getting userAuth from login")
// 		return
// 	}

// 	_, tokenString, err := auth.GenerateRefreshToken(u.ID)
// 	if err != nil {
// 		utils.RespondJSON(w, nil, "error", "failed to create token", http.StatusInternalServerError)
// 		log.WithError(err).Error("Failed to create refresh token")
// 		return
// 	}

// 	utils.RespondJSON(w, tokenString, "success", "", http.StatusCreated)
// }

// func DeleteAccessToken(w http.ResponseWriter, r *http.Request){

// }
