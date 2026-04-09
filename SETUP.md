# Claude Pod — Setup

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

Open **http://localhost:5173** — you can chat with Claude right away.

---

## Connect Google (Gmail + Calendar)

Run the setup script — it walks you through everything:

```bash
cd backend
python setup_google.py
```

If you don't have a `credentials.json` yet, the script tells you exactly what to do:

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a project → enable Gmail API + Calendar API
3. Create an OAuth credential (Desktop app type) → download the JSON
4. Save it as `backend/credentials.json`
5. Re-run `python setup_google.py` → browser opens → sign in → done

## Connect ElevenLabs (voice)

Optional — without it, browser TTS is used. To enable:

1. Open the app → click the gear icon → Settings
2. Paste your ElevenLabs API key → Save

---

## Notes

- Push-to-talk requires Chrome or Edge
- SMS and Interac are stubbed (log only)
- Gmail and Calendar are real — they send actual emails and create events
