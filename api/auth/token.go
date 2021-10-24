package auth

import (
	"fmt"
	"time"

	"github.com/gal/timber/models"

	"github.com/dgrijalva/jwt-go"
	"github.com/google/uuid"
)

type AccessTokenCustomClaims struct {
	User *models.User `json:"user"`
	jwt.StandardClaims
}

func GenerateAccessToken(u *models.User, key string, exp int64) (string, error) {
	currentTime := time.Now()
	tokenExp := currentTime.Add(time.Duration(exp))

	claims := AccessTokenCustomClaims{
		User: u,
		StandardClaims: jwt.StandardClaims{
			IssuedAt:  currentTime.Unix(),
			ExpiresAt: tokenExp.Unix(),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	ss, err := token.SignedString([]byte(key))

	if err != nil {
		return "", err
	}

	return ss, nil
}

type RefreshTokenData struct {
	SS        string
	ID        uuid.UUID
	ExpiresIn time.Duration
}

type RefreshTokenCustomClaims struct {
	UID int `json:"uid"`
	jwt.StandardClaims
}

func GenerateRefreshToken(uid int, key string, exp int64) (*RefreshTokenData, error) {
	currentTime := time.Now()
	tokenExp := currentTime.Add(time.Duration(exp))
	tokenID, err := uuid.NewRandom()

	if err != nil {
		return nil, err
	}

	claims := RefreshTokenCustomClaims{
		UID: uid,
		StandardClaims: jwt.StandardClaims{
			IssuedAt:  currentTime.Unix(),
			ExpiresAt: tokenExp.Unix(),
			Id:        tokenID.String(),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	ss, err := token.SignedString([]byte(key))

	if err != nil {
		return nil, err
	}

	return &RefreshTokenData{
		SS:        ss,
		ID:        tokenID,
		ExpiresIn: tokenExp.Sub(currentTime),
	}, nil
}

func ValidateAccessToken(tokenString string, key string) (*AccessTokenCustomClaims, error) {
	claims := &AccessTokenCustomClaims{}

	token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
		return []byte(key), nil
	})

	if err != nil {
		return nil, err
	}

	if !token.Valid {
		return nil, fmt.Errorf("ID token is invalid")
	}

	claims, ok := token.Claims.(*AccessTokenCustomClaims)

	if !ok {
		return nil, fmt.Errorf("ID token is valid but failed to parse claims")
	}

	return claims, nil
}

func ValidateRefreshToken(tokenString string, key string) (*RefreshTokenCustomClaims, error) {
	claims := &RefreshTokenCustomClaims{}

	token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
		return []byte(key), nil
	})

	if err != nil {
		return nil, err
	}

	if !token.Valid {
		return nil, fmt.Errorf("refresh token is invalid")
	}

	claims, ok := token.Claims.(*RefreshTokenCustomClaims)

	if !ok {
		return nil, fmt.Errorf("refresh token is valid but failed to parse claims")
	}

	return claims, nil
}
