package usecase

import (
	"Backend/common"
	"Backend/modules/user/domain"
	"context"
	"time"

	"github.com/pkg/errors"
)

type LoginUC struct {
	userRepo      UserRepository
	sessionRepo   SessionRepository
	hasher        Hasher
	tokenProvider TokenProvider
}

func NewLoginUC(userRepo UserRepository, sessionRepo SessionRepository, hasher Hasher, tokenProvider TokenProvider) *LoginUC {
	return &LoginUC{userRepo: userRepo, sessionRepo: sessionRepo, hasher: hasher, tokenProvider: tokenProvider}
}

func (uc *LoginUC) Login(ctx context.Context, dto EmailPasswordLoginDTO) (*TokenResponseDTO, error) {
	// 1.Find user by email
	user, err := uc.userRepo.FindByEmail(ctx, dto.Email)

	if err != nil {
		if errors.Is(err, common.ErrRecordNotFound) {
			return nil, common.ErrBadRequest.WithError(domain.ErrInvalidEmailPassword.Error())
		}
		return nil, err // repo đã chuẩn hóa lỗi rồi
	}

	//count, err := uc.sessionRepo.CountSessionByUserId(ctx, user.Id())
	//if err != nil {
	//	return nil, err
	//}
	//if count < 0 || count > 5 {
	//	return nil, domain.ErrTooManyLogin
	//
	//}

	// 2. hash password with password + salt
	if ok := uc.hasher.CompareHashPassword(user.Password(), user.Salt(), dto.Password); !ok {
		return nil, common.ErrBadRequest.WithDebug(domain.ErrInvalidEmailPassword.Error())
	}

	// 3. issue token
	userID := user.Id()
	sessionID := common.GenUUID()

	accessToken, err := uc.tokenProvider.IssueToken(ctx, sessionID.String(), userID.String())
	if err != nil {
		return nil, common.ErrInternalServerError.WithDebug(err.Error())
	}

	// 4. Insert session in repo
	refreshToken, _ := uc.hasher.RandomStr(16)
	tokenExpAt := time.Now().UTC().Add(time.Second * time.Duration(uc.tokenProvider.TokenExpireInSeconds()))
	refreshExpAt := time.Now().UTC().Add(time.Second * time.Duration(uc.tokenProvider.RefreshExpireInSeconds()))
	session := domain.NewSession(sessionID, userID, refreshToken, tokenExpAt, refreshExpAt)

	if err := uc.sessionRepo.Create(ctx, session); err != nil {
		return nil, common.ErrInternalServerError.WithDebug(err.Error())
	}
	// 5. return token

	return &TokenResponseDTO{
		AccessToken:           accessToken,
		AccessTokenExpiresAt:  uc.tokenProvider.TokenExpireInSeconds(),
		RefreshToken:          refreshToken,
		RefreshTokenExpiresAt: uc.tokenProvider.RefreshExpireInSeconds(),
	}, nil

}
