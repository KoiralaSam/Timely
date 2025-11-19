package handlers

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"

	"github.com/KoiralaSam/Timely/timely-backend/internal/models"
	"github.com/gin-gonic/gin"
)

func CreateLinkToken(ctx *gin.Context) {

	userId := ctx.GetString("userId")

	if userId == "" {
		ctx.JSON(http.StatusUnauthorized, gin.H{"message": "user is not authorized"})
		return
	}

	payload := map[string]any{
		"client_id":     os.Getenv("PLAID_CLIENT_ID"),
		"secret":        os.Getenv("PLAID_SECRET"),
		"client_name":   "Plaid Test App",
		"user":          map[string]string{"client_user_id": userId},
		"products":      []string{"auth"},
		"country_codes": []string{"US"},
		"language":      "en",
		"redirect_uri":  os.Getenv("PLAID_REDIRECT_URI"),
	}

	jsonData, err := json.Marshal(payload)

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"message": "could not marshal request", "error": err.Error()})
		return
	}

	res, err := http.Post("https://sandbox.plaid.com/link/token/create", "application/json", bytes.NewBuffer(jsonData))

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"message": "could not create link token", "error": err.Error()})
		return
	}

	defer res.Body.Close()

	body, err := io.ReadAll(res.Body)

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"message": "could not read response body", "error": err.Error()})
		return
	}

	var response map[string]any
	err = json.Unmarshal(body, &response)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"message": "could not parse response", "error": err.Error()})
		return
	}

	ctx.JSON(res.StatusCode, response)
}

func ExchangeToken(ctx *gin.Context) {
	userId := ctx.GetString("userId")
	if userId == "" {
		ctx.JSON(http.StatusUnauthorized, gin.H{"message": "user is not authorized"})
		return
	}

	var requestBody struct {
		PublicToken     string `json:"public_token"`
		InstitutionID   string `json:"institution_id"`
		InstitutionName string `json:"institution_name"`
	}

	err := ctx.ShouldBindJSON(&requestBody)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"message": "could not parse request", "error": err.Error()})
		return
	}

	public_token := requestBody.PublicToken
	if public_token == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"message": "could not find public token"})
		return
	}

	if requestBody.InstitutionID == "" || requestBody.InstitutionName == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"message": "institution information is required"})
		return
	}

	fmt.Println("Received public_token:", public_token)
	fmt.Println("User ID:", userId)

	payload := map[string]any{

		"client_id":    os.Getenv("PLAID_CLIENT_ID"),
		"secret":       os.Getenv("PLAID_SECRET"),
		"public_token": public_token,
	}

	jsonData, err := json.Marshal(payload)

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"message": "could not marshal request", "error": err.Error()})
		return
	}

	res, err := http.Post("https://sandbox.plaid.com/item/public_token/exchange", "application/json", bytes.NewBuffer(jsonData))

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"message": "could not exchange token", "error": err.Error()})
		return
	}

	defer res.Body.Close()

	body, err := io.ReadAll(res.Body)

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"message": "could not read response body", "error": err.Error()})
		return
	}

	var exchangeResponse map[string]any
	err = json.Unmarshal(body, &exchangeResponse)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"message": "could not parse response", "error": err.Error()})
		return
	}

	// Check if exchange was successful
	if res.StatusCode != http.StatusOK {
		ctx.JSON(res.StatusCode, exchangeResponse)
		return
	}

	// Extract access_token and item_id from response
	accessToken, ok := exchangeResponse["access_token"].(string)
	if !ok {
		ctx.JSON(http.StatusInternalServerError, gin.H{"message": "access_token not found in response"})
		return
	}

	itemID, ok := exchangeResponse["item_id"].(string)
	if !ok {
		ctx.JSON(http.StatusInternalServerError, gin.H{"message": "item_id not found in response"})
		return
	}

	// Create and save PlaidItem using metadata from frontend
	plaidItem := models.PlaidItem{
		UserID:          userId,
		AccessToken:     accessToken,
		ItemID:          itemID,
		InstitutionID:   requestBody.InstitutionID,
		InstitutionName: requestBody.InstitutionName,
	}

	err = plaidItem.Save()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"message": "could not save plaid item", "error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"message":    "bank account linked successfully",
		"plaid_item": plaidItem,
	})
}
