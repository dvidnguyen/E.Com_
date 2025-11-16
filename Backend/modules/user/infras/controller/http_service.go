package controller

import (
	"Backend/common"
	"Backend/middleware"
	"Backend/modules/user/usecase"

	"github.com/gin-gonic/gin"
)

type service struct {
	uc         usecase.UseCase
	authClient middleware.AuthClient
}

func NewService(uc usecase.UseCase, auth middleware.AuthClient) *service {
	return &service{uc: uc, authClient: auth}
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
			common.WriteErrorResponse(c, err)
			return
		}
		tokenResponse, err := s.uc.RefreshToken(c.Request.Context(), dto.RefreshToken)
		if err != nil {
			common.WriteErrorResponse(c, err)
			return
		}
		common.WriteSuccessResponse(c, tokenResponse)
	}
}
func (s *service) handleChangePassword() gin.HandlerFunc {
	return func(c *gin.Context) {
		var dto usecase.ChangePasswordDTO
		if err := c.BindJSON(&dto); err != nil {
			common.WriteErrorResponse(c, err)
			return
		}
		requester := c.MustGet(common.KeyRequester).(common.Requester)
		if err := s.uc.ChangePassword(c, dto, requester.UserId()); err != nil {
			common.WriteErrorResponse(c, err)
			return
		}
		common.WriteSuccessResponse(c, true)
	}
}

func (s *service) Routes(g *gin.RouterGroup) {
	g.POST("/auth/register", s.handleRegister())
	g.POST("/auth/authenticate", s.handleLogin())
	g.POST("/auth/refresh-token", s.handleRefreshToken())
	g.POST("/auth/change-password", middleware.RequireAuth(s.authClient), s.handleChangePassword())
}
