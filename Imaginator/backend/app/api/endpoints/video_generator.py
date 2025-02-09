from fastapi import HTTPException
import time
from lumaai import LumaAI
from ...config import settings

async def create_video(scene_data: dict):
    try:
        client = LumaAI(api_key=settings.LUMA_API_KEY)
        
        # Extract scene details
        prompt = scene_data.get("description", "")
        camera_motion = scene_data.get("camera_motion", "")
        
        # Combine prompt with camera motion if provided
        full_prompt = f"{prompt} {camera_motion}".strip()
        
        # Generate video
        generation = client.generations.create(
            prompt=full_prompt,
        )
        
        # Wait for completion
        completed = False
        while not completed:
            generation = client.generations.get(id=generation.id)
            if generation.state == "completed":
                completed = True
            elif generation.state == "failed":
                raise HTTPException(
                    status_code=500,
                    detail=f"Generation failed: {generation.failure_reason}"
                )
            time.sleep(3)
        
        return {
            "status": "success",
            "video_url": generation.assets.video,
            "generation_id": generation.id
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
