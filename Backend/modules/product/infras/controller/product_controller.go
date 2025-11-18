package controller

import (
	"Backend/common"
	"Backend/middleware"
	"Backend/modules/product/usecase"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// productService handles product-related HTTP requests
type productService struct {
	uc         usecase.UseCase
	authClient middleware.AuthClient
}

func NewProductService(uc usecase.UseCase, authClient middleware.AuthClient) *productService {
	return &productService{
		uc:         uc,
		authClient: authClient,
	}
}

// handleCreateProduct tạo product mới (chỉ admin)
func (s *productService) handleCreateProduct() gin.HandlerFunc {
	return func(c *gin.Context) {
		var req usecase.CreateProductDTO
		if err := c.BindJSON(&req); err != nil {
			common.WriteErrorResponse(c, err)
			return
		}

		// Validate required fields
		if req.Name == "" {
			common.WriteErrorResponse(c, common.ErrBadRequest.WithError("product name is required"))
			return
		}

		product, err := s.uc.CreateProduct(c.Request.Context(), &req)
		if err != nil {
			common.WriteErrorResponse(c, err)
			return
		}
		common.WriteSuccessResponse(c, product)
	}
}

// handleGetProductByID lấy chi tiết một product
func (s *productService) handleGetProductByID() gin.HandlerFunc {
	return func(c *gin.Context) {
		idStr := c.Param("id")
		id, err := uuid.Parse(idStr)
		if err != nil {
			common.WriteErrorResponse(c, common.ErrBadRequest.WithError("invalid product ID format"))
			return
		}

		product, err := s.uc.GetProductByID(c.Request.Context(), id)
		if err != nil {
			common.WriteErrorResponse(c, err)
			return
		}
		common.WriteSuccessResponse(c, product)
	}
}

// handleGetProductWithVariants lấy product với tất cả variants (same as GetProductByID)
func (s *productService) handleGetProductWithVariants() gin.HandlerFunc {
	return func(c *gin.Context) {
		idStr := c.Param("id")
		id, err := uuid.Parse(idStr)
		if err != nil {
			common.WriteErrorResponse(c, common.ErrBadRequest.WithError("invalid product ID format"))
			return
		}

		result, err := s.uc.GetProductByID(c.Request.Context(), id)
		if err != nil {
			common.WriteErrorResponse(c, err)
			return
		}
		common.WriteSuccessResponse(c, result)
	}
}

// handleListAllProducts lấy tất cả products
func (s *productService) handleListAllProducts() gin.HandlerFunc {
	return func(c *gin.Context) {
		products, err := s.uc.ListProducts(c.Request.Context())
		if err != nil {
			common.WriteErrorResponse(c, err)
			return
		}
		common.WriteSuccessResponse(c, products)
	}
}

// Routes định nghĩa các routes cho product
func (s *productService) Routes(g *gin.RouterGroup) {
	// Public routes - không cần authentication
	g.GET("/products", s.handleListAllProducts())
	g.GET("/products/:id", s.handleGetProductByID())
	g.GET("/products/:id/variants", s.handleGetProductWithVariants())

	adminGroup := g.Group("/admin/products")
	adminGroup.Use(middleware.RequireAuth(s.authClient))
	adminGroup.Use(middleware.RequireRole("admin"))
	{
		adminGroup.POST("", s.handleCreateProduct())
		// TODO: Update and Delete methods to be implemented later
	}
}
