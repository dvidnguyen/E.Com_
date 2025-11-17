package usecase

import (
	"Backend/common"
	"Backend/modules/product/domain"
	"context"
	"strings"

	"github.com/google/uuid"
)

type CategoryUC struct {
	queryRepo CategoryQueryRepository
	cmdRepo   CategoryCmdRepository
}

func NewCategoryUC(queryRepo CategoryQueryRepository, cmdRepo CategoryCmdRepository) *CategoryUC {
	return &CategoryUC{
		queryRepo: queryRepo,
		cmdRepo:   cmdRepo,
	}
}

// GetCategoryByID lấy category theo ID
func (u *CategoryUC) GetCategoryByID(ctx context.Context, id uuid.UUID) (*CategoryDetailDTO, error) {
	category, err := u.queryRepo.GetCategoryByID(ctx, id)
	if err != nil {
		return nil, err
	}

	return &CategoryDetailDTO{
		ID:          category.Id(),
		Name:        category.Name(),
		Description: category.Description(),
		Slug:        category.Slug(),
		ImageURL:    category.ImageUrl(),
		ParentID:    category.CategoryId(),
		Status:      category.Status().String(),
		SortOrder:   category.SortOrder(),
	}, nil
}

// ListCategoriesAsTree trả về cây danh mục
func (u *CategoryUC) ListCategoriesAsTree(ctx context.Context) ([]*CategoryNodeDTO, error) {
	// Lấy tất cả categories từ repository
	categories, err := u.queryRepo.ListAllCategories(ctx)
	if err != nil {
		return nil, err
	}

	// Xây dựng tree structure từ domain entities
	return u.buildCategoryTree(categories, nil), nil
}

// ListAllCategories trả về danh sách tất cả categories (dạng phẳng)
func (u *CategoryUC) ListAllCategories(ctx context.Context) ([]*CategoryListItemDTO, error) {
	categories, err := u.queryRepo.ListAllCategories(ctx)
	if err != nil {
		return nil, err
	}

	var result []*CategoryListItemDTO
	for _, cat := range categories {
		result = append(result, &CategoryListItemDTO{
			ID:          cat.Id(),
			Name:        cat.Name(),
			Description: cat.Description(),
			Slug:        cat.Slug(),
			ImageURL:    cat.ImageUrl(),
			ParentID:    cat.CategoryId(),
			Status:      cat.Status().String(),
			SortOrder:   cat.SortOrder(),
		})
	}

	return result, nil
}

// CreateCategory tạo category mới
func (u *CategoryUC) CreateCategory(ctx context.Context, input *CreateCategoryDTO) (*CategoryDetailDTO, error) {
	// Tạo slug từ name nếu không có
	slug := generateSlug(input.Name)

	// Tạo domain entity bằng constructor
	category := domain.NewCategories(
		common.GenUUID(),
		input.ParentID,
		input.Name,
		slug,
		input.Description,
		input.ImageURL,
		domain.StatusActive, // Mặc định active
		input.SortOrder,
	)

	// Gọi repository để lưu
	err := u.cmdRepo.Create(ctx, category)
	if err != nil {
		return nil, err
	}

	// Trả về DTO
	return &CategoryDetailDTO{
		ID:          category.Id(),
		Name:        category.Name(),
		Description: category.Description(),
		Slug:        category.Slug(),
		ImageURL:    category.ImageUrl(),
		ParentID:    category.CategoryId(),
		Status:      category.Status().String(),
		SortOrder:   category.SortOrder(),
	}, nil
}

// UpdateCategory cập nhật category
func (u *CategoryUC) UpdateCategory(ctx context.Context, id uuid.UUID, input *UpdateCategoryDTO) (*CategoryDetailDTO, error) {
	// Lấy category hiện tại
	category, err := u.queryRepo.GetCategoryByID(ctx, id)
	if err != nil {
		return nil, err
	}

	// Cập nhật thông tin bằng setter methods
	if input.Name != nil {
		category.SetName(*input.Name)
	}
	if input.Description != nil {
		category.SetDescription(input.Description)
	}
	if input.ImageURL != nil {
		category.SetImageUrl(input.ImageURL)
	}
	if input.ParentID != nil {
		category.SetCategoryId(input.ParentID)
	}
	if input.Status != nil {
		category.SetStatus(*input.Status)
	}
	if input.SortOrder != nil {
		category.SetSortOrder(*input.SortOrder)
	}

	// Lưu vào repository
	err = u.cmdRepo.Update(ctx, category)
	if err != nil {
		return nil, err
	}

	return &CategoryDetailDTO{
		ID:          category.Id(),
		Name:        category.Name(),
		Description: category.Description(),
		Slug:        category.Slug(),
		ImageURL:    category.ImageUrl(),
		ParentID:    category.CategoryId(),
		Status:      category.Status().String(),
		SortOrder:   category.SortOrder(),
	}, nil
}

// DeleteCategory xóa category (soft delete)
func (u *CategoryUC) DeleteCategory(ctx context.Context, id uuid.UUID) error {
	return u.cmdRepo.Delete(ctx, id)
}

// buildCategoryTree xây dựng cây danh mục từ danh sách categories
func (u *CategoryUC) buildCategoryTree(categories []*domain.Categories, parentID *uuid.UUID) []*CategoryNodeDTO {
	var nodes []*CategoryNodeDTO

	for _, cat := range categories {
		// Kiểm tra nếu category này thuộc về parent hiện tại
		catParentID := cat.CategoryId()
		if (parentID == nil && catParentID == nil) ||
			(parentID != nil && catParentID != nil && *catParentID == *parentID) {

			node := &CategoryNodeDTO{
				ID:           cat.Id(),
				Name:         cat.Name(),
				Slug:         cat.Slug(),
				ParentID:     cat.CategoryId(),
				ProductCount: 0, // TODO: implement product count
				Status:       cat.Status().String(),
			}

			// Recursively build children
			catID := cat.Id()
			node.Children = u.buildCategoryTree(categories, &catID)

			nodes = append(nodes, node)
		}
	}

	return nodes
}

// generateSlug tạo slug từ name
func generateSlug(name string) string {
	slug := strings.ToLower(name)
	slug = strings.ReplaceAll(slug, " ", "-")
	// TODO: Add more sophisticated slug generation if needed
	return slug
}
