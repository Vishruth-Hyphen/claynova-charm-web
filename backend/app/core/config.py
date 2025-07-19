import os
from typing import List


class Settings:
    PROJECT_NAME: str = "Claynova Charm API"
    API_V1_STR: str = "/api/v1"
    
    # CORS
    BACKEND_CORS_ORIGINS: List[str] = ["http://localhost:5173", "http://localhost:3000"]
    
    def __init__(self):
        # Load from environment variables if available
        self.PROJECT_NAME = os.getenv("PROJECT_NAME", self.PROJECT_NAME)
        self.API_V1_STR = os.getenv("API_V1_STR", self.API_V1_STR)
        
        # Parse CORS origins from environment
        cors_origins = os.getenv("BACKEND_CORS_ORIGINS", "")
        if cors_origins:
            self.BACKEND_CORS_ORIGINS = [origin.strip() for origin in cors_origins.split(",")]


settings = Settings() 