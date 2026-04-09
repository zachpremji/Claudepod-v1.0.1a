import json
import os
from pathlib import Path
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


def get_setting(key: str, default: str = "") -> str:
    """Read from user_settings.json first, fall back to .env."""
    user = _load_user_settings()
    val = user.get(key, "")
    if val:
        return val
    return os.getenv(key, default)


class Settings:
    @property
    def ANTHROPIC_API_KEY(self) -> str:
        return get_setting("ANTHROPIC_API_KEY")

    @property
    def ELEVENLABS_API_KEY(self) -> str:
        return get_setting("ELEVENLABS_API_KEY")

    @property
    def ELEVENLABS_VOICE_ID(self) -> str:
        return get_setting("ELEVENLABS_VOICE_ID", "21m00Tcm4TlvDq8ikWAM")

    @property
    def GOOGLE_CLIENT_ID(self) -> str:
        return get_setting("GOOGLE_CLIENT_ID")

    @property
    def GOOGLE_CLIENT_SECRET(self) -> str:
        return get_setting("GOOGLE_CLIENT_SECRET")


settings = Settings()
