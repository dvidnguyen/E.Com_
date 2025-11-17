package usecase

import (
	"Backend/modules/product/domain"

	"github.com/google/uuid"
)

type CreateCategoryDTO struct {
	Name        string
	Description *string    // Dùng con trỏ vì có thể NULL
	ImageURL    *string    // Dùng con trỏ vì có thể NULL
	ParentID    *uuid.UUID // (danh mục gốc)
	SortOrder   int
}

type UpdateCategoryDTO struct {
	Name        *string // Dùng con trỏ để biết trường nào cần update
	Description *string
	ImageURL    *string
	ParentID    *uuid.UUID
	Status      *domain.Status // Dùng con trỏ domain.Status
	SortOrder   *int
}

// CategoryNodeDTO là DTO cho đầu ra dạng cây (như hình ảnh bạn gửi)
type CategoryNodeDTO struct {
	ID           uuid.UUID
	Name         string
	Slug         string
	ParentID     *uuid.UUID
	ProductCount int
	Status       string             // Trả về string cho JSON
	Children     []*CategoryNodeDTO // Đệ quy để tạo cây
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
