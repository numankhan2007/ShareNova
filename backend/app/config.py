"""
config.py — Pydantic-settings based environment validation.
Replaces: backend/src/config/env.ts (Zod + dotenv)
"""

from pydantic_settings import BaseSettings
from pydantic import Field


class Settings(BaseSettings):
    # Server
    PORT: int = Field(default=8000)
    NODE_ENV: str = Field(default="development")

    # Database
    DATABASE_URL: str = Field(min_length=1)

    # Cloudflare R2 / S3
    R2_ACCOUNT_ID: str = Field(min_length=1)
    R2_ACCESS_KEY_ID: str = Field(min_length=1)
    R2_SECRET_ACCESS_KEY: str = Field(min_length=1)
    R2_BUCKET_NAME: str = Field(min_length=1)
    R2_ENDPOINT: str | None = Field(default=None)

    # Security
    BCRYPT_ROUNDS: int = Field(default=12)
    SESSION_SECRET: str = Field(min_length=16)

    # Limits
    MAX_UPLOAD_BYTES: int = Field(default=524288000)  # 500MB

    # CORS
    FRONTEND_URL: str = Field(default="http://localhost:5173")

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}


settings = Settings()
