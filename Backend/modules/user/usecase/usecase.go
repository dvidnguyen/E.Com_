package usecase

import (
	"Backend/modules/user/domain"
	"context"

	"github.com/google/uuid"
)

type UseCase interface {
	Register(ctx context.Context, dto EmailPasswordRegistrationDTO) error
	Login(ctx context.Context, dto EmailPasswordLoginDTO) (*TokenResponseDTO, error)
	RefreshToken(ctx context.Context, refreshToken string) (*TokenResponseDTO, error)
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
	*RefreshTokenUC
}

func NewUseCase(repoUser UserRepository, repoSession SessionRepository, hasher Hasher, tokenProvider TokenProvider) *useCase {
	return &useCase{
		RegisterUC:     NewRegisterUC(repoUser, repoUser, hasher),
		LoginUC:        NewLoginUC(repoUser, repoSession, hasher, tokenProvider),
		RefreshTokenUC: NewRefreshTokenUC(repoUser, repoSession, tokenProvider, hasher),
	}
}

type UserRepository interface {
	UserQueryRepository
	UserCmdRepository
}
type UserQueryRepository interface {
	FindByEmail(ctx context.Context, email string) (*domain.User, error)
	Find(ctx context.Context, id uuid.UUID) (*domain.User, error)
}

type UserCmdRepository interface {
	Create(ctx context.Context, data *domain.User) error
}

type SessionRepository interface {
	SessionQueryRepository
	SessionCmdRepository
}
type SessionQueryRepository interface {
	Find(ctx context.Context, email string) (*domain.Session, error)
	FindByRefreshToken(ctx context.Context, rt string) (*domain.Session, error)
	CountSessionByUserId(ctx context.Context, userId uuid.UUID) (int64, error)
}
type SessionCmdRepository interface {
	Create(ctx context.Context, data *domain.Session) error
	Delete(ctx context.Context, id uuid.UUID) error
}
