package models

import (
	"context"
	"time"

	"github.com/KoiralaSam/Timely/timely-backend/internal/db"
)

type ExpenseCategory struct {
	ID        int64     `json:"id"`
	Name      string    `json:"name"`
	Color     string    `json:"color"`
	CreatedAt time.Time `json:"created_at"`
}

func (e *ExpenseCategory) Save() error {
	query := `INSERT INTO expense_categories (name, color) VALUES ($1, $2) RETURNING id, created_at`

	err := db.GetDB().QueryRow(context.Background(), query, e.Name, e.Color).Scan(&e.ID, &e.CreatedAt)

	if err != nil {
		return err
	}

	return nil
}
