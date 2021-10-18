package middlewares

import (
	"context"
	"net/http"
	"strings"

	"github.com/Strum355/log"
	"github.com/gal/timber/auth"
)

type AuthCtx struct{}

var Auth AuthCtx

type AuthStruct struct {
	ID  string // refresh token id
	UID int    // userID
}

func CheckTokens(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		parts := strings.Split(r.Header.Get("Authorization"), " ")

		// if no authentication provided
		if len(parts) < 2 {
			next.ServeHTTP(w, r.WithContext(context.WithValue(r.Context(), Auth, AuthStruct{"", 0})))
			return
		} else {
			if len(parts) >= 2 {
				id, uid, err := auth.CheckAccessToken(parts[1])
				next.ServeHTTP(w, r.WithContext(context.WithValue(r.Context(), Auth, AuthStruct{id, uid})))
				if err != nil {
					log.WithError(err).Info("error checking access token")
				}
				return
			}
		}

		next.ServeHTTP(w, r.WithContext(context.WithValue(r.Context(), Auth, 0)))
	})
}
