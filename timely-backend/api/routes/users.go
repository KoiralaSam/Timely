package routes

import (
	"net/http"

	"github.com/KoiralaSam/Timely.git/timely-backend/api/models/user"
	"github.com/KoiralaSam/Timely.git/timely-backend/utils"
	"github.com/gin-gonic/gin"
)

func Login(ctx *gin.Context) {
	var user user.User

	err := ctx.ShouldBindJSON(&user)

	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"message": "could not parse request data"})
		return
	}

	err = user.ValidateCredentials()

	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"message": "invalid credentials"})
		return
	}

	token, err := utils.GenerateToken(user.Email, user.ID)

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"message": "could not generate token"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "login successful", "token": token})

}
