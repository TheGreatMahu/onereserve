"""
OneReserve Flask Configuration
Loads settings from the .env file via python-dotenv.
"""

import os
from datetime import timedelta
from dotenv import load_dotenv

# Load .env from the server/ directory
load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))


class Config:
    # ── Flask ──────────────────────────────────────────────────
    SECRET_KEY = os.getenv("JWT_SECRET_KEY", "dev-fallback-secret")
    DEBUG = os.getenv("FLASK_DEBUG", "0") == "1"

    # ── Database (MySQL via PyMySQL) ───────────────────────────
    DB_HOST = os.getenv("DB_HOST", "localhost")
    DB_PORT = int(os.getenv("DB_PORT", 3306))
    DB_NAME = os.getenv("DB_NAME", "onereserve")
    DB_USER = os.getenv("DB_USER", "root")
    DB_PASSWORD = os.getenv("DB_PASSWORD", "")

    SQLALCHEMY_DATABASE_URI = (
        f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}"
        f"@{DB_HOST}:{DB_PORT}/{DB_NAME}?charset=utf8mb4"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ENGINE_OPTIONS = {
        "pool_recycle": 280,        # recycle before MySQL 8-hr timeout
        "pool_pre_ping": True,      # test connection before using
    }

    # ── JWT ────────────────────────────────────────────────────
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "dev-fallback-secret")
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(
        hours=int(os.getenv("JWT_ACCESS_TOKEN_EXPIRES_HOURS", 24))
    )

    # ── CORS ───────────────────────────────────────────────────
    FRONTEND_ORIGIN = os.getenv("FRONTEND_ORIGIN", "http://localhost:3000")


class DevelopmentConfig(Config):
    DEBUG = True


class ProductionConfig(Config):
    DEBUG = False


config_map = {
    "development": DevelopmentConfig,
    "production": ProductionConfig,
    "default": DevelopmentConfig,
}
