package routes

import (
	"github.com/KoiralaSam/Timely.git/timely-backend/api/routes"
	"github.com/gin-gonic/gin"
)

func RegisterRoutes(server *gin.Engine) {
	server.POST("/login", routes.Login)
}
