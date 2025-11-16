package handlers

import (
	"net/http"

	"github.com/KoiralaSam/Timely/timely-backend/internal/models"
	"github.com/gin-gonic/gin"
)

func CreateExpense(ctx *gin.Context) {
	var expense models.Expense

	err := ctx.ShouldBindJSON(&expense)

	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"message": "could not parse request data"})
		return
	}

	expense.UserID = ctx.GetString("userId")

	if expense.UserID == "" {
		ctx.JSON(http.StatusUnauthorized, gin.H{"message": "user ID not found in token"})
		return
	}

	err = expense.Save()

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"message": "could not save expense", "error": err.Error()})
		return
	}

	ctx.JSON(http.StatusCreated, gin.H{"message": "expense saved successfully", "expense": expense})
}
