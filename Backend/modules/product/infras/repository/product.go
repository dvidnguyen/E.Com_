package repository

import (
	"Backend/modules/product/domain"
	"context"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

const ProductTbName = "products"

// ProductQueryRepository implements query operations
type ProductQueryRepository struct {
	db *gorm.DB
}

// ProductCmdRepository implements command operations
type ProductCmdRepository struct {
	db *gorm.DB
}

func NewProductQueryRepository(db *gorm.DB) *ProductQueryRepository {
	return &ProductQueryRepository{db: db}
}

func NewProductCmdRepository(db *gorm.DB) *ProductCmdRepository {
	return &ProductCmdRepository{db: db}
}

// Query Repository Implementation
func (repo *ProductQueryRepository) GetProductByID(ctx context.Context, id uuid.UUID) (*domain.Products, error) {
	var dto ProductDTO
	err := repo.db.WithContext(ctx).Table(ProductTbName).Where("id = ?", id).First(&dto).Error
	if err != nil {
		return nil, err
	}

	return dto.ToDomain(), nil
}

func (repo *ProductQueryRepository) ListAllProducts(ctx context.Context) ([]*domain.Products, error) {
	var dtos []ProductDTO
	err := repo.db.WithContext(ctx).Table(ProductTbName).Find(&dtos).Error
	if err != nil {
		return nil, err
	}

	var products []*domain.Products
	for _, dto := range dtos {
		products = append(products, dto.ToDomain())
	}

	return products, nil
}

func (repo *ProductQueryRepository) GetProductWithVariants(ctx context.Context, id uuid.UUID) (*domain.Products, []*domain.ProductVariants, error) {
	// Get product
	product, err := repo.GetProductByID(ctx, id)
	if err != nil {
		return nil, nil, err
	}

	// Get variants
	var variantDTOs []ProductVariantDTO
	err = repo.db.WithContext(ctx).Table("product_variants").
		Where("product_id = ?", id).Find(&variantDTOs).Error
	if err != nil {
		return product, nil, err
	}

	var variants []*domain.ProductVariants
	for _, dto := range variantDTOs {
		variants = append(variants, dto.ToDomain())
	}

	return product, variants, nil
}

// Command Repository Implementation
func (repo *ProductCmdRepository) Create(ctx context.Context, product *domain.Products) error {
	dto := FromProductDomain(product)
	return repo.db.WithContext(ctx).Table(ProductTbName).Create(&dto).Error
}

func (repo *ProductCmdRepository) Update(ctx context.Context, product *domain.Products) error {
	dto := FromProductDomain(product)
	return repo.db.WithContext(ctx).Table(ProductTbName).
		Where("id = ?", product.Id()).Updates(&dto).Error
}

func (repo *ProductCmdRepository) Delete(ctx context.Context, id uuid.UUID) error {
	return repo.db.WithContext(ctx).Table(ProductTbName).
		Where("id = ?", id).
		Update("activity_status", "inactive").Error
}
