package controller

import (
	"Backend/common"
	"Backend/modules/user/usecase"
	"net/http"

	"github.com/gin-gonic/gin"
)

type service struct {
	uc usecase.UseCase
}

func NewService(uc usecase.UseCase) *service {
	return &service{uc: uc}
}
func (s *service) handleRegister() gin.HandlerFunc {
	return func(c *gin.Context) {
		var dto usecase.EmailPasswordRegistrationDTO
		if err := c.BindJSON(&dto); err != nil {
			common.WriteErrorResponse(c, err)
			return
		}

		if err := s.uc.Register(c.Request.Context(), dto); err != nil {
			common.WriteErrorResponse(c, err)
			return
		}

		common.WriteSuccessResponse(c, true)
	}
}
func (s *service) handleLogin() gin.HandlerFunc {
	return func(c *gin.Context) {
		var dto usecase.EmailPasswordLoginDTO
		if err := c.BindJSON(&dto); err != nil {
			common.WriteErrorResponse(c, err)
			return
		}
		tokenResponse, err := s.uc.Login(c.Request.Context(), dto)
		if err != nil {
			common.WriteErrorResponse(c, err)
			return
		}
		common.WriteSuccessResponse(c, tokenResponse)
	}
}
func (s *service) handleRefreshToken() gin.HandlerFunc {
	return func(c *gin.Context) {
		var dto struct {
			RefreshToken string `json:"refresh_token"`
		}
		if err := c.BindJSON(&dto); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		tokenResponse, err := s.uc.RefreshToken(c.Request.Context(), dto.RefreshToken)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusOK, gin.H{"data": tokenResponse})
	}
}
func (s *service) Routes(g *gin.RouterGroup) {
	g.POST("/auth/register", s.handleRegister())
	g.POST("/auth/login", s.handleLogin())
	g.POST("/auth/refresh-token", s.handleRefreshToken())
}
