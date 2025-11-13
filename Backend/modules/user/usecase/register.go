package usecase

import (
	"Backend/common"
	"Backend/modules/user/domain"
	"context"
	"fmt"

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
func (uc *RegisterUC) Register(ctx context.Context, dto EmailPasswordRegistration) error {
	// 1. Find User by email
	// 1.1 Found : return error (email exited)
	// 2. Generate salt
	// 3. Hash password + salt
	// 4. Create user entity

	user, err := uc.userQuery.FindByEmail(ctx, dto.Email)

	if user != nil {
		return domain.ErrEmailHasExisted
	}

	if err != nil && !errors.Is(err, common.ErrRecordNotFound) {
		return err
	}
	salt, err := uc.hasher.RandomStr(30)

	fmt.Println(salt, len(salt))
	if err != nil {
		return err
	}

	hashedPassword, err := uc.hasher.HashPassword(salt, dto.Password)
	if err != nil {
		return err
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
		return err
	}

	if err := uc.userCmd.Create(ctx, userEntity); err != nil {
		return err
	}

	return nil
}
