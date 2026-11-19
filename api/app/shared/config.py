from urllib.parse import urlparse

from arq.connections import RedisSettings
from pydantic import field_validator
from pydantic_settings import BaseSettings


def normalize_database_url(url: str) -> str:
    """Force the asyncpg driver onto a bare Postgres URL.

    Every engine in this project is async, but Railway (and most managed
    providers) hand out `postgresql://`, which SQLAlchemy resolves to psycopg2.
    That driver is not installed, and could not be awaited if it were.
    """
    for prefix in ("postgresql://", "postgres://"):
        if url.startswith(prefix):
            return "postgresql+asyncpg://" + url[len(prefix) :]
    return url


class BaseAppSettings(BaseSettings):
    APP_ENV: str = "development"
    LOG_LEVEL: str = "info"
    DATABASE_URL: str = "postgresql+asyncpg://app:app@localhost:5432/app"
    REDIS_URL: str = "redis://localhost:6379"

    @field_validator("DATABASE_URL")
    @classmethod
    def _normalize_database_url(cls, value: str) -> str:
        return normalize_database_url(value)

    @property
    def redis_host(self) -> str:
        return urlparse(self.REDIS_URL).hostname or "localhost"

    @property
    def redis_port(self) -> int:
        return urlparse(self.REDIS_URL).port or 6379

    @property
    def redis_password(self) -> str | None:
        return urlparse(self.REDIS_URL).password

    @property
    def redis_database(self) -> int:
        path = urlparse(self.REDIS_URL).path
        return int(path.lstrip("/") or 0)

    @property
    def redis_settings(self) -> RedisSettings:
        return RedisSettings(
            host=self.redis_host,
            port=self.redis_port,
            password=self.redis_password,
            database=self.redis_database,
            # Railway starts every service at once, so Redis is often not
            # listening yet. arq's default (5 tries, 1s apart) runs out first
            # and the service crashes instead of waiting for it.
            conn_retries=20,
            conn_retry_delay=3,
        )

    model_config = {"env_file": ".env", "extra": "ignore"}
