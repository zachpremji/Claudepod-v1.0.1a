from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request
from routers.auth import get_stored_tokens


def get_google_credentials() -> Credentials:
    tokens = get_stored_tokens()
    if not tokens:
        raise RuntimeError("Google not connected. Connect via Settings.")

    creds = Credentials(
        token=tokens.get("token"),
        refresh_token=tokens["refresh_token"],
        client_id=tokens["client_id"],
        client_secret=tokens["client_secret"],
        token_uri=tokens.get("token_uri", "https://oauth2.googleapis.com/token"),
    )
    if creds.expired or not creds.valid:
        creds.refresh(Request())
    return creds
