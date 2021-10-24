package controllers

import (
	"context"

	"github.com/Strum355/log"
	"github.com/gal/timber/auth"
	"github.com/gal/timber/models"
	"github.com/gal/timber/utils/customerror"
)

type UserController struct {
	Users models.UserStore
}

func NewUserController(userStore models.UserStore) *UserController {
	return &UserController{userStore}
}

func (userControl *UserController) Get(ctx context.Context, id int) (*models.User, error) {
	u, err := userControl.Users.FindByID(id)
	return u, err
}

func (userControl *UserController) Signup(ctx context.Context, u *models.User) error {
	pw, err := auth.HashPassword(u.Password)
	if err != nil {
		log.WithContext(ctx).WithError(err).Error("Unable to signup user with email: " + u.Email)
		return customerror.NewInternal()
	}

	u.Password = pw

	return userControl.Users.Create(ctx, u)
}

func (userControl *UserController) Signin(ctx context.Context, u *models.User) error {
	uFetched, err := userControl.Users.FindByEmail(u.Email)

	//	Returns NotAuthorized to the client
	if err != nil {
		return customerror.NewAuthorization("Invalid email and password combination")
	}

	// Verify the password
	match, err := auth.ComparePasswords(uFetched.Password, u.Password)

	if err != nil {
		return customerror.NewInternal()
	}

	if !match {
		return customerror.NewAuthorization("Invalid email and password combination")
	}

	*u = *uFetched

	return nil
}
