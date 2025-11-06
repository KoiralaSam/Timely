package models

import (
	"time"
)

type User struct {
	ID         string    `json:"id"`
	Name       string    `json:"name" binding:"required"`
	Password   string    `json:"-" binding:"required"`
	Email      string    `json:"email" binding:"required"`
	HourlyRate float64   `json:"hourly_rate" binding:"required"`
	CreatedAt  time.Time `json:"created_at"`
	UpdatedAt  time.Time `json:"updated_at"`
}
