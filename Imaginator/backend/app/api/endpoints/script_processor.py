from fastapi import APIRouter, UploadFile, File, HTTPException
import json

router = APIRouter()

@router.post("/upload-script")
async def upload_script(file: UploadFile = File(...)):
    try:
        # Read the uploaded file content
        content = await file.read()
        
        # For now, we'll assume it's a text file with scene descriptions
        # In a real implementation, we would handle different file types and use OCR if needed
        try:
            text_content = content.decode('utf-8')
        except UnicodeDecodeError:
            raise HTTPException(status_code=400, detail="Invalid file encoding. Please upload a text file.")
        
        if not text_content.strip():
            raise HTTPException(status_code=400, detail="Empty script file")
            
        # Basic processing - split into scenes
        scenes = text_content.split('\n\n')  # Assuming scenes are separated by double newlines
        
        processed_scenes = []
        for scene in scenes:
            if scene.strip():  # Skip empty scenes
                processed_scenes.append({
                    'content': scene.strip(),
                    'characters': extract_characters(scene),
                    'actions': extract_actions(scene)
                })
        
        return {
            'status': 'success',
            'scenes': processed_scenes
        }
    
    except HTTPException as e:
        raise e
    except Exception as e:
        print(f"Error processing script: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error processing script: {str(e)}")

def extract_characters(scene: str) -> list:
    """
    Extract character names from scene text.
    This is a basic implementation - in production, you'd want to use NLP.
    """
    # Look for words in ALL CAPS as character names (common script format)
    words = scene.split()
    characters = []
    for word in words:
        if word.isupper() and len(word) > 1:  # Avoid single letters
            characters.append(word)
    return list(set(characters))  # Remove duplicates

def extract_actions(scene: str) -> list:
    """
    Extract action descriptions from scene text.
    This is a basic implementation - in production, you'd want to use NLP.
    """
    # Look for text in parentheses as action descriptions
    import re
    actions = re.findall(r'\((.*?)\)', scene)
    return [action.strip() for action in actions if action.strip()]
