package usecase

import (
	"Backend/common"
	"Backend/modules/user/domain"
	"context"
	"time"

	"github.com/pkg/errors"
)

type RefreshTokenUC struct {
	userRepo      UserQueryRepository
	sessionRepo   SessionRepository
	tokenProvider TokenProvider
	hasher        Hasher
}

func NewRefreshTokenUC(userRepo UserQueryRepository, sessionRepo SessionRepository, tokenProvider TokenProvider, hasher Hasher) *RefreshTokenUC {
	return &RefreshTokenUC{userRepo: userRepo, sessionRepo: sessionRepo, tokenProvider: tokenProvider, hasher: hasher}
}

func (uc RefreshTokenUC) RefreshToken(ctx context.Context, refreshToken string) (*TokenResponseDTO, error) {
	session, err := uc.sessionRepo.FindByRefreshToken(ctx, refreshToken)
	if err != nil {
		return nil, err
	}
	if session.RefreshExpAt().UnixNano() < time.Now().UTC().UnixNano() {
		return nil, errors.New("refresh token expired")
	}

	user, err := uc.userRepo.Find(ctx, session.UserId())
	if err != nil {
		return nil, err
	}
	userId := user.Id()
	sessionId := common.GenUUID()

	accessToken, err := uc.tokenProvider.IssueToken(ctx, sessionId.String(), userId.String())

	if err != nil {
		return nil, err
	}
	// 4. Insert session into DB
	newRefreshToken, _ := uc.hasher.RandomStr(16)
	tokenExpAt := time.Now().UTC().Add(time.Second * time.Duration(uc.tokenProvider.TokenExpireInSeconds()))
	refreshExpAt := time.Now().UTC().Add(time.Second * time.Duration(uc.tokenProvider.RefreshExpireInSeconds()))

	newSession := domain.NewSession(sessionId, userId, newRefreshToken, tokenExpAt, refreshExpAt)

	if err := uc.sessionRepo.Create(ctx, newSession); err != nil {
		return nil, err
	}
	go func() {
		_ = uc.sessionRepo.Delete(ctx, session.Id())
	}()

	return &TokenResponseDTO{
		AccessToken:           accessToken,
		AccessTokenExpiresAt:  uc.tokenProvider.TokenExpireInSeconds(),
		RefreshToken:          newRefreshToken,
		RefreshTokenExpiresAt: uc.tokenProvider.RefreshExpireInSeconds(),
	}, nil
}
