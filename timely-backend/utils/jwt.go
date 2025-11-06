package utils

import (
	"errors"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

var secretKey = os.Getenv("SECRET_KEY")

func GenerateToken(email string, userID string) (string, error) {
	claims := jwt.MapClaims{
		"email":  email,
		"userId": userID,
		"exp":    time.Now().Add(time.Hour * 72).Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	return token.SignedString([]byte(secretKey))
}

func VerifyToken(token string) (string, error) {
	parsedToken, err := jwt.Parse(token, func(token *jwt.Token) (any, error) {
		_, ok := token.Method.(*jwt.SigningMethodHMAC)

		if !ok {
			return nil, errors.New("could not verify token")
		}

		return []byte(secretKey), nil
	})

	if err != nil {
		return "", errors.New("could not verify token")
	}

	if !parsedToken.Valid {
		return "", errors.New("invalid token")
	}

	claims, ok := parsedToken.Claims.(*jwt.MapClaims)

	if !ok {
		return "", errors.New("could not parse token claims")
	}

	userId := (*claims)["userId"].(string)

	return userId, nil
}
