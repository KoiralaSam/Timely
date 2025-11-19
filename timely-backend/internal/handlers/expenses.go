package handlers

import (
	"net/http"
	"strconv"

	"github.com/KoiralaSam/Timely/timely-backend/internal/models"
	"github.com/gin-gonic/gin"
)

func CreateExpense(ctx *gin.Context) {
	var expense models.Expense

	err := ctx.ShouldBindJSON(&expense)

	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"message": "could not parse request data", "error": err.Error()})
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

func GetExpenses(ctx *gin.Context) {
	userId := ctx.GetString("userId")

	expenses, err := models.GetExpensesByUserID(userId)

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"message": "could not get expenses", "error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "expenses fetched successfully", "expenses": expenses})
}

func DeleteExpense(ctx *gin.Context) {
	id, err := strconv.ParseInt(ctx.Param("id"), 10, 64)

	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"message": "could not parse id"})
		return
	}

	expense, err := models.GetExpensesByID(id)

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"message": "could not get expense"})
		return
	}

	if expense.UserID != ctx.GetString("userId") {
		ctx.JSON(http.StatusUnauthorized, gin.H{"message": "you are not authorized to delete this expense"})
		return
	}

	err = expense.Delete()

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"message": "could not delete expense"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "expense deleted successfully", "id": id})

}
