package models

import (
	"context"
	"time"

	"github.com/KoiralaSam/Timely/timely-backend/internal/db"
)

type ClockSession struct {
	ID                 string    `json:"id"`
	UserID             string    `json:"user_id" binding:"required"`
	StartTime          time.Time `json:"start_time" binding:"required"`
	EndTime            time.Time `json:"end_time"`
	OvertimeMultiplier float64   `json:"overtime_multiplier"`
}

func (c *ClockSession) Save() error {

	query := `INSERT INTO clock_session (user_id) VALUES ($1) RETURNING id, start_time`

	err := db.GetDB().QueryRow(context.Background(), query, c.UserID).Scan(&c.ID, &c.StartTime)

	if err != nil {
		return err
	}

	return nil
}
