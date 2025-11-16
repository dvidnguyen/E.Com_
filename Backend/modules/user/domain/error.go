package domain

import "errors"

var (
	ErrEmailHasExisted        = errors.New("email has been existed")
	ErrInvalidEmailPassword   = errors.New("invalid email and password")
	ErrEmailNotFound          = errors.New("email not found")
	ErrInvalidRole            = errors.New("invalid role")
	ErrInvalidToken           = errors.New("invalid token")
	ErrUserBanned             = errors.New("user banned")
	ErrGeneratingSalt         = errors.New("failed to generate salt")
	ErrHasingPassword         = errors.New("failed to hash password")
	ErrSendEmail              = errors.New("failed to send email")
	ErrRefreshTokenHasExpired = errors.New("refresh token has expired")
	ErrSpamRequest            = errors.New("spam request")
	ErrUserNotVerified        = errors.New("user not verified")
)
