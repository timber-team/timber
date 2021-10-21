package controllers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/Strum355/log"
	"github.com/gal/timber/models"
	"github.com/gal/timber/utils"
	"github.com/go-chi/chi"
)

type ProjectHandler struct {
	Projects models.ProjectStore
}

func NewProjectHandler(pStore models.ProjectStore) *ProjectHandler {
	return &ProjectHandler{pStore}
}

func (h *Handler) GetProject(w http.ResponseWriter, r *http.Request) {
	projId, err := strconv.Atoi(chi.URLParam(r, "id"))
	if err != nil {
		utils.RespondJSON(w, nil, "error",
			"failed to deccode id", http.StatusBadRequest,
		)

		log.WithContext(r.Context()).WithError(err).
			Info("failed to decode project id")
		return
	}
	proj := &models.Project{
		ID: projId,
	}

	if err = h.ProjectHandler.Projects.Get(proj.ID); err != nil {
		utils.RespondJSON(w, nil, "error",
			"failed to get project", http.StatusNotFound,
		)

		log.WithContext(r.Context()).WithError(err).
			Info("failed to fetch project by id")
		return
	}

	utils.RespondJSON(w, proj, "success", "", http.StatusOK)
	log.WithContext(r.Context()).Info("served get project")
}

func (h *Handler) CreateProject(w http.ResponseWriter, r *http.Request) {
	var proj *models.Project

	if err := json.NewDecoder(r.Body).Decode(
		&proj,
	); err != nil {
		utils.RespondJSON(w, nil, "err",
			"invalid request", http.StatusBadRequest,
		)
		proj.ID = 0
		proj.CreatedAt = 0
		proj.UpdatedAt = 0

		projOwnerId, _ := utils.GetUID(r)
		projOwner := &models.User{ID: projOwnerId}
		h.UserHandler.UserInfo.Get(projOwner.ID)

		proj.Owner = *projOwner

		if err := h.ProjectHandler.Projects.Create(proj); err != nil {
			utils.RespondJSON(w, nil, "error",
				"failed to create project", http.StatusInternalServerError,
			)
			log.WithContext(r.Context()).WithError(err).Info("failed to create project")
			return
		}

		utils.RespondJSON(w, proj, "success", "", http.StatusOK)
		log.WithContext(r.Context()).Info("served create project")
	}
}
