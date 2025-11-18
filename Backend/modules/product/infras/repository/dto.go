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

// ProductDTO để mapping với database
type ProductDTO struct {
	ID             uuid.UUID  `gorm:"type:char(36);primary_key;column:id" json:"id"`
	CategoryID     *uuid.UUID `gorm:"type:char(36);index;column:category_id" json:"categoryId,omitempty"`
	Name           string     `gorm:"type:varchar(200);not null;column:name" json:"name"`
	Content        *string    `gorm:"type:text;column:content" json:"content,omitempty"`
	SKUPrefix      string     `gorm:"type:varchar(20);not null;column:sku_prefix" json:"skuPrefix"`
	PublishStatus  string     `gorm:"type:enum('draft','published','archived');not null;default:'draft';column:publish_status" json:"publishStatus"`
	ActivityStatus string     `gorm:"type:enum('active','inactive');not null;default:'active';column:activity_status" json:"activityStatus"`
}

// ToDomain chuyển từ ProductDTO sang domain entity
func (dto ProductDTO) ToDomain() *domain.Products {
	return domain.NewProducts(
		dto.ID,
		dto.CategoryID,
		dto.Name,
		dto.Content,
		dto.SKUPrefix,
		domain.GetPublishStatus(dto.PublishStatus),
		domain.GetActivityStatus(dto.ActivityStatus),
	)
}

// FromProductDomain chuyển từ domain entity sang ProductDTO
func FromProductDomain(product *domain.Products) ProductDTO {
	return ProductDTO{
		ID:             product.Id(),
		CategoryID:     product.CategoryId(),
		Name:           product.Name(),
		Content:        product.Content(),
		SKUPrefix:      product.SkuPrefix(),
		PublishStatus:  product.PublishStatus().String(),
		ActivityStatus: product.ActivityStatus().String(),
	}
}

// ProductVariantDTO để mapping với database
type ProductVariantDTO struct {
	ID             uuid.UUID `gorm:"type:char(36);primary_key;column:id" json:"id"`
	ProductID      uuid.UUID `gorm:"type:char(36);not null;index;column:product_id" json:"productId"`
	SKU            string    `gorm:"type:varchar(100);not null;uniqueIndex;column:sku" json:"sku"`
	Price          float64   `gorm:"type:decimal(10,2);not null;column:price" json:"price"`
	ComparePrice   *float64  `gorm:"type:decimal(10,2);column:compare_price" json:"comparePrice,omitempty"`
	Color          *string   `gorm:"type:varchar(50);column:color" json:"color,omitempty"`
	Size           *string   `gorm:"type:varchar(50);column:size" json:"size,omitempty"`
	Quantity       int       `gorm:"column:quantity;not null;default:0" json:"quantity"`
	ActivityStatus string    `gorm:"type:enum('active','inactive');not null;default:'active';column:activity_status" json:"activityStatus"`
}

// ToDomain chuyển từ ProductVariantDTO sang domain entity
func (dto ProductVariantDTO) ToDomain() *domain.ProductVariants {
	return domain.NewProductVariants(
		dto.ID,
		dto.ProductID,
		dto.SKU,
		dto.Price,
		dto.ComparePrice,
		dto.Color,
		dto.Size,
		dto.Quantity,
		domain.GetVariantActivityStatus(dto.ActivityStatus),
	)
}

// FromVariantDomain chuyển từ domain entity sang ProductVariantDTO
func FromVariantDomain(variant *domain.ProductVariants) ProductVariantDTO {
	return ProductVariantDTO{
		ID:             variant.Id(),
		ProductID:      variant.ProductId(),
		SKU:            variant.Sku(),
		Price:          variant.Price(),
		ComparePrice:   variant.ComparePrice(),
		Color:          variant.Color(),
		Size:           variant.Size(),
		Quantity:       variant.Quantity(),
		ActivityStatus: variant.ActivityStatus().String(),
	}
}
