import os
from pathlib import Path
import json
from dotenv import load_dotenv

load_dotenv()

SETTINGS_PATH = Path(__file__).parent / "data" / "user_settings.json"


def _load_user_settings() -> dict:
    if SETTINGS_PATH.exists():
        return json.loads(SETTINGS_PATH.read_text())
    return {}


def save_user_settings(data: dict):
    SETTINGS_PATH.parent.mkdir(exist_ok=True)
    existing = _load_user_settings()
    existing.update(data)
    SETTINGS_PATH.write_text(json.dumps(existing, indent=2))


def get_user_setting(key: str, default: str = "") -> str:
    """Read from user_settings.json (for per-user keys like ElevenLabs)."""
    user = _load_user_settings()
    return user.get(key, default)


class Settings:
    # App-level keys — always from .env
    ANTHROPIC_API_KEY: str = os.getenv("ANTHROPIC_API_KEY", "")
    GOOGLE_CLIENT_ID: str = os.getenv("GOOGLE_CLIENT_ID", "")
    GOOGLE_CLIENT_SECRET: str = os.getenv("GOOGLE_CLIENT_SECRET", "")

    # Per-user keys — from Settings UI, stored in user_settings.json
    @property
    def ELEVENLABS_API_KEY(self) -> str:
        return get_user_setting("ELEVENLABS_API_KEY", os.getenv("ELEVENLABS_API_KEY", ""))

    @property
    def ELEVENLABS_VOICE_ID(self) -> str:
        return get_user_setting("ELEVENLABS_VOICE_ID", os.getenv("ELEVENLABS_VOICE_ID", "21m00Tcm4TlvDq8ikWAM"))


settings = Settings()
