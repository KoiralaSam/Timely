package models

import (
	"context"
	"time"

	"github.com/KoiralaSam/Timely/timely-backend/internal/db"
)

// normalizeDate ensures the date represents midnight UTC for the given date, preserving only the date part
func normalizeDate(t time.Time) time.Time {
	year, month, day := t.Date()
	return time.Date(year, month, day, 0, 0, 0, 0, time.UTC)
}

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

type ExpenseWithCategory struct {
	ID            int64     `json:"id"`
	UserID        string    `json:"user_id"`
	CategoryID    int64     `json:"category_id"`
	Amount        float64   `json:"amount"`
	Description   string    `json:"description"`
	Date          time.Time `json:"date"`
	CreatedAt     time.Time `json:"created_at"`
	UpdatedAt     time.Time `json:"updated_at"`
	CategoryName  string    `json:"category_name"`
	CategoryColor string    `json:"category_color"`
}

func (e *Expense) Save() error {
	query := `INSERT INTO expenses (user_id, category_id, amount, description, date) VALUES ($1, $2, $3, $4, $5) RETURNING id, created_at, updated_at`

	// Normalize date to ensure correct date is stored (midnight UTC of the given date)
	normalizedDate := normalizeDate(e.Date)

	err := db.GetDB().QueryRow(context.Background(), query, e.UserID, e.CategoryID, e.Amount, e.Description, normalizedDate).Scan(&e.ID, &e.CreatedAt, &e.UpdatedAt)

	if err != nil {
		return err
	}

	return nil
}

func GetExpensesByUserID(userId string) ([]ExpenseWithCategory, error) {
	query := `SELECT e.id, e.category_id, e.amount, e.description, e.date, e.created_at, e.updated_at, ec.name, ec.color
			FROM expenses AS e
			INNER JOIN expense_categories AS ec
			ON e.category_id = ec.id
			WHERE e.user_id = $1
			ORDER BY e.date DESC`

	var expenses []ExpenseWithCategory

	result, err := db.GetDB().Query(context.Background(), query, userId)

	if err != nil {
		return nil, err
	}

	defer result.Close()

	for result.Next() {
		var e ExpenseWithCategory

		err = result.Scan(&e.ID, &e.CategoryID, &e.Amount, &e.Description, &e.Date, &e.CreatedAt, &e.UpdatedAt, &e.CategoryName, &e.CategoryColor)

		if err != nil {
			return nil, err
		}

		// Normalize date to ensure correct date representation (midnight UTC)
		e.Date = normalizeDate(e.Date)

		expenses = append(expenses, e)
	}

	return expenses, nil
}
