package main

import (
	"context"
	"fmt"
	"os"

	"github.com/KoiralaSam/Timely/timely-backend/internal/db"
	"github.com/KoiralaSam/Timely/timely-backend/internal/routes"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {

	err := godotenv.Load("../../.env")

	if err != nil {
		fmt.Println("could not load .env file:", err)
	}

	dbURL := os.Getenv("DATABASE_URL")

	ctx := context.Background()

	err = db.InitDB(ctx, dbURL)

	if err != nil {
		panic("Failed to connect to database: " + err.Error())
	}

	err = db.CreateTables(ctx)

	if err != nil {
		panic("Failed to create tables: " + err.Error())
	}

	defer db.GetDB().Close()

	server := gin.Default()
	routes.RegisterRoutes(server)
	server.Run(":8080") // localhost:8080
}
