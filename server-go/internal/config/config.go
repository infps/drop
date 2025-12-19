package config

import (
	"flag"
	"log"
	"os"

	"github.com/ilyakaznacheev/cleanenv"
)

type HttpConfig struct {
	Address string
}

type Config struct {
	Env        string `yaml:"env" env:"ENV" env-default:"dev"`
	HttpConfig `yaml:"http" env:"HTTP" env-default:"localhost:8080"`
	DbUrl      string `yaml:"db" env:"DB_URL"`
}

func MustLoad() *Config {

	var cfgPath string
	env := os.Getenv("ENV")

	var config Config

	if env != "production" {
		cfgPath = os.Getenv("CONFIG_PATH")

		if cfgPath == "" {
			flags := flag.String("config", "", "path to configuration file")
			flag.Parse()

			cfgPath = *flags

			if cfgPath == "" {
				log.Fatal("config path is not set")
			}
		}

		if _, err := os.Stat(cfgPath); os.IsNotExist(err) {
			log.Fatalf("Config path is set but not found at %s", cfgPath)
		}

		err := cleanenv.ReadConfig(cfgPath, &config)

		if err != nil {
			log.Fatalf("Cannot real cfg file %s", err.Error())
		}

		return &config
	}

	err := cleanenv.ReadEnv(&config)

	if err != nil {
		log.Fatalf("Error loading environment variables from .env: %s", err.Error())
	}

	return &config

}
