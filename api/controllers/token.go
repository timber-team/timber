package controllers

import (
	"context"
	"fmt"

	"github.com/Strum355/log"
	"github.com/gal/timber/auth"
	"github.com/gal/timber/models"
	"github.com/gal/timber/utils/customerror"
	"github.com/google/uuid"
)

type TokenController struct {
	Tokens                models.TokenStore
	Users        			models.UserStore
	AuthKey               string
	AccessExpirationSecs  int64
	RefreshExpirationSecs int64
}

func NewTokenController(tStore models.TokenStore, uStore models.UserStore, authKey string, AccessExpirationSecs int64, RefreshExpirationSecs int64) *TokenController {
	return &TokenController{tStore, uStore, authKey, AccessExpirationSecs, RefreshExpirationSecs}
}

func (tokenControl *TokenController) Signin(ctx context.Context, user *models.User) (*models.TokenPair, error) {
	// if user not in db --> create user first
	if err := tokenControl.Users.FindByEmail(user); err != nil {
		tokenControl.Users.Create(user)
	}

	tokenPair, err := tokenControl.NewPairFromUser(ctx, user, "")
	if err != nil {
		return nil, err
	}
	return tokenPair, nil
}

func (tokenControl *TokenController) NewPairFromUser(ctx context.Context, u *models.User, prevTokenID string) (*models.TokenPair, error) {
	// Delete user's current refresh token if possible
	if prevTokenID != "" {
		if err := tokenControl.Tokens.DeleteRefreshToken(ctx, fmt.Sprintf("%d", u.ID), prevTokenID); err != nil {
			log.WithContext(ctx).WithError(err).Error(fmt.Sprintf("Could not delete previous refreshToken for uid: %v, tokenID: %v", u.ID, prevTokenID))

			return nil, err
		}
	}

	accessToken, err := auth.GenerateAccessToken(u, tokenControl.AuthKey, tokenControl.AccessExpirationSecs)

	if err != nil {
		log.WithContext(ctx).WithError(err).Error(fmt.Sprintf("Error generating accessToken for uid: %v", u.ID))
		return nil, customerror.NewInternal()
	}

	refreshToken, err := auth.GenerateRefreshToken(u.ID, tokenControl.AuthKey, tokenControl.RefreshExpirationSecs)

	if err != nil {
		log.WithContext(ctx).WithError(err).Error(fmt.Sprintf("Error generating refreshToken for uid: %v", u.ID))
		return nil, customerror.NewInternal()
	}

	// Set freshly generated refresh tokens to the valid token list
	if err := tokenControl.Tokens.SetRefreshToken(ctx, fmt.Sprintf("%d", u.ID), refreshToken.ID.String(), refreshToken.ExpiresIn); err != nil {
		log.WithContext(ctx).WithError(err).Error(fmt.Sprintf("Error storing tokenID for uid: %v", u.ID))
		return nil, customerror.NewInternal()
	}

	return &models.TokenPair{
		AccessToken:  models.AccessToken{SS: accessToken},
		RefreshToken: models.RefreshToken{SS: refreshToken.SS, ID: refreshToken.ID, UID: u.ID},
	}, nil
}

func (tokenControl *TokenController) Signout(ctx context.Context, uid uuid.UUID) error {
	return tokenControl.Tokens.DeleteUserRefreshTokens(ctx, uid.String())
}

func (tokenControl *TokenController) ValidateAccessToken(tokenString string) (*models.User, error) {
	claims, err := auth.ValidateAccessToken(tokenString, tokenControl.AuthKey)

	// Return unauthorized error if user verification fails
	if err != nil {
		log.WithError(err).Error("Unable to validate or parse accessToken")
		return nil, customerror.NewAuthorization("Unable to verify user from accessToken")
	}

	return claims.User, nil
}

func (tokenControl *TokenController) ValidateRefreshToken(tokenString string) (*models.RefreshToken, error) {
	// Validate the actual JWT with secret
	claims, err := auth.ValidateRefreshToken(tokenString, tokenControl.AuthKey)

	// Return unauthorized error if user verification fails
	if err != nil {
		log.WithError(err).Error(fmt.Sprintf("Unable to validate or parse refreshToken for token string: %s", tokenString))
		return nil, customerror.NewAuthorization("Unable to verify user from refreshToken")
	}

	tokenUUID, err := uuid.Parse(claims.Id)

	if err != nil {
		log.WithError(err).Error(fmt.Sprintf("Claims ID could not be parsed as UUID: %s", claims.Id))
		return nil, customerror.NewAuthorization("Unable to verify user from refreshToken")
	}

	return &models.RefreshToken{
		SS:  tokenString,
		ID:  tokenUUID,
		UID: claims.UID,
	}, nil
}
