package middleware

import (
	"github.com/gin-gonic/gin"
)

// // AuthMiddleware verifies JWT tokens for protected routes
// func AuthMiddleware() gin.HandlerFunc {
// 	return func(ctx *gin.Context) {
// 		authHeader := ctx.GetHeader("Authorization")
// 		if authHeader == "" {
// 			ctx.JSON(http.StatusUnauthorized, gin.H{
// 				"message": "Authorization header is required",
// 			})
// 			ctx.Abort()
// 			return
// 		}

// 		// Extract token from "Bearer <token>"
// 		parts := strings.Split(authHeader, " ")
// 		if len(parts) != 2 || parts[0] != "Bearer" {
// 			ctx.JSON(http.StatusUnauthorized, gin.H{
// 				"message": "Invalid authorization format. Expected: Bearer <token>",
// 			})
// 			ctx.Abort()
// 			return
// 		}

// 		token := parts[1]
// 		userID, err := utils.VerifyToken(token)
// 		if err != nil {
// 			ctx.JSON(http.StatusUnauthorized, gin.H{
// 				"message": "Invalid token",
// 				"error":   err.Error(),
// 			})
// 			ctx.Abort()
// 			return
// 		}

// 		ctx.Set("userID", userID)
// 		ctx.Next()
// 	}
// }

// CORSMiddleware handles CORS for the application
func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE, PATCH")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}
