package models

import "github.com/go-redis/redis/v8"

type TokenStore struct {
	rdb *redis.Client
}

func NewTokenStore(rdb *redis.Client) *TokenStore {
	return &TokenStore{rdb}
}