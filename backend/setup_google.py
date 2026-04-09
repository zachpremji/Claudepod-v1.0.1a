"""
Google Setup for Claude Pod
===========================

One-time setup to connect your Google account (Gmail + Calendar).

Steps:
  1. Go to https://console.cloud.google.com
  2. Create a project → Enable Gmail API + Calendar API
  3. Go to Credentials → Create OAuth 2.0 Client ID → Desktop App
  4. Download the JSON file → save as backend/credentials.json
  5. Run: python setup_google.py

That's it — your browser will open, you sign in, and tokens are saved automatically.
"""

import json
import sys
from pathlib import Path

SCOPES = [
    "https://www.googleapis.com/auth/gmail.modify",
    "https://www.googleapis.com/auth/calendar",
]

CREDENTIALS_FILE = Path(__file__).parent / "credentials.json"
TOKENS_FILE = Path(__file__).parent / "data" / "google_tokens.json"


def main():
    if not CREDENTIALS_FILE.exists():
        print("\n❌  credentials.json not found in backend/\n")
        print("To get it:")
        print("  1. Go to https://console.cloud.google.com")
        print("  2. Create a project (or pick an existing one)")
        print("  3. Search for 'Gmail API' → Enable it")
        print("  4. Search for 'Google Calendar API' → Enable it")
        print("  5. Go to APIs & Services → Credentials")
        print("  6. Click '+ Create Credentials' → 'OAuth client ID'")
        print("     - If asked to configure consent screen: pick External, fill in app name + your email")
        print("  7. Application type: Desktop app")
        print("  8. Click 'Download JSON' → save as backend/credentials.json")
        print("\nThen re-run: python setup_google.py\n")
        sys.exit(1)

    try:
        from google_auth_oauthlib.flow import InstalledAppFlow
    except ImportError:
        print("\n❌  Missing dependency. Run: pip install google-auth-oauthlib\n")
        sys.exit(1)

    print("\n🔑  Opening browser for Google sign-in...\n")

    flow = InstalledAppFlow.from_client_secrets_file(str(CREDENTIALS_FILE), SCOPES)
    creds = flow.run_local_server(port=0)

    # Save tokens
    TOKENS_FILE.parent.mkdir(exist_ok=True)
    token_data = {
        "token": creds.token,
        "refresh_token": creds.refresh_token,
        "token_uri": creds.token_uri,
        "client_id": creds.client_id,
        "client_secret": creds.client_secret,
        "scopes": list(creds.scopes or []),
    }
    TOKENS_FILE.write_text(json.dumps(token_data, indent=2))

    print("✅  Google connected! Tokens saved to data/google_tokens.json")
    print("    Gmail and Calendar tools are now active in Claude Pod.\n")


if __name__ == "__main__":
    main()
