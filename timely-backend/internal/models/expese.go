package models

import (
	"context"
	"time"

	"github.com/KoiralaSam/Timely/timely-backend/internal/db"
)

type Expense struct {
	ID          int64     `json:"id"`
	UserID      string    `json:"user_id"`
	CategoryID  int64     `json:"category_id"`
	Amount      float64   `json:"amount"`
	Description string    `json:"description"`
	Date        time.Time `json:"date"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

func (e *Expense) Save() error {
	query := `INSERT INTO expenses (user_id, category_id, amount, description, date) VALUES ($1, $2, $3, $4, $5) RETURNING id, created_at, updated_at`

	err := db.GetDB().QueryRow(context.Background(), query, e.UserID, e.CategoryID, e.Amount, e.Description, e.Date).Scan(&e.ID, &e.CreatedAt, &e.UpdatedAt)

	if err != nil {
		return err
	}

	return nil
}
