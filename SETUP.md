# Claude Pod — Developer Setup

This is the one-time setup you do before deploying. Users never see this.

## Quick Start

```bash
# Backend
cd backend
pip install -r requirements.txt
cp .env.example .env          # add your ANTHROPIC_API_KEY
uvicorn main:app --reload --port 8000

# Frontend (separate terminal)
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173** — chat works immediately.

---

## Enable Google Sign-In (Gmail + Calendar)

Users connect Google through a "Sign in with Google" button in the app. To enable it, you create OAuth credentials once:

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a project → search for and enable **Gmail API** + **Google Calendar API**
3. Go to **APIs & Services → Credentials** → **Create Credentials → OAuth 2.0 Client ID**
4. If prompted for a consent screen: choose External, add your app name and email, add yourself as a test user
5. Application type: **Web application**
6. Add authorized redirect URI: `http://localhost:8000/auth/google/callback`
7. Copy the Client ID and Client Secret into `backend/.env`:

```
GOOGLE_CLIENT_ID=xxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxx
```

8. Restart the backend — users will now see "Sign in with Google" in Settings.

---

## .env Reference

```
ANTHROPIC_API_KEY=sk-ant-...     # Required — powers all conversations
GOOGLE_CLIENT_ID=...             # Optional — enables Google sign-in
GOOGLE_CLIENT_SECRET=...         # Optional — enables Google sign-in
```

ElevenLabs is configured by users in the app Settings panel.

## Notes

- Push-to-talk requires Chrome or Edge
- SMS and Interac are stubbed (log only, no real service)
- Gmail and Calendar are real — they send actual emails and create events
