import json
from pathlib import Path
from fastapi import APIRouter, HTTPException
from fastapi.responses import RedirectResponse
from pydantic import BaseModel
from google_auth_oauthlib.flow import Flow
from config import settings, save_user_settings

router = APIRouter(prefix="/auth")

TOKENS_PATH = Path(__file__).parent.parent / "data" / "google_tokens.json"
SCOPES = [
    "https://www.googleapis.com/auth/gmail.modify",
    "https://www.googleapis.com/auth/calendar",
]
REDIRECT_URI = "http://localhost:8000/auth/google/callback"


def _build_flow() -> Flow:
    client_config = {
        "web": {
            "client_id": settings.GOOGLE_CLIENT_ID,
            "client_secret": settings.GOOGLE_CLIENT_SECRET,
            "auth_uri": "https://accounts.google.com/o/oauth2/auth",
            "token_uri": "https://oauth2.googleapis.com/token",
            "redirect_uris": [REDIRECT_URI],
        }
    }
    flow = Flow.from_client_config(client_config, scopes=SCOPES)
    flow.redirect_uri = REDIRECT_URI
    return flow


def get_stored_tokens() -> dict | None:
    if TOKENS_PATH.exists():
        data = json.loads(TOKENS_PATH.read_text())
        if data.get("refresh_token"):
            return data
    return None


def save_tokens(token_data: dict):
    TOKENS_PATH.parent.mkdir(exist_ok=True)
    TOKENS_PATH.write_text(json.dumps(token_data, indent=2))


def clear_tokens():
    if TOKENS_PATH.exists():
        TOKENS_PATH.unlink()


@router.get("/status")
async def auth_status():
    tokens = get_stored_tokens()
    has_google_creds = bool(settings.GOOGLE_CLIENT_ID and settings.GOOGLE_CLIENT_SECRET)

    return {
        "google": {
            "connected": tokens is not None,
            "available": has_google_creds,
        },
        "elevenlabs": {
            "connected": bool(settings.ELEVENLABS_API_KEY),
        },
        "anthropic": {
            "connected": bool(settings.ANTHROPIC_API_KEY),
        },
    }


class SaveKeysRequest(BaseModel):
    elevenlabs_api_key: str | None = None
    elevenlabs_voice_id: str | None = None


@router.post("/keys")
async def save_keys(body: SaveKeysRequest):
    data = {}
    if body.elevenlabs_api_key is not None:
        data["ELEVENLABS_API_KEY"] = body.elevenlabs_api_key
    if body.elevenlabs_voice_id is not None:
        data["ELEVENLABS_VOICE_ID"] = body.elevenlabs_voice_id
    if data:
        save_user_settings(data)
    return {"status": "saved"}


@router.get("/google/start")
async def google_start():
    if not settings.GOOGLE_CLIENT_ID or not settings.GOOGLE_CLIENT_SECRET:
        raise HTTPException(
            status_code=400,
            detail="Google OAuth not configured. Add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to backend/.env",
        )

    flow = _build_flow()
    auth_url, _ = flow.authorization_url(
        access_type="offline",
        include_granted_scopes="true",
        prompt="consent",
    )
    return RedirectResponse(auth_url)


@router.get("/google/callback")
async def google_callback(code: str = "", error: str = ""):
    if error:
        return RedirectResponse("http://localhost:5173?auth=error")

    try:
        flow = _build_flow()
        flow.fetch_token(code=code)
        creds = flow.credentials

        save_tokens(
            {
                "token": creds.token,
                "refresh_token": creds.refresh_token,
                "token_uri": creds.token_uri,
                "client_id": creds.client_id,
                "client_secret": creds.client_secret,
                "scopes": list(creds.scopes or []),
            }
        )

        return RedirectResponse("http://localhost:5173?auth=success")
    except Exception as e:
        print(f"Google OAuth error: {e}")
        return RedirectResponse("http://localhost:5173?auth=error")


@router.post("/google/disconnect")
async def google_disconnect():
    clear_tokens()
    return {"status": "disconnected"}
