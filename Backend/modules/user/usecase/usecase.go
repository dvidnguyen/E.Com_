package usecase

import (
	"Backend/modules/user/domain"
	"context"
)

type UseCase interface {
	Register(ctx context.Context, dto EmailPasswordRegistration) error
	Login(ctx context.Context, dto EmailPasswordLogin) (*TokenResponse, error)
	//RefreshToken(ctx context.Context, refreshToken string) (*TokenResponse, error)
}

type TokenProvider interface {
	IssueToken(ctx context.Context, id, sub string) (token string, err error)
	TokenExpireInSeconds() int
	RefreshExpireInSeconds() int
}

type Hasher interface {
	RandomStr(length int) (string, error)
	HashPassword(salt, password string) (string, error)
	CompareHashPassword(hashedPassword, salt, password string) bool
}

type useCase struct {
	*RegisterUC
	*LoginUC
	//*refreshTokenUC
}

func NewUseCase(repoUser UserRepository, repoSession SessionRepository, hasher Hasher, tokenProvider TokenProvider) *useCase {
	return &useCase{
		RegisterUC: NewRegisterUC(repoUser, repoUser, hasher),
		LoginUC:    NewLoginUC(repoUser, repoSession, hasher, tokenProvider),
	}
}

type UserRepository interface {
	UserQueryRepository
	UserCmdRepository
}
type UserQueryRepository interface {
	FindByEmail(ctx context.Context, email string) (*domain.User, error)
}

type UserCmdRepository interface {
	Create(ctx context.Context, data *domain.User) error
}

type SessionRepository interface {
	Create(ctx context.Context, data *domain.Session) error
}
