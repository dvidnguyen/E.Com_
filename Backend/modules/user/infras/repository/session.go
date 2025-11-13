package repository

import (
	"Backend/modules/user/domain"
	"context"

	"gorm.io/gorm"
)

const TbSessionName = "user_sessions"

type sessionDB struct {
	db *gorm.DB
}

func NewSessionDB(db *gorm.DB) sessionDB {
	return sessionDB{db: db}
}

func (repo sessionDB) Create(ctx context.Context, data *domain.Session) error {
	dto := SessionDTO{
		Id:           data.Id(),
		UserId:       data.UserId(),
		RefreshToken: data.RefreshToken(),
		AccessExpAt:  data.AccessExpAt(),
		RefreshExpAt: data.RefreshExpAt(),
	}

	return repo.db.Table(TbSessionName).Create(&dto).Error
}
