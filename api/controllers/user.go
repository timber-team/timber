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

func (userController *UserController) Get(ctx context.Context, u *models.User) error {
	return userController.Users.FindByID(u)
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

// func (userControl *UserController) GetByID(ctx context.Context, id int) (*models.User, error) {
// 	u, err := userControl.Users.FindByID(id)
// 	return u, err
// }

// func (userControl *UserController) Signup(ctx context.Context, u *models.User) error {
// 	pw, err := auth.HashPassword(u.Password)
// 	if err != nil {
// 		log.WithContext(ctx).WithError(err).Error("Unable to signup user with email: " + u.Email)
// 		return customerror.NewInternal()
// 	}

// 	u.Password = pw

// 	return userControl.Users.Create(ctx, u)
// }
