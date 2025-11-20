package models

import (
	"context"
	"encoding/json"
	"time"

	"github.com/KoiralaSam/Timely/timely-backend/internal/db"
)

type PlaidItem struct {
	ID              string         `json:"id"`
	UserID          string         `json:"user_id"`
	AccessToken     string         `json:"access_token"`
	ItemID          string         `json:"item_id"`
	InstitutionName string         `json:"institution_name"`
	InstitutionID   string         `json:"institution_id"`
	Accounts        []PlaidAccount `json:"accounts"`
	CreatedAt       time.Time      `json:"created_at"`
	UpdatedAt       time.Time      `json:"updated_at"`
}

type PlaidAccount struct {
	ID                 string  `json:"id"`
	Name               string  `json:"name"`
	Mask               string  `json:"mask"`
	Type               string  `json:"type"`
	Subtype            string  `json:"subtype"`
	VerificationStatus *string `json:"verification_status,omitempty"`
	ClassType          *string `json:"class_type,omitempty"`
}

type PlaidItemResponse struct {
	ID              string         `json:"id"`
	UserID          string         `json:"user_id"`
	ItemID          string         `json:"item_id"`
	InstitutionName string         `json:"institution_name"`
	InstitutionID   string         `json:"institution_id"`
	Accounts        []PlaidAccount `json:"accounts"`
	CreatedAt       time.Time      `json:"created_at"`
	UpdatedAt       time.Time      `json:"updated_at"`
}

func (p *PlaidItem) Save() error {
	// Convert accounts to JSON
	accountsJSON, err := json.Marshal(p.Accounts)
	if err != nil {
		return err
	}

	query := `INSERT INTO plaid_items (user_id, access_token, item_id, institution_name, institution_id, accounts) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, created_at, updated_at`

	err = db.GetDB().QueryRow(context.Background(), query, p.UserID, p.AccessToken, p.ItemID, p.InstitutionName, p.InstitutionID, accountsJSON).Scan(&p.ID, &p.CreatedAt, &p.UpdatedAt)

	if err != nil {
		return err
	}
	return nil
}

// CheckAccountIDsExist checks if any of the provided account IDs already exist
// in any PlaidItem for the given user
func CheckAccountIDsExist(userId string, accountIDs []string) (bool, error) {
	if len(accountIDs) == 0 {
		return false, nil
	}

	// Get all plaid items for the user
	plaidItems, err := GetPlaidItemsByUserID(userId)
	if err != nil {
		return false, err
	}

	// Create a map of existing account IDs
	existingAccountIDs := make(map[string]bool)
	for _, item := range plaidItems {
		for _, account := range item.Accounts {
			existingAccountIDs[account.ID] = true
		}
	}

	// Check if any of the new account IDs already exist
	var duplicateIDs []string
	for _, accountID := range accountIDs {
		if existingAccountIDs[accountID] {
			duplicateIDs = append(duplicateIDs, accountID)
		}
	}

	return len(duplicateIDs) > 0, nil
}

func GetPlaidItemsByUserID(userId string) ([]PlaidItemResponse, error) {
	query := `SELECT id, item_id, institution_name, institution_id, COALESCE(accounts, '[]'::jsonb), created_at, updated_at FROM plaid_items WHERE user_id = $1`

	result, err := db.GetDB().Query(context.Background(), query, userId)

	if err != nil {
		return nil, err
	}

	defer result.Close()

	var plaidItems []PlaidItemResponse

	for result.Next() {
		var plaidItem PlaidItemResponse
		var accountsJSON []byte

		err = result.Scan(&plaidItem.ID, &plaidItem.ItemID, &plaidItem.InstitutionName, &plaidItem.InstitutionID, &accountsJSON, &plaidItem.CreatedAt, &plaidItem.UpdatedAt)

		if err != nil {
			return nil, err
		}

		// Parse accounts JSON
		if len(accountsJSON) > 0 {
			err = json.Unmarshal(accountsJSON, &plaidItem.Accounts)
			if err != nil {
				return nil, err
			}
		}

		plaidItems = append(plaidItems, plaidItem)
	}

	return plaidItems, nil
}
