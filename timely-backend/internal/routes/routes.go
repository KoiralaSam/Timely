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
	server.POST("/expense/categories", handlers.CreateExpenseCategory)

	authenticated := server.Group("/api/v1")
	authenticated.Use(middleware.AuthMiddleware)
	authenticated.POST("/clock/in", handlers.ClockIn)
	authenticated.POST("/clock/out/:id", handlers.ClockOut)
	authenticated.GET("/clock/sessions", handlers.GetClockSessions)
	authenticated.POST("/expense/add", handlers.CreateExpense)
	authenticated.GET("/expense/list", handlers.GetExpenses)
	authenticated.DELETE("/expense/:id", handlers.DeleteExpense)
	authenticated.POST("/plaid/link-token", handlers.CreateLinkToken)
	authenticated.POST("/plaid/exchange-token", handlers.ExchangeToken)
}
