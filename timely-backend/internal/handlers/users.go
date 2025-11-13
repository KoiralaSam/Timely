package handlers

import (
	"net/http"

	models "github.com/KoiralaSam/Timely/timely-backend/internal/models"
	"github.com/KoiralaSam/Timely/timely-backend/internal/utils"
	"github.com/gin-gonic/gin"
)

func Signup(ctx *gin.Context) {
	var u models.User

	err := ctx.ShouldBindJSON(&u)

	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"message": "could not parse request data"})
		return
	}

	err = u.Save()

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"message": "could not create user"})
		return
	}

	// Generate token for auto-login after signup
	token, err := utils.GenerateToken(u.Email, u.ID)

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"message": "could not generate token"})
		return
	}

	// Return user data + token in a single response (not calling Login)
	ctx.JSON(http.StatusCreated, gin.H{
		"message": "Successfully created user",
		"token":   token,
		"user": gin.H{
			"id":          u.ID,
			"email":       u.Email,
			"name":        u.Name,
			"hourly_rate": u.HourlyRate,
		},
	})
}

func Login(ctx *gin.Context) {
	var u models.User

	err := ctx.ShouldBindJSON(&u)

	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"message": "could not parse request data"})
		return
	}

	// Basic credential presence check (replace with real validation later)
	if u.Email == "" || u.Password == "" {
		ctx.JSON(http.StatusUnauthorized, gin.H{"message": "invalid credentials"})
		return
	}

	err = u.ValidateCredentials()

	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"message": "invalid credentials"})
		return
	}

	token, err := utils.GenerateToken(u.Email, u.ID)

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"message": "could not generate token"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "login successful", "token": token, "user": gin.H{
		"id":          u.ID,
		"email":       u.Email,
		"name":        u.Name,
		"hourly_rate": u.HourlyRate,
	}})

}
