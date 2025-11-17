package main

import (
	"Backend/common"
	"Backend/component"
	"Backend/modules/user/infras/controller"
	"Backend/modules/user/infras/repository"
	"Backend/modules/user/usecase"

	// Product module imports
	productController "Backend/modules/product/infras/controller"
	productRepository "Backend/modules/product/infras/repository"
	productUsecase "Backend/modules/product/usecase"

	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Println("Warning: .env file not found, reading from system env")
	}

	dsn := os.Getenv("DB_DSN")
	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})

	if err != nil {
		log.Fatalln("Cannot connect to MySQL:", err)
	}

	log.Println("Connected:", db)

	// Create a Gin router with default middleware (logger and recovery)
	r := gin.Default()

	// Define a simple GET endpoint
	r.GET("/ping", func(c *gin.Context) {
		// Return JSON response
		c.JSON(http.StatusOK, gin.H{
			"message": "pong",
		})
	})

	jwtSecret := os.Getenv("JWT_SECRET")

	tokenProvider := component.NewJWTProvider(jwtSecret,
		60*60*24*7, 60*60*24*14)
	repoUser := repository.NewUserRepo(db)
	repoSession := repository.NewSessionDB(db)
	userUC := usecase.NewUseCase(&repoUser, &repoSession, &common.Hasher{}, tokenProvider)

	introspectUC := usecase.NewIntrospectUC(&repoUser, repoSession, tokenProvider)
	//userService := controller.NewService(userUC)
	userService := controller.NewService(userUC, introspectUC)

	// Product/Category module setup
	categoryQueryRepo := productRepository.NewCategoryQueryRepository(db)
	categoryCmdRepo := productRepository.NewCategoryCmdRepository(db)
	categoryUC := productUsecase.NewCategoryUC(categoryQueryRepo, categoryCmdRepo)
	categoryService := productController.NewCategoryService(categoryUC, introspectUC)

	api := r.Group("/api/v1")

	userService.Routes(api)
	categoryService.Routes(api)

	//authClient := usecase.NewIntrospectUC(&repoUser, repoSession, tokenProvider)
	//r.GET("/pang", middleware.RequireAuth(authClient), func(c *gin.Context) {
	//	// Return JSON response
	//	c.JSON(http.StatusOK, gin.H{
	//		"message": "peng",
	//	})
	//})
	// Start server on port 8080 (default)
	// Server will listen on 0.0.0.0:8080 (localhost:8080 on Windows)
	r.Run(":8081")
}
