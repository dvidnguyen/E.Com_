package usecase

type EmailPasswordRegistrationDTO struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=8"`
	UserName string `json:"userName" binding:"required"`
	Phone    string `json:"phone" binding:"required"`
}

type EmailPasswordLoginDTO struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

type TokenResponseDTO struct {
	AccessToken           string `json:"access_token"`
	AccessTokenExpiresAt  int    `json:"access_exp_at"`
	RefreshToken          string `json:"refresh_token"`
	RefreshTokenExpiresAt int    `json:"refresh_exp_at"`
}

type ChangePasswordDTO struct {
	OldPassword string `json:"old_password" binding:"required"`
	NewPassword string `json:"new_password" binding:"required,min=8"`
}
