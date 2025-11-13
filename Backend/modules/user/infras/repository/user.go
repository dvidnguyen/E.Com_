package repository

import (
	"Backend/modules/user/domain"
	"context"

	"github.com/pkg/errors"
	"gorm.io/gorm"
)

const TbName = "users"

type userRepository struct {
	db *gorm.DB
}

func NewUserRepo(db *gorm.DB) userRepository {
	return userRepository{db: db}
}

func (r *userRepository) FindByEmail(ctx context.Context, email string) (*domain.User, error) {
	var dto UserDTO

	if err := r.db.Table(TbName).Where("email = ?", email).First(&dto).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, domain.ErrEmailNotFound
		}
		return nil, err
	}
	return dto.ToEntity()
}
func (r *userRepository) Create(ctx context.Context, data *domain.User) error {
	dto := UserDTO{
		Id:       data.Id(),
		Email:    data.Email(),
		Password: data.Password(),
		Salt:     data.Salt(),
		Role:     data.Role().String(),
		Phone:    data.Phone(),
	}
	if err := r.db.Table(TbName).Create(&dto).Error; err != nil {
		return err
	}
	return nil
}
