package usecase

import (
	"Backend/common"
	"Backend/modules/user/domain"
	"context"

	"github.com/pkg/errors"
)

type RegisterUC struct {
	userQuery UserQueryRepository
	userCmd   UserCmdRepository
	hasher    Hasher
}

func NewRegisterUC(userQuery UserQueryRepository, userCmd UserCmdRepository, hasher Hasher) *RegisterUC {
	return &RegisterUC{userQuery: userQuery, userCmd: userCmd, hasher: hasher}
}
func (uc *RegisterUC) Register(ctx context.Context, dto EmailPasswordRegistrationDTO) error {
	// 1. Find User by email
	// 1.1 Found : return error (email exited)
	// 2. Generate salt
	// 3. Hash password + salt
	// 4. Create user entity

	user, err := uc.userQuery.FindByEmail(ctx, dto.Email)

	if user != nil {
		return common.ErrorInvalidEmailPassword.WithError(domain.ErrEmailHasExisted.Error())
	}

	if err != nil && errors.Is(err, common.ErrRecordNotFound) {
		return common.ErrInternalServerError.WithDebug(err.Error())
	}
	salt, err := uc.hasher.RandomStr(16)

	//fmt.Println(salt, len(salt))
	if err != nil {
		return common.ErrInternalServerError.WithDebug(err.Error())
	}

	hashedPassword, err := uc.hasher.HashPassword(salt, dto.Password)
	if err != nil {
		return common.ErrInternalServerError.WithDebug(err.Error())
	}

	userEntity, err := domain.NewUser(
		common.GenUUID(),
		dto.UserName,
		dto.Email,
		hashedPassword,
		salt,
		dto.Phone,
		domain.RoleUser,
	)
	if err != nil {
		return common.ErrInternalServerError.WithDebug(err.Error())
	}

	if err := uc.userCmd.Create(ctx, userEntity); err != nil {
		return common.ErrInternalServerError.WithDebug(err.Error())
	}

	return nil
}
