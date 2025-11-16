package usecase

import (
	"Backend/common"
	"context"

	"github.com/google/uuid"
)

type ChangePasswordUC struct {
	UserRepo UserRepository
	hasher   Hasher
}

func NewChangePasswordUC(userRepo UserRepository, hasher Hasher) *ChangePasswordUC {
	return &ChangePasswordUC{UserRepo: userRepo, hasher: hasher}
}

func (uc *ChangePasswordUC) ChangePassword(ctx context.Context, dto ChangePasswordDTO, userId uuid.UUID) error {
	user, err := uc.UserRepo.Find(ctx, userId)
	if err != nil {
		return common.ErrInternalServerError.WithDebug(err.Error())
	}
	if user == nil {
		return common.ErrInternalServerError.WithDebug(err.Error())
	}
	if ok := uc.hasher.CompareHashPassword(user.Password(), user.Salt(), dto.OldPassword); !ok {
		return common.ErrorInvalidEmailPassword.WithError("old password is incorrect")
	}
	newHashedPassword, err := uc.hasher.HashPassword(user.Salt(), dto.NewPassword)
	if err != nil {
		return common.ErrInternalServerError.WithDebug(err.Error())
	}

	uc.UserRepo.UpdatePassword(ctx, userId, newHashedPassword)
	if err != nil {
		return common.ErrInternalServerError.WithDebug(err.Error())
	}

	return nil
}
