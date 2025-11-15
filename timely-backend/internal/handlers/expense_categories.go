package handlers

import (
	"net/http"

	"github.com/KoiralaSam/Timely/timely-backend/internal/models"
	"github.com/gin-gonic/gin"
)

func CreateExpenseCategory(ctx *gin.Context) {

	var category models.ExpenseCategory

	err := ctx.ShouldBindJSON(&category)

	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"message": "could not parse request data"})
		return
	}

	err = category.Save()

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"message": "could not save expense category"})
		return
	}

	ctx.JSON(http.StatusCreated, gin.H{"message": "expense category saved successfully", "category": category})

}
