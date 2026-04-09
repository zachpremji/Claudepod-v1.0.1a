# Claude Pod — Setup Guide

## Prerequisites

- **Python 3.11+**
- **Node.js 18+** and npm

---

## 1. Backend

```bash
cd backend
pip install -r requirements.txt
cp .env.example .env
```

Edit `backend/.env` — the only **required** key:

```
ANTHROPIC_API_KEY=sk-ant-...
```

Start the backend:

```bash
uvicorn main:app --reload --port 8000
```

## 2. Frontend

In a separate terminal:

```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173** — you can chat with Claude immediately.

---

## 3. Connect Services (in the app)

Click the **gear icon** in the top-right to open Settings.

### ElevenLabs (optional voice)

Paste your ElevenLabs API key in Settings. Without it, the app uses browser TTS.

### Google — Gmail & Calendar (optional)

Google requires OAuth credentials. You set these up once as the app developer:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select an existing one)
3. Navigate to **APIs & Services → Library**
4. Enable **Gmail API** and **Google Calendar API**
5. Go to **APIs & Services → Credentials**
6. Click **Create Credentials → OAuth 2.0 Client ID**
7. If prompted, configure the **OAuth consent screen** first:
   - Choose **External**
   - Add your email as a test user
8. Application type: **Web application**
9. Add authorized redirect URI: `http://localhost:8000/auth/google/callback`
10. Copy the **Client ID** and **Client Secret** into `backend/.env`:

```
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-...
```

11. Restart the backend
12. In the app Settings, click **Sign in with Google** and authorize

---

## Notes

- **Push-to-talk** requires **Chrome** or **Edge** (Firefox doesn't support `webkitSpeechRecognition`)
- SMS and Interac e-Transfer are **stubbed** — they log but don't connect to real services
- Gmail and Calendar are **real** — they send actual emails and create actual events
- Conversation history: `backend/data/history.db` (SQLite, auto-created)
- Google tokens: `backend/data/google_tokens.json` (auto-created after OAuth)
- ElevenLabs key: `backend/data/user_settings.json` (auto-created from Settings)
