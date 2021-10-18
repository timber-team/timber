package views

import (
	"encoding/json"
	"errors"
	"fmt"
	"net/http"

	"github.com/Strum355/log"
	"github.com/go-chi/chi"
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

func PatchUser(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")

	var u *models.User

	if err := json.NewDecoder(r.Body).Decode(
		&u,
	); err != nil {
		utils.RespondJSON(w, nil, "err",
			"invalid request", http.StatusBadRequest,
		)

		log.WithContext(r.Context()).WithError(err).Info("invalid PATCH request")
		return
	}

	u.ID = id

	if err := u.Patch(); err != nil {
		utils.RespondJSON(w, nil, "error",
			"error updating user", http.StatusInternalServerError,
		)

		log.WithContext(r.Context()).WithError(err).Info(
			fmt.Sprintf("error updating user with id %s", id),
		)
		return
	}

	utils.RespondJSON(w, u, "sucess", "updated user", http.StatusOK)
	log.WithContext(r.Context()).Info(fmt.Sprintf("updated user with id %s", id))
}

func DeleteUser(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")

	user := &models.User{ID: id}
	if err := user.Delete(); err == nil {
		userAuth := &models.UserAuth{ID: id}
		if err = userAuth.Delete(); err == nil {
			utils.RespondJSON(w, nil, "success",
				"deleted user", http.StatusOK,
			)
			log.WithContext(r.Context()).Info(
				fmt.Sprintf("Deleted user with id %s", id),
			)
			return
		}
		utils.RespondJSON(w, nil, "error", "error deleting user", http.StatusInternalServerError)
		log.WithContext(r.Context()).WithError(err).Info("error deleting user")

		return
	}

	utils.RespondJSON(w, nil, "error", "error deleting user", http.StatusInternalServerError)
	log.WithContext(r.Context()).Info("error deleting userauth")
}
