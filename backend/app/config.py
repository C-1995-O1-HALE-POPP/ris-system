from pydantic import BaseModel
from dotenv import load_dotenv
import os, pathlib

load_dotenv(override=True)

class Settings(BaseModel):
    SECRET_KEY: str = os.getenv("SECRET_KEY") # type: ignore
    SQLALCHEMY_DATABASE_URI: str = os.getenv("DATABASE_URL") # type: ignore
    SQLALCHEMY_TRACK_MODIFICATIONS: bool = False
    JWT_SECRET_KEY: str = os.getenv("JWT_SECRET_KEY") # type: ignore
    JWT_ACCESS_TOKEN_EXPIRES: int = int(os.getenv("ACCESS_EXPIRES", 900))
    JWT_REFRESH_TOKEN_EXPIRES: int = int(os.getenv("REFRESH_EXPIRES", 604800))
    CELERY_BROKER_URL: str = os.getenv("CELERY_BROKER_URL") # type: ignore
    CELERY_RESULT_BACKEND: str = os.getenv("CELERY_RESULT_BACKEND") # type: ignore

settings = Settings()
