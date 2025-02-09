from fastapi import APIRouter, UploadFile, File
from .endpoints import script_processor, luma_handler, video_generator, tripo_handler

router = APIRouter()

# Include the script_processor router directly
router.include_router(script_processor.router)

@router.post("/generate-character")
async def generate_character(prompt: dict):
    return await luma_handler.generate_character(prompt)

@router.post("/generate-video")
async def generate_video(scene_data: dict):
    return await video_generator.create_video(scene_data)

@router.post("/generate-3d-model")
async def generate_3d_model(character_data: dict):
    return await tripo_handler.create_3d_model(character_data)
