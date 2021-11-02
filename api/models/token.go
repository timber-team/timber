package models

import (
	"context"
	"fmt"

	"github.com/gal/timber/utils/customresponse"
	"github.com/go-redis/redis/v8"

	"time"

	"github.com/Strum355/log"
)

type TokenStore struct {
	rdb *redis.Client
}

func NewTokenStore(rdb *redis.Client) *TokenStore {
	return &TokenStore{rdb}
}

func (tokenStore *TokenStore) SetRefreshToken(ctx context.Context, userID string, tokenID string, expiresIn time.Duration) error {
	key := fmt.Sprintf("%s:%s", userID, tokenID)
	if err := tokenStore.rdb.Set(ctx, key, 0, expiresIn).Err(); err != nil {
		log.WithContext(ctx).WithError(err).Error(fmt.Sprintf("Could not SET refresh token to redis for userID/tokenID: %s/%s", userID, tokenID))
		return customresponse.NewInternal()
	}
	return nil
}

func (tokenStore *TokenStore) DeleteRefreshToken(ctx context.Context, userID string, tokenID string) error {
	key := fmt.Sprintf("%s:%s", userID, tokenID)

	result := tokenStore.rdb.Del(ctx, key)

	if err := result.Err(); err != nil {
		log.WithContext(ctx).WithError(err).Error(fmt.Sprintf("Could not DELETE refresh token to redis for userID/tokenID: %s/%s", userID, tokenID))
		return customresponse.NewInternal()
	}

	// Val returns a count of deleted keys
	if result.Val() < 1 {
		log.WithContext(ctx).Error(fmt.Sprintf("Refresh token to redis for userID/tokenID: %s/%s does not exist", userID, tokenID))
		return customresponse.NewAuthorization("Invalid refresh token")
	}

	return nil
}

func (tokenStore *TokenStore) DeleteUserRefreshTokens(ctx context.Context, userID string) error {
	pattern := fmt.Sprintf("%s*", userID)

	iter := tokenStore.rdb.Scan(ctx, 0, pattern, 5).Iterator()
	failCount := 0

	for iter.Next(ctx) {
		if err := tokenStore.rdb.Del(ctx, iter.Val()).Err(); err != nil {
			log.WithContext(ctx).WithError(err).Error(fmt.Sprintf("Failed to delete refresh token: %s", iter.Val()))
			failCount++
		}
	}

	if err := iter.Err(); err != nil {
		log.WithContext(ctx).WithError(err).Error(fmt.Sprintf("Failed to delete refresh token: %s", iter.Val()))
	}

	if failCount > 0 {
		return customresponse.NewInternal()
	}

	return nil
}
