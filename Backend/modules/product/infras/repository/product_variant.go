package repository

import (
	"Backend/modules/product/domain"
	"context"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

const VariantTbName = "product_variants"

// ProductVariantQueryRepository implements query operations
type ProductVariantQueryRepository struct {
	db *gorm.DB
}

// ProductVariantCmdRepository implements command operations
type ProductVariantCmdRepository struct {
	db *gorm.DB
}

func NewProductVariantQueryRepository(db *gorm.DB) *ProductVariantQueryRepository {
	return &ProductVariantQueryRepository{db: db}
}

func NewProductVariantCmdRepository(db *gorm.DB) *ProductVariantCmdRepository {
	return &ProductVariantCmdRepository{db: db}
}

// Query Repository Implementation
func (repo *ProductVariantQueryRepository) GetVariantByID(ctx context.Context, id uuid.UUID) (*domain.ProductVariants, error) {
	var dto ProductVariantDTO
	err := repo.db.WithContext(ctx).Table(VariantTbName).Where("id = ?", id).First(&dto).Error
	if err != nil {
		return nil, err
	}

	return dto.ToDomain(), nil
}

func (repo *ProductVariantQueryRepository) ListVariantsByProductID(ctx context.Context, productID uuid.UUID) ([]*domain.ProductVariants, error) {
	var dtos []ProductVariantDTO
	err := repo.db.WithContext(ctx).Table(VariantTbName).
		Where("product_id = ?", productID).Find(&dtos).Error
	if err != nil {
		return nil, err
	}

	var variants []*domain.ProductVariants
	for _, dto := range dtos {
		variants = append(variants, dto.ToDomain())
	}

	return variants, nil
}

// Command Repository Implementation
func (repo *ProductVariantCmdRepository) Create(ctx context.Context, variant *domain.ProductVariants) error {
	dto := FromVariantDomain(variant)
	return repo.db.WithContext(ctx).Table(VariantTbName).Create(&dto).Error
}

func (repo *ProductVariantCmdRepository) CreateBatch(ctx context.Context, variants []*domain.ProductVariants) error {
	var dtos []ProductVariantDTO
	for _, variant := range variants {
		dtos = append(dtos, FromVariantDomain(variant))
	}

	return repo.db.WithContext(ctx).Table(VariantTbName).Create(&dtos).Error
}

func (repo *ProductVariantCmdRepository) Update(ctx context.Context, variant *domain.ProductVariants) error {
	dto := FromVariantDomain(variant)
	return repo.db.WithContext(ctx).Table(VariantTbName).
		Where("id = ?", variant.Id()).Updates(&dto).Error
}

func (repo *ProductVariantCmdRepository) Delete(ctx context.Context, id uuid.UUID) error {
	return repo.db.WithContext(ctx).Table(VariantTbName).
		Where("id = ?", id).
		Update("activity_status", "inactive").Error
}
