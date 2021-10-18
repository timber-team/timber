package views

import (
	"encoding/json"
	"errors"
	"net/http"

	"github.com/Strum355/log"
	"gorm.io/gorm"

	"github.com/gal/timber/models"
	"github.com/gal/timber/utils"
)

func GetUser(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
}

func CreateUser(w http.ResponseWriter, r *http.Request) {
	var loginDetails *models.LoginDetails
	var u *models.User

	if err := json.NewDecoder(r.Body).Decode(
		&loginDetails,
	); err != nil {
		utils.RespondJSON(w, nil, "err",
			"invalid request", http.StatusBadRequest,
		)

		log.WithContext(r.Context()).Info("invalid login request")
		return
	}

	if loginDetails.Email == "" && loginDetails.Username == "" ||
		loginDetails.Password == "" {
		utils.RespondJSON(w, nil, "err",
			"invalid request", http.StatusBadRequest,
		)

		log.WithContext(r.Context()).Info("invalid login request")
		return
	}

	u = &models.User{
		Username: loginDetails.Username,
		Email:    loginDetails.Email,
	}

	if err := u.GetByEmail(); err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			if err := u.Create(); err != nil {
				utils.RespondJSON(w, nil, "error",
					"error creating user", http.StatusInternalServerError,
				)

				log.WithContext(r.Context()).
					WithError(err).Info("error creating user")

				return
			}
			// TODO make sure to delete user object if userauth fails
			hashed, err := utils.HashPassword([]byte(loginDetails.Password))
			if err != nil {
				utils.RespondJSON(w, nil, "error",
					"error creating user", http.StatusInternalServerError,
				)

				log.WithContext(r.Context()).
					WithError(err).Info("error creating password hash")

				return
			}

			if u.ID == "" {
				utils.RespondJSON(w, nil, "error",
					"error creating user", http.StatusInternalServerError,
				)

				log.WithContext(r.Context()).
					Info("error creating user")

				return
			}

			userAuth := &models.UserAuth{
				ID:      u.ID,
				Email:   u.Email,
				Hash:    hashed,
				Enabled: false,
			}

			if err = userAuth.Create(); err != nil {
				utils.RespondJSON(w, nil, "error",
					"error creating user", http.StatusInternalServerError,
				)

				log.WithContext(r.Context()).WithError(err).
					Info("error creating userAuth")
				// TODO delete user object
				return
			}

			utils.RespondJSON(w, u, "success", "", http.StatusCreated)
		} else {
			utils.RespondJSON(w, nil, "error",
				"error creating user", http.StatusInternalServerError,
			)

			log.WithContext(r.Context()).
				WithError(err).Info("error creating user")

			return
		}
	}

	utils.RespondJSON(w, nil, "error",
		"user with email already exists", http.StatusConflict,
	)
	log.WithContext(r.Context()).
		Info("user with email already exists")
}
