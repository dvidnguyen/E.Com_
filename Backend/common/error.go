package common

import "github.com/pkg/errors"

var ErrRecordNotFound = errors.New("record not found")

var ErrMissingAccessToken = errors.New("missing access token")
