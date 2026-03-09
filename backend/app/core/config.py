from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "TaskFlow API"
    api_prefix: str = "/api/v1"

    mongodb_url: str = "mongodb://localhost:27017"
    mongodb_db_name: str = "taskflow"

    secret_key: str = "change-me-in-production-at-least-32-characters"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60

    # origins allowed to make cross‑origin requests to the API.  This
    # value can be set via the CORS_ORIGINS environment variable as a
    # comma‑separated list (pydantic will split it automatically).  It is
    # important that the GitHub Pages origin is present when the frontend is
    # hosted at https://manimsv.github.io; otherwise the browser will block
    # the request with the CORS errors you saw.
    cors_origins: list[str] = [
        "http://localhost:4200",
        "http://127.0.0.1:4200",
        "https://manimsv.github.io",
    ]

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )


settings = Settings()
