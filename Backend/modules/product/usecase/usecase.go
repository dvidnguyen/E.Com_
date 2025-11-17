package usecase

import (
	"Backend/modules/product/domain"
	"context"

	"github.com/google/uuid"
)

type UseCase interface {
	CreateCategory(ctx context.Context, input *CreateCategoryDTO) (*CategoryDetailDTO, error)
	UpdateCategory(ctx context.Context, input UpdateCategoryDTO) (*CategoryDetailDTO, error)
	DeleteCategory(ctx context.Context, id uuid.UUID) error
	GetCategoryByID(ctx context.Context, id uuid.UUID) (*CategoryDetailDTO, error)
	ListCategoriesAsTree(ctx context.Context) ([]*CategoryNodeDTO, error)
	ListAllCategories(ctx context.Context) ([]*CategoryListItemDTO, error)
}
type usecase struct {
	*CategoryUC
}

func NewUsecase(categoryUC *CategoryUC, repoCategory CategoryRepository) *usecase {
	return &usecase{CategoryUC: NewCategoryUC(repoCategory, repoCategory)}
}

type CategoryRepository interface {
	CategoryQueryRepository
	CategoryCmdRepository
}

type CategoryQueryRepository interface {
	// GetCategoryByID tìm một danh mục theo ID
	GetCategoryByID(ctx context.Context, id uuid.UUID) (*domain.Categories, error)

	// ListAllCategories trả về tất cả danh mục (dạng phẳng)
	ListAllCategories(ctx context.Context) ([]*domain.Categories, error)

	// ListCategoriesByParentID trả về danh mục con của một parent
	ListCategoriesByParentID(ctx context.Context, parentID *uuid.UUID) ([]*domain.Categories, error)
}
type CategoryCmdRepository interface {
	// Create tạo một danh mục mới
	Create(ctx context.Context, category *domain.Categories) error

	// Update cập nhật thông tin một danh mục
	Update(ctx context.Context, category *domain.Categories) error

	// Delete xóa một danh mục (soft delete - đổi status)
	Delete(ctx context.Context, id uuid.UUID) error
}
