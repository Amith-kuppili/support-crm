from pydantic_settings import BaseSettings
from typing import Optional
from dotenv import load_dotenv


load_dotenv(override=True)


class Settings(BaseSettings):
    # NocoDB Configuration
    NOCODB_BASE_URL: str
    NOCODB_API_KEY: str
    NOCODB_PROJECT_ID: str
    NOCODB_TICKETS_TABLE_ID: str
    NOCODB_NOTES_TABLE_ID: str
    
    # Application Configuration
    APP_NAME: str = "Support CRM API"
    DEBUG: bool = False
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()