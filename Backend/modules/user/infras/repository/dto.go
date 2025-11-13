package repository

import (
	"Backend/modules/user/domain"
	"time"

	"github.com/google/uuid"
)

type UserDTO struct {
	Id       uuid.UUID
	UserName string `gorm:"column:user_name" json:"UserName"`
	Email    string `gorm:"column:email" json:"email"`
	Password string `gorm:"column:password" json:"password"`
	Salt     string `gorm:"column:salt" json:"salt"`
	Role     string `gorm:"column:role" json:"role"`
	Phone    string `gorm:"column:phone" json:"phone"`
}
type SessionDTO struct {
	Id           uuid.UUID `gorm:"column:id;"`
	UserId       uuid.UUID `gorm:"column:user_id;"`
	RefreshToken string    `gorm:"column:refresh_token;"`
	AccessExpAt  time.Time `gorm:"column:access_exp_at;"`
	RefreshExpAt time.Time `gorm:"column:refresh_exp_at;"`
}

func (dto UserDTO) ToEntity() (*domain.User, error) {
	return domain.NewUser(dto.Id, dto.UserName, dto.Email, dto.Password, dto.Salt, dto.Phone, domain.GetRole(dto.Role))
}
func (dto SessionDTO) ToEntity() (*domain.Session, error) {
	return domain.NewSession(dto.Id, dto.UserId, dto.RefreshToken, dto.AccessExpAt, dto.RefreshExpAt), nil
}
