package main

import (
	"context"
	"fmt"

	"github.com/Strum355/log"
	"github.com/go-redis/redis/v8"
	"github.com/spf13/viper"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type dataSources struct {
	DB          *gorm.DB
	RedisClient *redis.Client
}

// InitDS establishes connections to fields in dataSources
func initDS() (*dataSources, error) {
	log.Info("Initializing data sources")

	// Load postgres variables
	pgHost := viper.GetString("db.host")
	pgUser := viper.GetString("db.user")
	pgPass := viper.GetString("db.pass")
	pgName := viper.GetString("db.name")
	pgPort := viper.GetString("db.port")

	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s TimeZone=Europe/Dublin", pgHost, pgUser, pgPass, pgName, pgPort)

	// Initialize postgres connection
	log.Info("Connecting to Postgres")
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		return nil, fmt.Errorf("error opening db: %w", err)
	}

	// Verify database connection is working
	pql, _ := db.DB()
	if err := pql.Ping(); err != nil {
		return nil, fmt.Errorf("error connecting to db: %w", err)
	}

	// Load redis variables
	rdbAddress := viper.GetString("redis.address")
	rdbPassword := viper.GetString("redis.pass")

	// Initialize redis connection
	log.Info("Connecting to Redis")
	rdb := redis.NewClient(&redis.Options{
		Addr:     rdbAddress,
		Password: rdbPassword,
		DB:       0,
	})

	// Verify redis connection
	_, err = rdb.Ping(context.Background()).Result()
	if err != nil {
		return nil, fmt.Errorf("error connecting to redis: %w", err)
	}

	return &dataSources{
		DB:          db,
		RedisClient: rdb,
	}, nil
}

// Server shutdown
func (d *dataSources) close() error {
	pql, _ := d.DB.DB()
	if err := pql.Close(); err != nil {
		return fmt.Errorf("error closing Postgresql: %w", err)
	}

	if err := d.RedisClient.Close(); err != nil {
		return fmt.Errorf("error closing Redis Client: %w", err)
	}

	return nil
}
