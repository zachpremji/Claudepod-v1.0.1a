# Claude Pod — Setup Guide

## Prerequisites

- **Python 3.11+**
- **Node.js 18+** and npm
- A **Google Cloud** project with Gmail API and Calendar API enabled
- An **Anthropic** API key
- An **ElevenLabs** account (for text-to-speech)

---

## 1. Clone the Repository

```bash
git clone <repo-url>
cd claude-pod
```

## 2. Backend Setup

### Install Python Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select an existing one)
3. Enable the **Gmail API** and **Google Calendar API**
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Choose **Desktop App** as the application type
6. Download the credentials JSON file
7. Save it as `backend/credentials.json`

### Get Google Refresh Token

Run the one-time auth script:

```bash
cd backend
python setup_google_auth.py
```

This opens your browser for OAuth consent. After authorizing, it prints a `GOOGLE_REFRESH_TOKEN` — copy it.

### ElevenLabs Setup

1. Sign up at [ElevenLabs](https://elevenlabs.io/)
2. Get your API key from the profile page
3. Pick a voice ID (default Rachel = `21m00Tcm4TlvDq8ikWAM`)

### Configure Environment

```bash
cd backend
cp .env.example .env
```

Fill in your `.env`:

```
ANTHROPIC_API_KEY=sk-ant-...
ELEVENLABS_API_KEY=...
ELEVENLABS_VOICE_ID=21m00Tcm4TlvDq8ikWAM
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_REFRESH_TOKEN=...
```

You can find your Google Client ID and Secret in the downloaded `credentials.json` file.

### Start the Backend

```bash
cd backend
uvicorn main:app --reload --port 8000
```

## 3. Frontend Setup

In a separate terminal:

```bash
cd frontend
npm install
npm run dev
```

The app will be available at **http://localhost:5173**.

---

## Notes

- **Push-to-talk** requires **Chrome** or **Edge** (Firefox doesn't support `webkitSpeechRecognition`)
- SMS and Interac e-Transfer are **stubbed** — they log actions but don't connect to real services
- Gmail and Calendar integrations are **real** and will send actual emails / create actual events
- Conversation history is stored in `backend/data/history.db` (SQLite, auto-created)
- Interac transfer logs are stored in `backend/data/interac_ledger.json` (auto-created)

## Troubleshooting

- If Google auth fails, delete `backend/credentials.json` and re-download from Google Cloud Console
- If TTS fails, the frontend automatically falls back to browser speech synthesis
- Check the uvicorn console for detailed error tracebacks
