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

// Product DTOs

// CreateProductVariantDTO cho tạo variant trong product
type CreateProductVariantDTO struct {
	SKUSuffix    string   `json:"sku_suffix" binding:"required"`
	Price        float64  `json:"price" binding:"required,gt=0"`
	ComparePrice *float64 `json:"compare_price"`
	Color        *string  `json:"color"`
	Size         *string  `json:"size"`
	Quantity     int      `json:"quantity" binding:"min=0"`
}

// CreateProductDTO cho tạo product với variants
type CreateProductDTO struct {
	Name           string                    `json:"name" binding:"required"`
	Content        *string                   `json:"content"`
	CategoryID     *uuid.UUID                `json:"category_id"`
	PublishStatus  *string                   `json:"publish_status"`
	ActivityStatus *string                   `json:"activity_status"`
	SKUPrefix      string                    `json:"sku_prefix" binding:"required"`
	Variants       []CreateProductVariantDTO `json:"variants" binding:"required,min=1"`
}

// ProductVariantDetailDTO cho chi tiết variant
type ProductVariantDetailDTO struct {
	ID             uuid.UUID `json:"id"`
	ProductID      uuid.UUID `json:"product_id"`
	SKU            string    `json:"sku"`
	Price          float64   `json:"price"`
	ComparePrice   *float64  `json:"compare_price"`
	Color          *string   `json:"color"`
	Size           *string   `json:"size"`
	Quantity       int       `json:"quantity"`
	ActivityStatus string    `json:"activity_status"`
}

// ProductDetailDTO cho chi tiết product với variants
type ProductDetailDTO struct {
	ID             uuid.UUID                 `json:"id"`
	CategoryID     *uuid.UUID                `json:"category_id"`
	CategoryName   *string                   `json:"category_name,omitempty"`
	Name           string                    `json:"name"`
	Content        *string                   `json:"content"`
	SKUPrefix      string                    `json:"sku_prefix"`
	PublishStatus  string                    `json:"publish_status"`
	ActivityStatus string                    `json:"activity_status"`
	Variants       []ProductVariantDetailDTO `json:"variants"`
	CreatedAt      *string                   `json:"created_at,omitempty"`
	UpdatedAt      *string                   `json:"updated_at,omitempty"`
}

// ProductListItemDTO cho danh sách products
type ProductListItemDTO struct {
	ID             uuid.UUID  `json:"id"`
	CategoryID     *uuid.UUID `json:"category_id"`
	CategoryName   *string    `json:"category_name,omitempty"`
	Name           string     `json:"name"`
	SKUPrefix      string     `json:"sku_prefix"`
	PublishStatus  string     `json:"publish_status"`
	ActivityStatus string     `json:"activity_status"`
	VariantCount   int        `json:"variant_count"`
	MinPrice       *float64   `json:"min_price"`
	MaxPrice       *float64   `json:"max_price"`
}
