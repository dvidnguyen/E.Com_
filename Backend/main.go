package main

import (
	"Backend/common"
	"Backend/component"
	"Backend/modules/user/infras/controller"
	"Backend/modules/user/infras/repository"
	"Backend/modules/user/usecase"
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

func main() {

	dsn := "root:12345@tcp(127.0.0.1:3309)/ecom?charset=utf8mb4&parseTime=True&loc=Local"
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

	userService := controller.NewService(userUC)
	api := r.Group("/api/v1")
	userService.Routes(api)
	// Start server on port 8080 (default)
	// Server will listen on 0.0.0.0:8080 (localhost:8080 on Windows)
	r.Run(":8081")
}
