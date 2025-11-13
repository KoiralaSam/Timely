package handlers

import (
	"net/http"

	"github.com/KoiralaSam/Timely/timely-backend/internal/models"
	"github.com/gin-gonic/gin"
)

func ClockIn(ctx *gin.Context) {

	var clockSession models.ClockSession

	err := ctx.ShouldBindJSON(&clockSession)

	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"message": "could not parse request data"})
		return
	}

	clockSession.UserID = ctx.GetString("userId")

	err = clockSession.Save()

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"message": "could not save clock session"})
		return
	}

	ctx.JSON(http.StatusCreated, gin.H{"message": "clock session saved successfully", "clockSession": clockSession})

}
