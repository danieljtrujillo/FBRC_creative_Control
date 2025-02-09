from fastapi import HTTPException
import requests
import time
from ...config import settings

async def create_3d_model(character_data: dict):
    try:
        api_url = "https://api.tripo3d.ai/v2/openapi/task"
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {settings.TRIPO_API_KEY}"
        }
        
        # Create initial draft model
        draft_payload = {
            "type": "text_to_model",
            "prompt": character_data.get("description", "")
        }
        
        draft_response = requests.post(api_url, headers=headers, json=draft_payload)
        draft_response.raise_for_status()
        task_id = draft_response.json().get("task_id")
        
        # Poll for completion
        status = "pending"
        result_url = None
        while status == "pending":
            status_response = requests.get(
                f"{api_url}/{task_id}",
                headers=headers
            )
            status_response.raise_for_status()
            status_data = status_response.json()
            
            status = status_data.get("status")
            if status == "completed":
                result_url = status_data.get("result", {}).get("url")
            elif status == "failed":
                raise HTTPException(
                    status_code=500,
                    detail=f"Model generation failed: {status_data.get('error')}"
                )
            
            time.sleep(5)
        
        return {
            "status": "success",
            "model_url": result_url,
            "task_id": task_id
        }
        
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
