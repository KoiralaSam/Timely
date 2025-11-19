package models

import (
	"context"
	"time"

	"github.com/KoiralaSam/Timely/timely-backend/internal/db"
)

// id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
// 			user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
// 			access_token TEXT NOT NULL,
// 			item_id TEXT NOT NULL,
// 			institution_name TEXT NOT NULL,
// 			institution_id TEXT NOT NULL,
// 			created_at TIMESTAMPTZ DEFAULT NOW(),
// 			updated_at TIMESTAMPTZ DEFAULT NOW()

type PlaidItem struct {
	ID              string    `json:"id"`
	UserID          string    `json:"user_id"`
	AccessToken     string    `json:"access_token"`
	ItemID          string    `json:"item_id"`
	InstitutionName string    `json:"institution_name"`
	InstitutionID   string    `json:"institution_id"`
	CreatedAt       time.Time `json:"created_at"`
	UpdatedAt       time.Time `json:"updated_at"`
}

func (p *PlaidItem) Save() error {
	query := `INSERT INTO plaid_items (user_id, access_token, item_id, institution_name, institution_id) VALUES ($1, $2, $3, $4, $5) RETURNING id, created_at, updated_at`

	err := db.GetDB().QueryRow(context.Background(), query, p.UserID, p.AccessToken, p.ItemID, p.InstitutionName, p.InstitutionID).Scan(&p.ID, &p.CreatedAt, &p.UpdatedAt)

	if err != nil {
		return err
	}
	return nil
}

func GetLinkToken() {

}
