package usecase

import (
	"Backend/modules/product/domain"

	"github.com/google/uuid"
)

type CreateCategoryDTO struct {
	Name        string     `json:"name" binding:"required"`
	Description *string    `json:"description"`
	ImageURL    *string    `json:"image_url"`
	ParentID    *uuid.UUID `json:"parent_id"`
	SortOrder   int        `json:"sort_order"`
}

type UpdateCategoryDTO struct {
	Name        *string        `json:"name"`
	Description *string        `json:"description"`
	ImageURL    *string        `json:"image_url"`
	ParentID    *uuid.UUID     `json:"parent_id"`
	Status      *domain.Status `json:"status"`
	SortOrder   *int           `json:"sort_order"`
}

// CategoryNodeDTO là DTO cho đầu ra dạng cây (như hình ảnh bạn gửi)
type CategoryNodeDTO struct {
	ID           uuid.UUID          `json:"id"`
	Name         string             `json:"name"`
	Slug         string             `json:"slug"`
	ParentID     *uuid.UUID         `json:"parent_id"`
	ProductCount int                `json:"product_count"`
	Status       string             `json:"status"`
	Children     []*CategoryNodeDTO `json:"children"`
}

// CategoryDetailDTO cho chi tiết một category
type CategoryDetailDTO struct {
	ID          uuid.UUID  `json:"id"`
	Name        string     `json:"name"`
	Description *string    `json:"description"`
	Slug        string     `json:"slug"`
	ImageURL    *string    `json:"image_url"`
	ParentID    *uuid.UUID `json:"parent_id"`
	Status      string     `json:"status"`
	SortOrder   int        `json:"sort_order"`
	CreatedAt   *string    `json:"created_at,omitempty"`
	UpdatedAt   *string    `json:"updated_at,omitempty"`
}

// CategoryListItemDTO cho danh sách categories
type CategoryListItemDTO struct {
	ID          uuid.UUID  `json:"id"`
	Name        string     `json:"name"`
	Description *string    `json:"description"`
	Slug        string     `json:"slug"`
	ImageURL    *string    `json:"image_url"`
	ParentID    *uuid.UUID `json:"parent_id"`
	Status      string     `json:"status"`
	SortOrder   int        `json:"sort_order"`
}
