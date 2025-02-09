# backend/app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api.routes import router

app = FastAPI(title="Script to 3D Pipeline")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/api")

# backend/app/api/routes.py
from fastapi import APIRouter, UploadFile, File
from .endpoints import script_processor, luma_handler, video_generator, tripo_handler

router = APIRouter()

@router.post("/upload-script")
async def upload_script(file: UploadFile = File(...)):
    return await script_processor.process_script(file)

@router.post("/generate-character")
async def generate_character(prompt: dict):
    return await luma_handler.generate_character(prompt)

@router.post("/generate-video")
async def generate_video(scene_data: dict):
    return await video_generator.create_video(scene_data)

@router.post("/generate-3d-model")
async def generate_3d_model(character_data: dict):
    return await tripo_handler.create_3d_model(character_data)

# backend/app/config.py
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    LUMA_API_KEY: str
    TRIPO_API_KEY: str
    ELEVENLABS_API_KEY: str
    
    class Config:
        env_file = ".env"

settings = Settings()