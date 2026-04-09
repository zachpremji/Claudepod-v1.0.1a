"""
Run once: python setup_google_auth.py
Opens browser for OAuth consent, then prints your refresh token.
Requires credentials.json from Google Cloud Console in the backend/ directory.
"""

from google_auth_oauthlib.flow import InstalledAppFlow

SCOPES = [
    "https://www.googleapis.com/auth/gmail.modify",
    "https://www.googleapis.com/auth/calendar",
]

flow = InstalledAppFlow.from_client_secrets_file("credentials.json", SCOPES)
creds = flow.run_local_server(port=0)
print(f"\nAdd this to your .env:\nGOOGLE_REFRESH_TOKEN={creds.refresh_token}\n")
