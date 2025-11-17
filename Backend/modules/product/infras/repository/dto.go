package repository

import (
	"Backend/modules/product/domain"

	"github.com/google/uuid"
)

// CategoryDTO để mapping với database
type CategoryDTO struct {
	ID          uuid.UUID  `gorm:"type:char(36);primary_key;column:id" json:"id"`
	CategoryID  *uuid.UUID `gorm:"type:char(36);index;column:category_id" json:"categoryId,omitempty"`
	Name        string     `gorm:"type:varchar(150);not null;column:name" json:"name"`
	Slug        string     `gorm:"type:varchar(150);not null;uniqueIndex;column:slug" json:"slug"`
	Description *string    `gorm:"type:text;column:description" json:"description,omitempty"`
	ImageURL    *string    `gorm:"type:varchar(255);column:image_url" json:"imageUrl,omitempty"`
	Status      string     `gorm:"type:enum('draft','active','inactive');not null;default:'draft';column:status" json:"status"`
	SortOrder   int        `gorm:"column:sort_order;not null;default:0" json:"sortOrder"`
}

// ToDomain chuyển từ DTO sang domain entity
func (dto CategoryDTO) ToDomain() *domain.Categories {
	return domain.NewCategories(
		dto.ID,
		dto.CategoryID,
		dto.Name,
		dto.Slug,
		dto.Description,
		dto.ImageURL,
		domain.GetStatus(dto.Status),
		dto.SortOrder,
	)
}

// FromDomain chuyển từ domain entity sang DTO
func FromDomain(category *domain.Categories) CategoryDTO {
	return CategoryDTO{
		ID:          category.Id(),
		CategoryID:  category.CategoryId(),
		Name:        category.Name(),
		Slug:        category.Slug(),
		Description: category.Description(),
		ImageURL:    category.ImageUrl(),
		Status:      category.Status().String(),
		SortOrder:   category.SortOrder(),
	}
}
