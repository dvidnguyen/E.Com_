package repository

import (
	"Backend/modules/product/domain"
	"context"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

const TbName = "categories"

// CategoryQueryRepository implements query operations
type CategoryQueryRepository struct {
	db *gorm.DB
}

// CategoryCmdRepository implements command operations
type CategoryCmdRepository struct {
	db *gorm.DB
}

func NewCategoryQueryRepository(db *gorm.DB) *CategoryQueryRepository {
	return &CategoryQueryRepository{db: db}
}

func NewCategoryCmdRepository(db *gorm.DB) *CategoryCmdRepository {
	return &CategoryCmdRepository{db: db}
}

// Query Repository Implementation
func (repo *CategoryQueryRepository) GetCategoryByID(ctx context.Context, id uuid.UUID) (*domain.Categories, error) {
	var dto CategoryDTO
	err := repo.db.WithContext(ctx).Table(TbName).Where("id = ?", id).First(&dto).Error
	if err != nil {
		return nil, err
	}

	// Convert DTO to domain entity
	return dto.ToDomain(), nil
}

func (repo *CategoryQueryRepository) ListAllCategories(ctx context.Context) ([]*domain.Categories, error) {
	var dtos []CategoryDTO
	err := repo.db.WithContext(ctx).Table(TbName).Find(&dtos).Error
	if err != nil {
		return nil, err
	}

	// Convert DTOs to domain entities
	var categories []*domain.Categories
	for _, dto := range dtos {
		categories = append(categories, dto.ToDomain())
	}

	return categories, nil
}

func (repo *CategoryQueryRepository) ListCategoriesByParentID(ctx context.Context, parentID *uuid.UUID) ([]*domain.Categories, error) {
	var dtos []CategoryDTO
	query := repo.db.WithContext(ctx).Table(TbName)

	if parentID == nil {
		query = query.Where("category_id IS NULL")
	} else {
		query = query.Where("category_id = ?", *parentID)
	}

	err := query.Find(&dtos).Error
	if err != nil {
		return nil, err
	}

	// Convert DTOs to domain entities
	var categories []*domain.Categories
	for _, dto := range dtos {
		categories = append(categories, dto.ToDomain())
	}

	return categories, nil
}

// Command Repository Implementation
func (repo *CategoryCmdRepository) Create(ctx context.Context, category *domain.Categories) error {
	dto := FromDomain(category)
	return repo.db.WithContext(ctx).Table(TbName).Create(&dto).Error
}

func (repo *CategoryCmdRepository) Update(ctx context.Context, category *domain.Categories) error {
	dto := FromDomain(category)
	return repo.db.WithContext(ctx).Table(TbName).Where("id = ?", category.Id()).Updates(&dto).Error
}

func (repo *CategoryCmdRepository) Delete(ctx context.Context, id uuid.UUID) error {
	// Soft delete by changing status
	return repo.db.WithContext(ctx).Table(TbName).
		Where("id = ?", id).
		Update("status", domain.StatusInactive).Error
}
