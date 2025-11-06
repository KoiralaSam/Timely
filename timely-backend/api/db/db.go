package db

import (
	"context"
	"errors"
	"os"

	"github.com/jackc/pgx/v5/pgxpool"
)

var Pool *pgxpool.Pool

func InitDB() error {
	Config, err := pgxpool.ParseConfig(os.Getenv("DATABASE_URL"))

	if err != nil {
		return errors.New("failed to parse database config")
	}

	pool, err := pgxpool.NewWithConfig(context.Background(), Config)

	if err != nil {
		return errors.New("failed to create database connection pool")
	}

	err = pool.Ping(context.Background())

	if err != nil {
		return errors.New("failed to connect to database")
	}

	return nil
}
