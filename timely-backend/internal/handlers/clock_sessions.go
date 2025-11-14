package handlers

import (
	"net/http"
	"strconv"

	"github.com/KoiralaSam/Timely/timely-backend/internal/models"
	"github.com/gin-gonic/gin"
)

func ClockIn(ctx *gin.Context) {

	var clockSession models.ClockSession

	// UserID comes from JWT token, StartTime is set by database
	// No request body needed for clock-in
	clockSession.UserID = ctx.GetString("userId")

	if clockSession.UserID == "" {
		ctx.JSON(http.StatusUnauthorized, gin.H{"message": "user ID not found in token"})
		return
	}

	err := clockSession.CheckActiveSession()

	if err != nil {
		ctx.JSON(http.StatusConflict, gin.H{"message": "Active session already exists"})
		return
	}

	err = clockSession.Save()

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"message": "could not save clock session", "error": err.Error()})
		return
	}

	ctx.JSON(http.StatusCreated, gin.H{"message": "clock session saved successfully", "clockSession": clockSession})

}

func ClockOut(ctx *gin.Context) {

	id, err := strconv.ParseInt(ctx.Param("id"), 10, 64)

	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"message": "could not parse id"})
		return
	}

	session, err := models.GetSessionByID(id)

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"message": "could not get session", "error": err})
		return
	}

	userId := ctx.GetString("userId")

	if session.UserID != userId {
		ctx.JSON(http.StatusUnauthorized, gin.H{"message": "you are not authorized to update this session"})
		return
	}

	err = session.EndSession()

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"message": "could not update session"})
		return
	}

	ctx.JSON(http.StatusCreated, gin.H{"message": "clock session updated successfully", "clockSession": session})

}
