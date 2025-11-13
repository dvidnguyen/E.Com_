package domain

import "errors"

var (
	ErrEmailHasExisted      = errors.New("email has been existed")
	ErrInvalidEmailPassword = errors.New("invalid email and password")
	ErrEmailNotFound        = errors.New("email not found")
)
