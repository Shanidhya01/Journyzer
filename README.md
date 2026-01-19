# Journyzer

Full-stack trip planner:
- **Frontend:** Next.js App Router (in `frontend/`)
- **Backend:** Express + MongoDB + Firebase Admin auth (in `backend/`)

## Local development

### 1) Backend

1. Create `backend/.env` (use `backend/.env.example` as a template)
2. Install + run:
   - `cd backend`
   - `npm install`
   - `npm run dev`

Backend listens on `PORT` (default `5000`) and serves routes under `/api/*`.

### 2) Frontend

1. Create `frontend/.env.local` (use `frontend/.env.example` as a template)
2. Install + run:
   - `cd frontend`
   - `npm install`
   - `npm run dev`

Frontend runs on `http://localhost:3000`.

## Environment variables

### Backend (`backend/.env`)

Required:
- `MONGO_URI`
- `GEMINI_API_KEY`
- `GOOGLE_MAPS_KEY` (geocoding)
- `GOOGLE_MAPS_API_KEY` (static map images in PDFs)
- One of:
  - `FIREBASE_SERVICE_ACCOUNT_JSON` (recommended), **or**
  - `FIREBASE_SERVICE_ACCOUNT` (alias), **or**
  - `FIREBASE_PROJECT_ID` + `FIREBASE_CLIENT_EMAIL` + `FIREBASE_PRIVATE_KEY`

CORS (set at least one to your frontend URL):
- `CLIENT_ORIGIN` or `FRONTEND_URL` or `CORS_ORIGIN`

Note: the Firebase private key must usually be stored with `\\n` newlines and will be converted at runtime.

### Frontend (`frontend/.env.local`)

Required:
- `NEXT_PUBLIC_API_URL` (example: `http://localhost:5000` or `http://localhost:5000/api`)
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`

## Deploying to Vercel

You should deploy **two** Vercel projects: one for `backend/` and one for `frontend/`.

### Backend on Vercel

- Project Root Directory: `backend`
- This repo includes [backend/vercel.json](backend/vercel.json) which routes `/api/*` to a single Serverless Function.
- Entrypoint is [backend/api/index.js](backend/api/index.js) (Express app exported, no `listen()` call).

Add backend env vars in Vercel → Project → Settings → Environment Variables:
- `MONGO_URI`
- `GEMINI_API_KEY`
- `GOOGLE_MAPS_KEY`
- `GOOGLE_MAPS_API_KEY`
- `FIREBASE_SERVICE_ACCOUNT_JSON` (or the split vars)
- `FRONTEND_URL` (set to your deployed frontend URL, e.g. `https://<your-frontend>.vercel.app`)

### Frontend on Vercel

- Project Root Directory: `frontend`
- [frontend/vercel.json](frontend/vercel.json) only adds security headers; Vercel detects Next.js automatically.

Add frontend env vars:
- `NEXT_PUBLIC_API_URL` = `https://<your-backend-vercel-domain>` (or `.../api`)
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`

## Security reminders

- Do **not** commit `.env` files or service account JSON.
- If a Firebase service account key was ever shared publicly, revoke/rotate it in Google Cloud/Firebase and update your env vars.
