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

func (userController *UserController) GetByEmail(ctx context.Context, u *models.User) error {
	return userController.Users.FindByEmail(u)
}

func (userController *UserController) Save(ctx context.Context, u *models.User) error {
	return userController.Users.Patch(u)
}

func (userController *UserController) Delete(ctx context.Context, u *models.User) error {
	return userController.Users.Delete(u)
}
