package views

import (
	"net/http"
	"strconv"

	"github.com/Strum355/log"
	"github.com/gal/timber/models"
	"github.com/gal/timber/utils"
	"github.com/go-chi/chi"
)

func GetProject(w http.ResponseWriter, r *http.Request) {
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

	if err = proj.Get(); err != nil {
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
