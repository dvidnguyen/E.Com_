package usecase

import (
	"Backend/modules/product/domain"
	"context"

	"github.com/google/uuid"
)

type UseCase interface {
	// Category methods
	CreateCategory(ctx context.Context, input *CreateCategoryDTO) (*CategoryDetailDTO, error)
	UpdateCategory(ctx context.Context, id uuid.UUID, input *UpdateCategoryDTO) (*CategoryDetailDTO, error)
	DeleteCategory(ctx context.Context, id uuid.UUID) error
	GetCategoryByID(ctx context.Context, id uuid.UUID) (*CategoryDetailDTO, error)
	ListCategoriesAsTree(ctx context.Context) ([]*CategoryNodeDTO, error)
	ListAllCategories(ctx context.Context) ([]*CategoryListItemDTO, error)

	// Product methods
	CreateProduct(ctx context.Context, input *CreateProductDTO) (*ProductDetailDTO, error)
	GetProductByID(ctx context.Context, id uuid.UUID) (*ProductDetailDTO, error)
	ListProducts(ctx context.Context) ([]*ProductListItemDTO, error)
}

type useCase struct {
	*CategoryUC
	*ProductUC
}

func NewUseCase(
	categoryQueryRepo CategoryQueryRepository,
	categoryCmdRepo CategoryCmdRepository,
	productQueryRepo ProductQueryRepository,
	productCmdRepo ProductCmdRepository,
	variantQueryRepo ProductVariantQueryRepository,
	variantCmdRepo ProductVariantCmdRepository,
) *useCase {
	return &useCase{
		CategoryUC: NewCategoryUC(categoryQueryRepo, categoryCmdRepo),
		ProductUC:  NewProductUC(productQueryRepo, productCmdRepo, variantQueryRepo, variantCmdRepo, categoryQueryRepo),
	}
}

type usecase struct {
	*CategoryUC
	*ProductUC
}

type CategoryRepository interface {
	CategoryQueryRepository
	CategoryCmdRepository
}

type CategoryQueryRepository interface {
	GetCategoryByID(ctx context.Context, id uuid.UUID) (*domain.Categories, error)
	ListAllCategories(ctx context.Context) ([]*domain.Categories, error)
	ListCategoriesByParentID(ctx context.Context, parentID *uuid.UUID) ([]*domain.Categories, error)
}
type CategoryCmdRepository interface {
	Create(ctx context.Context, category *domain.Categories) error
	Update(ctx context.Context, category *domain.Categories) error
	Delete(ctx context.Context, id uuid.UUID) error
}

// Product Repository Interfaces
type ProductRepository interface {
	ProductQueryRepository
	ProductCmdRepository
}
type ProductQueryRepository interface {
	GetProductByID(ctx context.Context, id uuid.UUID) (*domain.Products, error)
	ListAllProducts(ctx context.Context) ([]*domain.Products, error)
	GetProductWithVariants(ctx context.Context, id uuid.UUID) (*domain.Products, []*domain.ProductVariants, error)
}

type ProductCmdRepository interface {
	Create(ctx context.Context, product *domain.Products) error
	Update(ctx context.Context, product *domain.Products) error
	Delete(ctx context.Context, id uuid.UUID) error
}

type ProductVariantQueryRepository interface {
	GetVariantByID(ctx context.Context, id uuid.UUID) (*domain.ProductVariants, error)
	ListVariantsByProductID(ctx context.Context, productID uuid.UUID) ([]*domain.ProductVariants, error)
}

type ProductVariantCmdRepository interface {
	Create(ctx context.Context, variant *domain.ProductVariants) error
	CreateBatch(ctx context.Context, variants []*domain.ProductVariants) error
	Update(ctx context.Context, variant *domain.ProductVariants) error
	Delete(ctx context.Context, id uuid.UUID) error
}
