// TODO: Project Handler functions

package views

// import (
// 	"encoding/json"
// 	"net/http"
// 	"strconv"

// 	"github.com/Strum355/log"
// 	"github.com/gal/timber/models"
// 	"github.com/gal/timber/utils"
// 	"github.com/go-chi/chi"
// )

// func GetProject(w http.ResponseWriter, r *http.Request) {
// 	projId, err := strconv.Atoi(chi.URLParam(r, "id"))
// 	if err != nil {
// 		utils.RespondJSON(w, nil, "error",
// 			"failed to deccode id", http.StatusBadRequest,
// 		)

// 		log.WithContext(r.Context()).WithError(err).
// 			Info("failed to decode project id")
// 		return
// 	}
// 	proj := &models.Project{
// 		ID: projId,
// 	}

// 	if err = proj.Get(); err != nil {
// 		utils.RespondJSON(w, nil, "error",
// 			"failed to get project", http.StatusNotFound,
// 		)

// 		log.WithContext(r.Context()).WithError(err).
// 			Info("failed to fetch project by id")
// 		return
// 	}

// 	utils.RespondJSON(w, proj, "success", "", http.StatusOK)
// 	log.WithContext(r.Context()).Info("served get project")
// }

// func CreateProject(w http.ResponseWriter, r *http.Request) {
// 	var proj *models.Project

// 	if err := json.NewDecoder(r.Body).Decode(
// 		&proj,
// 	); err != nil {
// 		utils.RespondJSON(w, nil, "err",
// 			"invalid request", http.StatusBadRequest,
// 		)
// 		proj.ID = 0
// 		proj.CreatedAt = 0
// 		proj.UpdatedAt = 0

// 		projOwnerId, _ := utils.GetUID(r)
// 		projOwner := &models.User{ID: projOwnerId}
// 		projOwner.Get()

// 		proj.Owner = *projOwner

// 		if err := proj.Create(); err != nil {
// 			utils.RespondJSON(w, nil, "error",
// 				"failed to create project", http.StatusInternalServerError,
// 			)
// 			log.WithContext(r.Context()).WithError(err).Info("failed to create project")
// 			return
// 		}

// 		utils.RespondJSON(w, proj, "success", "", http.StatusOK)
// 		log.WithContext(r.Context()).Info("served create project")
// 	}
// }
