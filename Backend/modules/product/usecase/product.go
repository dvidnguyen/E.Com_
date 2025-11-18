package usecase

import (
	"Backend/modules/product/domain"
	"context"
	"fmt"
	"strings"

	"github.com/google/uuid"
)

type ProductUC struct {
	productQueryRepo  ProductQueryRepository
	productCmdRepo    ProductCmdRepository
	variantQueryRepo  ProductVariantQueryRepository
	variantCmdRepo    ProductVariantCmdRepository
	categoryQueryRepo CategoryQueryRepository
}

func NewProductUC(productQueryRepo ProductQueryRepository,
	productCmdRepo ProductCmdRepository,
	variantQueryRepo ProductVariantQueryRepository,
	variantCmdRepo ProductVariantCmdRepository,
	categoryQueryRepo CategoryQueryRepository) *ProductUC {
	return &ProductUC{
		productQueryRepo:  productQueryRepo,
		productCmdRepo:    productCmdRepo,
		variantQueryRepo:  variantQueryRepo,
		variantCmdRepo:    variantCmdRepo,
		categoryQueryRepo: categoryQueryRepo,
	}
}

// CreateProduct tạo product với variants
func (uc *ProductUC) CreateProduct(ctx context.Context, input *CreateProductDTO) (*ProductDetailDTO, error) {
	// Validate category exists if provided
	if input.CategoryID != nil {
		_, err := uc.categoryQueryRepo.GetCategoryByID(ctx, *input.CategoryID)
		if err != nil {
			return nil, fmt.Errorf("category not found: %w", err)
		}
	}

	// Create product domain entity
	productID := uuid.New()

	// Set default statuses
	publishStatus := domain.PublishStatusDraft
	if input.PublishStatus != nil {
		publishStatus = domain.GetPublishStatus(*input.PublishStatus)
	}

	activityStatus := domain.ProductActive
	if input.ActivityStatus != nil {
		activityStatus = domain.GetActivityStatus(*input.ActivityStatus)
	}

	product := domain.NewProducts(
		productID,
		input.CategoryID,
		input.Name,
		input.Content,
		publishStatus,
		activityStatus,
	)

	// Create product
	err := uc.productCmdRepo.Create(ctx, product)
	if err != nil {
		return nil, fmt.Errorf("failed to create product: %w", err)
	}

	// Create variants
	var variants []*domain.ProductVariants
	for _, variantInput := range input.Variants {
		// Generate SKU: prefix + suffix
		sku := strings.ToUpper(input.SKUPrefix + variantInput.SKUSuffix)

		variant := domain.NewProductVariants(
			uuid.New(),
			productID,
			sku,
			variantInput.Price,
			variantInput.ComparePrice,
			variantInput.Color,
			variantInput.Size,
			variantInput.Quantity,
			domain.VariantActive,
		)

		variants = append(variants, variant)
	}

	// Batch create variants
	err = uc.variantCmdRepo.CreateBatch(ctx, variants)
	if err != nil {
		return nil, fmt.Errorf("failed to create variants: %w", err)
	}

	// Return created product with variants
	return uc.GetProductByID(ctx, productID)
}

// GetProductByID lấy chi tiết product với variants
func (uc *ProductUC) GetProductByID(ctx context.Context, id uuid.UUID) (*ProductDetailDTO, error) {
	product, variants, err := uc.productQueryRepo.GetProductWithVariants(ctx, id)
	if err != nil {
		return nil, fmt.Errorf("failed to get product: %w", err)
	}

	// Get category name if exists
	var categoryName *string
	if product.CategoryId() != nil {
		category, err := uc.categoryQueryRepo.GetCategoryByID(ctx, *product.CategoryId())
		if err == nil {
			name := category.Name()
			categoryName = &name
		}
	}

	// Convert variants to DTOs
	var variantDTOs []ProductVariantDetailDTO
	for _, variant := range variants {
		variantDTOs = append(variantDTOs, ProductVariantDetailDTO{
			ID:             variant.Id(),
			ProductID:      variant.ProductId(),
			SKU:            variant.Sku(),
			Price:          variant.Price(),
			ComparePrice:   variant.ComparePrice(),
			Color:          variant.Color(),
			Size:           variant.Size(),
			Quantity:       variant.Quantity(),
			ActivityStatus: variant.ActivityStatus().String(),
		})
	}

	return &ProductDetailDTO{
		ID:             product.Id(),
		CategoryID:     product.CategoryId(),
		CategoryName:   categoryName,
		Name:           product.Name(),
		Content:        product.Content(),
		PublishStatus:  product.PublishStatus().String(),
		ActivityStatus: product.ActivityStatus().String(),
		Variants:       variantDTOs,
	}, nil
}

// ListProducts lấy danh sách products
func (uc *ProductUC) ListProducts(ctx context.Context) ([]*ProductListItemDTO, error) {
	products, err := uc.productQueryRepo.ListAllProducts(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to list products: %w", err)
	}

	var result []*ProductListItemDTO
	for _, product := range products {
		// Get variants for price calculation
		variants, err := uc.variantQueryRepo.ListVariantsByProductID(ctx, product.Id())
		if err != nil {
			continue // Skip if can't get variants
		}

		// Calculate price range and count
		var minPrice, maxPrice *float64
		variantCount := len(variants)

		if variantCount > 0 {
			min := variants[0].Price()
			max := variants[0].Price()

			for _, variant := range variants {
				if variant.Price() < min {
					min = variant.Price()
				}
				if variant.Price() > max {
					max = variant.Price()
				}
			}

			minPrice = &min
			if min != max {
				maxPrice = &max
			}
		}

		// Get category name
		var categoryName *string
		if product.CategoryId() != nil {
			category, err := uc.categoryQueryRepo.GetCategoryByID(ctx, *product.CategoryId())
			if err == nil {
				name := category.Name()
				categoryName = &name
			}
		}

		result = append(result, &ProductListItemDTO{
			ID:             product.Id(),
			CategoryID:     product.CategoryId(),
			CategoryName:   categoryName,
			Name:           product.Name(),
			PublishStatus:  product.PublishStatus().String(),
			ActivityStatus: product.ActivityStatus().String(),
			VariantCount:   variantCount,
			MinPrice:       minPrice,
			MaxPrice:       maxPrice,
		})
	}

	return result, nil
}
