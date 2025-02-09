from fastapi import HTTPException
import time
from lumaai import LumaAI
from ...config import settings

async def generate_character(prompt: dict):
    try:
        client = LumaAI(api_key=settings.LUMA_API_KEY)
        
        # Generate character image
        generation = client.generations.image.create(
            prompt=prompt.get("description", ""),
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
            time.sleep(2)
        
        return {
            "status": "success",
            "image_url": generation.assets.image,
            "generation_id": generation.id
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
