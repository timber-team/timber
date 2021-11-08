package controllers

import (
	"context"

	"github.com/gal/timber/models"
)

type UserController struct {
	Users models.UserStore
}

func NewUserController(userStore models.UserStore) *UserController {
	return &UserController{userStore}
}

func (userControl *UserController) Get(ctx context.Context, u *models.User) error {
	return userControl.Users.Get(ctx, u)
}

//update
func (userControl *UserController) Update(ctx context.Context, u *models.User, newUser *models.User) error {
	return userControl.Users.Update(ctx, u, newUser)
}