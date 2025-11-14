package routes

import (
	"github.com/KoiralaSam/Timely/timely-backend/internal/handlers"
	"github.com/KoiralaSam/Timely/timely-backend/internal/middleware"
	"github.com/gin-gonic/gin"
)

// RegisterRoutes wires HTTP endpoints to handlers
func RegisterRoutes(server *gin.Engine) {
	server.POST("/login", handlers.Login)
	server.POST("/signup", handlers.Signup)

	authenticated := server.Group("/api/v1")
	authenticated.Use(middleware.AuthMiddleware)
	authenticated.POST("/clock/in", handlers.ClockIn)
	authenticated.POST("/clock/out/:id", handlers.ClockOut)

}
