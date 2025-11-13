package usecase

type EmailPasswordRegistration struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=8"`
	UserName string `json:"userName" binding:"required"`
	Phone    string `json:"phone" binding:"required"`
}

type EmailPasswordLogin struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

type TokenResponse struct {
	AccessToken           string `json:"access_token"`
	AccessTokenExpiresAt  int    `json:"access_exp_at"`
	RefreshToken          string `json:"refresh_token"`
	RefreshTokenExpiresAt int    `json:"refresh_exp_at"`
}
