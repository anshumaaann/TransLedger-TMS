from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    APP_NAME: str = "TransLedger TMS"
    APP_VERSION: str = "1.0.0"

    DATABASE_HOST: str = "db"
    DATABASE_PORT: int = 5432
    DATABASE_NAME: str = "transledger"
    DATABASE_USER: str = "transledger"
    DATABASE_PASSWORD: str = "change-me-before-production"

    DEBUG: bool = False

    # These defaults are for local development only. Docker deployment requires
    # real values from the root .env file.
    JWT_SECRET_KEY: str = "development-only-change-this-secret"
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int = 480
    INITIAL_ADMIN_EMAIL: str | None = None
    INITIAL_ADMIN_PASSWORD: str | None = None
    INITIAL_ADMIN_NAME: str = "System Administrator"

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore"
    )


settings = Settings()
