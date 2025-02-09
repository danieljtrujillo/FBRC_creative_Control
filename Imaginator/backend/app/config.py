from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    LUMA_API_KEY: str
    TRIPO_API_KEY: str
    ELEVENLABS_API_KEY: str
    host: str = "localhost"
    port: int = 8000
    
    class Config:
        env_file = ".env"

settings = Settings()
