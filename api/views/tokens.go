// TODO: Figure out what views will be doing cause MVC definition of "views" for this doesn't apply to our situation whatsoever, and the MVC definition for "controllers" basically does all this shit that these views were doing previously

package views

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
