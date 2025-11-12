package routes

import (
	"github.com/KoiralaSam/Timely/timely-backend/internal/handlers"
	"github.com/gin-gonic/gin"
)

// RegisterRoutes wires HTTP endpoints to handlers
func RegisterRoutes(server *gin.Engine) {
	server.POST("/login", handlers.Login)
	server.POST("/signup", handlers.Signup)
}
