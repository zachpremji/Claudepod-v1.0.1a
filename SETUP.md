# Claude Pod — Setup Guide

## Prerequisites

- **Python 3.11+**
- **Node.js 18+** and npm
- An **Anthropic** API key ([console.anthropic.com](https://console.anthropic.com))

### Optional (for full features)

- **Google Cloud** project with Gmail API + Calendar API enabled (for Gmail & Calendar)
- **ElevenLabs** account (for voice synthesis — falls back to browser TTS without it)

---

## 1. Backend Setup

```bash
cd backend
pip install -r requirements.txt
cp .env.example .env
```

Edit `backend/.env` with your keys:

```
ANTHROPIC_API_KEY=sk-ant-...
ELEVENLABS_API_KEY=...          # optional
ELEVENLABS_VOICE_ID=21m00Tcm4TlvDq8ikWAM
GOOGLE_CLIENT_ID=...            # optional, for Gmail/Calendar
GOOGLE_CLIENT_SECRET=...        # optional, for Gmail/Calendar
```

### Google Cloud Setup (optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a project, enable **Gmail API** and **Google Calendar API**
3. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
4. Choose **Web application** as the type
5. Add `http://localhost:8000/auth/google/callback` as an authorized redirect URI
6. Copy the Client ID and Client Secret into your `.env`

### Start the Backend

```bash
uvicorn main:app --reload --port 8000
```

## 2. Frontend Setup

In a separate terminal:

```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173**.

## 3. Connect Services (in the app)

Click the **gear icon** in the top-right of the webapp to open Settings:

- **Google (Gmail + Calendar)**: Click "Connect" — you'll be redirected to Google's OAuth consent screen. After authorizing, you're redirected back and connected.
- **Claude AI / ElevenLabs**: These are configured via `.env` — the Settings panel shows their connection status.

---

## Notes

- **Push-to-talk** requires **Chrome** or **Edge** (Firefox doesn't support `webkitSpeechRecognition`)
- SMS and Interac e-Transfer are **stubbed** — they log but don't connect to real services
- Gmail and Calendar integrations are **real** and will send actual emails / create events
- If ElevenLabs TTS fails, the app automatically falls back to browser speech synthesis
- Conversation history: `backend/data/history.db` (SQLite, auto-created)
- Google tokens: `backend/data/google_tokens.json` (auto-created after OAuth)
