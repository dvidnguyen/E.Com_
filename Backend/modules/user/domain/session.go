package domain

import (
	"time"

	"github.com/google/uuid"
)

type Session struct {
	id           uuid.UUID
	userId       uuid.UUID
	refreshToken string
	accessExpAt  time.Time
	refreshExpAt time.Time
}

func (s *Session) Id() uuid.UUID {
	return s.id
}

func (s *Session) SetId(id uuid.UUID) {
	s.id = id
}

func (s *Session) UserId() uuid.UUID {
	return s.userId
}

func (s *Session) SetUserId(userId uuid.UUID) {
	s.userId = userId
}

func (s *Session) RefreshToken() string {
	return s.refreshToken
}

func (s *Session) SetRefreshToken(refreshToken string) {
	s.refreshToken = refreshToken
}

func (s *Session) AccessExpAt() time.Time {
	return s.accessExpAt
}

func (s *Session) SetAccessExpAt(accessExpAt time.Time) {
	s.accessExpAt = accessExpAt
}

func (s *Session) RefreshExpAt() time.Time {
	return s.refreshExpAt
}

func (s *Session) SetRefreshExpAt(refreshExpAt time.Time) {
	s.refreshExpAt = refreshExpAt
}

func NewSession(id uuid.UUID, userId uuid.UUID, refreshToken string, accessExpAt time.Time, refreshExpAt time.Time) *Session {
	return &Session{id: id, userId: userId, refreshToken: refreshToken, accessExpAt: accessExpAt, refreshExpAt: refreshExpAt}
}
