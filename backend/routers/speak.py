from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from elevenlabs import ElevenLabs
from config import settings

router = APIRouter()


class SpeakRequest(BaseModel):
    text: str


@router.post("/speak")
async def speak(body: SpeakRequest):
    try:
        client = ElevenLabs(api_key=settings.ELEVENLABS_API_KEY)
        audio = client.generate(
            text=body.text,
            voice=settings.ELEVENLABS_VOICE_ID,
            model="eleven_monolingual_v1",
        )
        return StreamingResponse(audio, media_type="audio/mpeg")
    except Exception as e:
        import traceback

        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))
