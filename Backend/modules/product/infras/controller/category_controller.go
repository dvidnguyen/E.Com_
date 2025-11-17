package controller

import (
	"Backend/common"
	"Backend/middleware"
	"Backend/modules/product/usecase"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type categoryService struct {
	uc         *usecase.CategoryUC
	authClient middleware.AuthClient
}

func NewCategoryService(uc *usecase.CategoryUC, authClient middleware.AuthClient) *categoryService {
	return &categoryService{
		uc:         uc,
		authClient: authClient,
	}
}

// handleGetAllCategories lấy tất cả categories (dạng phẳng)
func (s *categoryService) handleGetAllCategories() gin.HandlerFunc {
	return func(c *gin.Context) {
		categories, err := s.uc.ListAllCategories(c.Request.Context())
		if err != nil {
			common.WriteErrorResponse(c, err)
			return
		}
		common.WriteSuccessResponse(c, categories)
	}
}

// handleGetCategoriesTree lấy categories dạng cây
func (s *categoryService) handleGetCategoriesTree() gin.HandlerFunc {
	return func(c *gin.Context) {
		categories, err := s.uc.ListCategoriesAsTree(c.Request.Context())
		if err != nil {
			common.WriteErrorResponse(c, err)
			return
		}
		common.WriteSuccessResponse(c, categories)
	}
}

// handleGetCategoryByID lấy chi tiết một category
func (s *categoryService) handleGetCategoryByID() gin.HandlerFunc {
	return func(c *gin.Context) {
		idStr := c.Param("id")
		id, err := uuid.Parse(idStr)
		if err != nil {
			common.WriteErrorResponse(c, common.ErrBadRequest.WithError("invalid category ID format"))
			return
		}

		category, err := s.uc.GetCategoryByID(c.Request.Context(), id)
		if err != nil {
			common.WriteErrorResponse(c, err)
			return
		}
		common.WriteSuccessResponse(c, category)
	}
}

// handleCreateCategory tạo category mới (chỉ admin)
func (s *categoryService) handleCreateCategory() gin.HandlerFunc {
	return func(c *gin.Context) {
		var req usecase.CreateCategoryDTO
		if err := c.BindJSON(&req); err != nil {
			common.WriteErrorResponse(c, err)
			return
		}

		// Validate required fields
		if req.Name == "" {
			common.WriteErrorResponse(c, common.ErrBadRequest.WithError("category name is required"))
			return
		}

		category, err := s.uc.CreateCategory(c.Request.Context(), &req)
		if err != nil {
			common.WriteErrorResponse(c, err)
			return
		}
		common.WriteSuccessResponse(c, category)
	}
}

// handleUpdateCategory cập nhật category (chỉ admin)
func (s *categoryService) handleUpdateCategory() gin.HandlerFunc {
	return func(c *gin.Context) {
		idStr := c.Param("id")
		id, err := uuid.Parse(idStr)
		if err != nil {
			common.WriteErrorResponse(c, common.ErrBadRequest.WithError("invalid category ID format"))
			return
		}

		var req usecase.UpdateCategoryDTO
		if err := c.BindJSON(&req); err != nil {
			common.WriteErrorResponse(c, err)
			return
		}

		category, err := s.uc.UpdateCategory(c.Request.Context(), id, &req)
		if err != nil {
			common.WriteErrorResponse(c, err)
			return
		}
		common.WriteSuccessResponse(c, category)
	}
}

// handleDeleteCategory xóa category (chỉ admin)
func (s *categoryService) handleDeleteCategory() gin.HandlerFunc {
	return func(c *gin.Context) {
		idStr := c.Param("id")
		id, err := uuid.Parse(idStr)
		if err != nil {
			common.WriteErrorResponse(c, common.ErrBadRequest.WithError("invalid category ID format"))
			return
		}

		err = s.uc.DeleteCategory(c.Request.Context(), id)
		if err != nil {
			common.WriteErrorResponse(c, err)
			return
		}
		common.WriteSuccessResponse(c, "Category deleted successfully")
	}
}

func (s *categoryService) Routes(g *gin.RouterGroup) {
	// Public routes - không cần authentication
	g.GET("/categories", s.handleGetAllCategories())
	g.GET("/categories/:id", s.handleGetCategoryByID())

	adminGroup := g.Group("/admin/categories")
	adminGroup.Use(middleware.RequireAuth(s.authClient))
	adminGroup.Use(middleware.RequireRole("admin"))
	{
		adminGroup.GET("/categories/tree", s.handleGetCategoriesTree())
		adminGroup.POST("", s.handleCreateCategory())
		adminGroup.PUT("/:id", s.handleUpdateCategory())
		adminGroup.DELETE("/:id", s.handleDeleteCategory())
	}
}
