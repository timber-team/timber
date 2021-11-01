package config

import (
	"strings"

	"github.com/spf13/viper"
)

// InitConfig initialises env vars to viper variables
func InitConfig() {
	initDefaults()
	viper.SetEnvKeyReplacer(strings.NewReplacer(".", "_"))
	viper.AutomaticEnv()
}

func initDefaults() {
	viper.SetDefault("db.user", "")
	viper.SetDefault("db.pass", "")
	viper.SetDefault("db.host", "")
	viper.SetDefault("db.port", "")
	viper.SetDefault("db.name", "")

	viper.SetDefault("auth.key", "")
	viper.SetDefault("api.url", "")

	viper.SetDefault("redis.address", "")
	viper.SetDefault("redis.port", "")
	viper.SetDefault("redis.pass", "")
}
