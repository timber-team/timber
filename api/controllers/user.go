package controllers

import (
	"fmt"
	"net/http"
	"strconv"

	"github.com/Strum355/log"
	"github.com/gal/timber/models"
	"github.com/gal/timber/utils"
	"github.com/go-chi/chi"
)

type UserHandler struct {
	Users models.UserStore
}

func NewUserHandler(uStore models.UserStore) *UserHandler {
	return &UserHandler{uStore}
}

func (h *Handler) GetUser(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.Atoi(chi.URLParam(r, "id"))
	if err != nil {
		utils.RespondJSON(w, nil, "error", "invalid id", http.StatusBadRequest)
		log.WithContext(r.Context()).WithError(err).
			Info("failed to convert string to int")
		return
	}
	if !utils.HasAccess(r, id) {
		utils.RespondJSON(w, nil, "error",
			"unauthorized for requested content", http.StatusUnauthorized,
		)
		log.WithContext(r.Context()).Info(fmt.Sprintf("unauthorized for User %d", id))
		return
	}

	user := &models.User{ID: id}

	utils.RespondJSON(w, user, "success", "", http.StatusOK)
	log.WithContext(r.Context()).Info("Served get request for user")
}
