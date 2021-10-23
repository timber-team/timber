package utils

// TODO: Refactor to work with Gin

//func RespondJSON(w http.ResponseWriter, payload interface{}, detail string, msg string, status int) {
//	w.Header().Set("Content-Type", "application/json")
//
//	data := &models.GenericResponse{
//		Detail: detail,
//		Msg:    msg,
//		Data:   payload,
//		Code:   status,
//	}
//
//	encoded, err := json.Marshal(&data)
//	if err != nil {
//		w.WriteHeader(http.StatusInternalServerError)
//		log.Println("Couldn't encode interface{} to JSON\n", err)
//		return
//	}
//
//	w.WriteHeader(status)
//	w.Write(encoded)
//}
//
//func HasAccess(r *http.Request, uid int) bool {
//	return r.Context().Value(&middlewares.AuthCtx{}).(middlewares.AuthStruct).UID == uid
//}
//
//// TODO: make safer
//func GetUID(r *http.Request) (int, error) {
//	return r.Context().Value(&middlewares.AuthCtx{}).(middlewares.AuthStruct).UID, nil
//}
