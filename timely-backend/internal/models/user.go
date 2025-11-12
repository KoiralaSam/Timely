package models

import (
	"context"
	"errors"
	"time"

	"github.com/KoiralaSam/Timely/timely-backend/internal/db"
	"github.com/KoiralaSam/Timely/timely-backend/internal/utils"
)

var ctx = context.Background()

type User struct {
	ID         string    `json:"id"`
	Name       string    `json:"name"`
	Email      string    `json:"email" binding:"required"`
	Password   string    `json:"password" binding:"required"`
	HourlyRate float64   `json:"hourly_rate"`
	CreatedAt  time.Time `json:"created_at"`
	UpdatedAt  time.Time `json:"updated_at"`
}

func (u *User) Save() error {

	query := `INSERT INTO users (name, email, password, hourly_rate) VALUES ($1, $2, $3, $4) RETURNING id, created_at, updated_at`

	hashedPassword, err := utils.HashPassword(u.Password)

	if err != nil {
		return err
	}

	err = db.GetDB().QueryRow(ctx, query, u.Name, u.Email, hashedPassword, u.HourlyRate).Scan(&u.ID, &u.CreatedAt, &u.UpdatedAt)

	if err != nil {
		return err
	}

	return nil
}

func (u *User) ValidateCredentials() error {
	query := `SELECT id, password FROM users WHERE email=$1`

	var retrivedHash string

	err := db.GetDB().QueryRow(ctx, query, u.Email).Scan(&u.ID, &retrivedHash)

	if err != nil {
		return err
	}

	err = utils.CheckPasswordAndHash(u.Password, retrivedHash)

	if err != nil {
		return errors.New("invalid credentials")
	}

	return nil
}
