from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request
from config import settings


def get_google_credentials() -> Credentials:
    creds = Credentials(
        token=None,
        refresh_token=settings.GOOGLE_REFRESH_TOKEN,
        client_id=settings.GOOGLE_CLIENT_ID,
        client_secret=settings.GOOGLE_CLIENT_SECRET,
        token_uri="https://oauth2.googleapis.com/token",
        scopes=[
            "https://www.googleapis.com/auth/gmail.modify",
            "https://www.googleapis.com/auth/calendar",
        ],
    )
    creds.refresh(Request())
    return creds
