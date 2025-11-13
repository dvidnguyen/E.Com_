package common

import (
	"time"

	"github.com/google/uuid"
)

type BaseModel struct {
	Id        uuid.UUID `gorm:"column:id;" json:"id"`
	CreatedAt time.Time `gorm:"column:created_at" json:"created_at"`
	UpdatedAt time.Time `gorm:"column:updated_at" json:"updated_at"`
}

func GenNewModel() BaseModel {
	now := time.Now().UTC()
	newId, _ := uuid.NewV7()

	return BaseModel{
		Id:        newId,
		CreatedAt: now,
		UpdatedAt: now,
	}
}

func GenUUID() uuid.UUID {
	newId, _ := uuid.NewV7()
	return newId
}
func ParseUUID(s string) uuid.UUID {
	return uuid.MustParse(s)
}
