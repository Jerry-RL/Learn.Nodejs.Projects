package router

import (
	"github.com/gin-gonic/gin"
	"hitime/config"
	"hitime/controller"
	"hitime/middleware"
)

func SetupRouter(cfg *config.Config) *gin.Engine {
	r := gin.Default()

	// 控制器初始化（实际应传入 service 实例）
	userCtrl := controller.NewUserController(nil)
	eventCtrl := controller.NewEventController(nil)
	oauthCtrl := controller.NewOAuthController()

	api := r.Group("/api")
	{
		api.POST("/register", userCtrl.Register)
		api.POST("/login", userCtrl.Login)
		api.GET("/profile", middleware.JWT(), userCtrl.Profile)

		api.POST("/events", middleware.JWT(), eventCtrl.Create)
		api.GET("/events/:id", middleware.JWT(), eventCtrl.Get)
		api.GET("/events", middleware.JWT(), eventCtrl.List)
		api.PUT("/events/:id", middleware.JWT(), eventCtrl.Update)
		api.DELETE("/events/:id", middleware.JWT(), eventCtrl.Delete)

		api.GET("/oauth/authorize", oauthCtrl.Authorize)
		api.POST("/oauth/token", oauthCtrl.Token)
		api.POST("/oauth/revoke", oauthCtrl.Revoke)
	}

	return r
} 