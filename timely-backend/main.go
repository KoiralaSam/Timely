package main

import (
	"github.com/KoiralaSam/Timely.git/timely-backend/api/db"
	"github.com/KoiralaSam/Timely.git/timely-backend/api/routes"
	"github.com/gin-gonic/gin"
)

func main() {

	err := db.InitDB()

	if err != nil {
		panic("Failed to connect to database: " + err.Error())
	}

	server := gin.Default()
	routes.RegisterRoutes(server)
	server.Run(":8080") // localhost:8080
}
