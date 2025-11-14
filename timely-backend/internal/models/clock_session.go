package models

import (
	"context"
	"database/sql"
	"time"

	"github.com/KoiralaSam/Timely/timely-backend/internal/db"
)

type ClockSession struct {
	ID                 int64      `json:"id"`
	UserID             string     `json:"user_id"`
	StartTime          time.Time  `json:"start_time"`
	EndTime            *time.Time `json:"end_time,omitempty"`
	OvertimeMultiplier float64    `json:"overtime_multiplier"`
}

func (c *ClockSession) Save() error {

	query := `INSERT INTO clock_sessions (user_id) VALUES ($1) RETURNING id, start_time, end_time, overtime_multiplier`

	var endTime sql.NullTime

	err := db.GetDB().QueryRow(context.Background(), query, c.UserID).Scan(&c.ID, &c.StartTime, &endTime, &c.OvertimeMultiplier)

	if err != nil {
		return err
	}

	if endTime.Valid {
		c.EndTime = &endTime.Time
	} else {
		c.EndTime = nil
	}

	return nil
}

func (c *ClockSession) EndSession() error {

	query := `UPDATE clock_sessions SET end_time = NOW() WHERE id = $1 RETURNING end_time`

	var endTime time.Time

	err := db.GetDB().QueryRow(context.Background(), query, c.ID).Scan(&endTime)

	if err != nil {
		return err
	}

	c.EndTime = &endTime

	return nil
}

func GetSessionByID(id int64) (*ClockSession, error) {
	query := `SELECT id, user_id, start_time, end_time, overtime_multiplier FROM clock_sessions WHERE id = $1`

	var c ClockSession
	var endTime sql.NullTime

	err := db.GetDB().QueryRow(context.Background(), query, id).Scan(&c.ID, &c.UserID, &c.StartTime, &endTime, &c.OvertimeMultiplier)

	if err != nil {
		return nil, err
	}

	if endTime.Valid {
		c.EndTime = &endTime.Time
	}

	return &c, nil
}
