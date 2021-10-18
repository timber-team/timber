package auth
import (
	"context"
	"fmt"
	"github.com/gal/timber/models"
	"github.com/go-redis/redis/v8"
	"github.com/golang-jwt/jwt"
	"github.com/google/uuid"
	"github.com/spf13/viper"
	"log"
	"time"
)

var rdb *redis.Client

func InitRedis() error{
	rdb = redis.NewClient(&redis.Options{
		Addr: viper.GetString("redis.address"),
		Password: viper.GetString("redis.pass"),
		DB: 0,
	})

	_, err := rdb.Ping(context.Background()).Result()
	if err != nil{
		return fmt.Errorf("error connecting to redis: %w", err)
	}
	return nil
}

func GenerateAccessToken(tokenString string) (*jwt.Token, string, error){
	token, err := jwt.ParseWithClaims(tokenString, &models.TokenClaims{},
		func (token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
			}
			return []byte(viper.GetString("auth.key")), nil
		})
	if err != nil {
		return nil, "", err
	}

	claims := token.Claims.(*models.TokenClaims)

	accessToken := createToken(claims.Id, claims.UID, time.Now().Add(time.Minute*10).Unix(), "access")

	signedToken, err := accessToken.SignedString([]byte(viper.GetString("auth.key")))
	if err != nil{
		return nil, "", err
	}

	return accessToken, signedToken, nil
}

func CheckAccessToken(tokenString string) (string, int, error) {
	token, err := jwt.ParseWithClaims(tokenString, &models.TokenClaims{},
		func(token *jwt.Token) (interface{}, error) {
			log.Println(viper.GetString("auth.key"))
			return viper.GetString("auth.key"), nil
		})
	if err != nil {
		return "", 0, fmt.Errorf("error parsing access token: %w", err)
	}

	claims := token.Claims.(*models.TokenClaims)
	return claims.Id, claims.UID, nil
}

func GenerateRefreshToken(userID int) (*jwt.Token, string, error) {
	id := uuid.NewString()

	refreshToken := createToken(
		id, userID, time.Now().Add(time.Hour*24*30).Unix(), "refresh",
	)

	rawString, err := refreshToken.SignedString([]byte(viper.GetString("auth.key")))
	if err != nil {
		return nil, "", err
	}

	SaveRefreshToken(id, rawString)
	return refreshToken, rawString, err
}

func CheckRefreshToken(tokenString string) (int, string, error) {
	token, err := jwt.ParseWithClaims(tokenString, &models.TokenClaims{},
		func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
			}
			return []byte(viper.GetString("auth.key")), nil
		})
	if err != nil {
		return 0, "", fmt.Errorf("couldn't decode token: %w", err)
	}

	claims := token.Claims.(*models.TokenClaims)

	result, err := rdb.Get(context.Background(), claims.Id).Result()
	if err != nil {
		return 0, "", err
	}

	if tokenString == result {
		return claims.UID, claims.Id, nil
	}
	return 0, "", fmt.Errorf("token string doesnt match result")
}

func SaveRefreshToken(tokenID, tokenString string) error {
	err := rdb.Set(
		context.Background(), tokenID, tokenString,
		time.Until(time.Now().Add(time.Hour*24*30)),
	)

	if err.Err() != nil {
		return err.Err()
	}
	return nil
}

func createToken(id string, uid int, expiresAt int64, typ string) *jwt.Token {
	currTime := time.Now().Unix()

	claims := &models.TokenClaims{
		StandardClaims: jwt.StandardClaims{
			Id:        id,
			NotBefore: currTime,
			IssuedAt:  currTime,
			ExpiresAt: expiresAt,
		},
		UID: uid,
		Typ: typ,
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	return token
}

