# Deployment Guide

Three services, three platforms:

| Service | Platform | Trigger |
|---|---|---|
| `frontend/` — Docusaurus | Vercel | Push to `main` (auto) |
| `auth-server/` — Next.js + BetterAuth | Vercel | Push to `main` (auto) |
| `rag-agent/` — FastAPI | Google Cloud Run | GitHub Actions |

---

## Part 1 — Google Cloud Run (RAG Backend)

### Step 1 — Create GCP Project

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a new project → note the **Project ID** (e.g. `ai-agents-course-123`)
3. Enable these APIs (search each in the console):
   - **Cloud Run API**
   - **Container Registry API**
   - **Cloud Build API**

### Step 2 — Create Service Account

1. Go to **IAM & Admin → Service Accounts → Create Service Account**
2. Name: `github-deployer`
3. Assign these roles:
   - `Cloud Run Admin`
   - `Storage Admin`
   - `Service Account User`
4. Click **Keys → Add Key → JSON** → download the file
5. Open the downloaded JSON → copy entire contents

### Step 3 — Add GitHub Secrets

Go to your GitHub repo → **Settings → Secrets → Actions → New repository secret**:

| Secret name | Value |
|---|---|
| `GCP_PROJECT_ID` | Your GCP Project ID (e.g. `ai-agents-course-123`) |
| `GCP_SA_KEY` | Full JSON content of the service account key |
| `OPENAI_API_KEY` | Your OpenAI API key |
| `QDRANT_URL` | Your Qdrant cluster URL |
| `QDRANT_API_KEY` | Your Qdrant API key |

### Step 4 — Deploy

Push any change inside `rag-agent/` to `main` branch:

```bash
git add rag-agent/
git commit -m "deploy: update rag backend"
git push origin main
```

GitHub Actions will automatically:
1. Build the Docker image
2. Push to Google Container Registry
3. Deploy to Cloud Run (`asia-south1` region)
4. Print the live URL

Your backend URL will look like:
```
https://ai-agents-rag-xxxxxxxxxx-el.a.run.app
```

---

## Part 2 — Vercel (Auth Server)

### Step 1 — Create Vercel Project for Auth Server

1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. Import your GitHub repo
3. **IMPORTANT** — set Root Directory to `auth-server`
4. Framework: **Next.js** (auto-detected)
5. Do NOT deploy yet — add env vars first

### Step 2 — Add Environment Variables in Vercel

In **Project Settings → Environment Variables**, add:

| Variable | Value |
|---|---|
| `BETTER_AUTH_SECRET` | Any random 32+ char string (generate: `openssl rand -base64 32`) |
| `BETTER_AUTH_URL` | `https://your-auth-project.vercel.app` (your Vercel URL — set after first deploy) |
| `DATABASE_URL` | Your Neon Postgres connection string |
| `ALLOWED_ORIGINS` | `https://your-frontend.vercel.app,https://your-auth-project.vercel.app` |
| `NEXT_PUBLIC_FRONTEND_URL` | `https://your-frontend.vercel.app` |
| `NEXT_PUBLIC_AUTH_URL` | `https://your-auth-project.vercel.app` |

> **Note:** Deploy once first to get the Vercel URL, then update `BETTER_AUTH_URL`, `ALLOWED_ORIGINS`, and `NEXT_PUBLIC_AUTH_URL` with the real URL.

### Step 3 — Deploy

Click **Deploy**. Every push to `main` that touches `auth-server/` will auto-redeploy.

---

## Part 3 — Vercel (Frontend)

### Step 1 — Create Vercel Project for Frontend

1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. Import the same GitHub repo (second project)
3. **IMPORTANT** — set Root Directory to `frontend`
4. Framework: **Other** (Docusaurus is not in the list — `vercel.json` handles it)

### Step 2 — No Environment Variables Needed

The frontend is a static site. No server-side env vars required.

> If your Docusaurus pages call the RAG backend directly from the browser (fetch/axios), update the API URL in your frontend code to the Cloud Run URL.

### Step 3 — Deploy

Click **Deploy**. Every push to `main` that touches `frontend/` will auto-redeploy.

---

## Part 4 — Update URLs After Deployment

Once all three services are live, update these values:

### Auth Server (Vercel env vars → redeploy)

```
BETTER_AUTH_URL      = https://your-auth-project.vercel.app
ALLOWED_ORIGINS      = https://your-frontend.vercel.app,https://your-auth-project.vercel.app
NEXT_PUBLIC_AUTH_URL = https://your-auth-project.vercel.app
NEXT_PUBLIC_FRONTEND_URL = https://your-frontend.vercel.app
```

### Frontend — update navbar login/signup links

In `frontend/docusaurus.config.ts`, change the `href` values:

```ts
{ href: "https://your-auth-project.vercel.app/login",  label: "Login",   position: "right" },
{ href: "https://your-auth-project.vercel.app/signup", label: "Sign Up", position: "right" },
```

### RAG Agent — update CORS if needed

`rag-agent/main.py` currently allows all origins (`*`). For tighter security in production, replace `"*"` with your actual frontend URL:

```python
"Access-Control-Allow-Origin": "https://your-frontend.vercel.app",
```

---

## Quick Reference — All Live URLs

| Service | URL pattern |
|---|---|
| Frontend | `https://your-frontend.vercel.app` |
| Auth Server | `https://your-auth-project.vercel.app` |
| RAG Backend | `https://ai-agents-rag-xxxxxxxxxx-el.a.run.app` |
| RAG Health check | `https://ai-agents-rag-xxxxxxxxxx-el.a.run.app/health` |

---

## Troubleshooting

**Cloud Run deploy fails — permission denied**
→ Make sure the service account has `Cloud Run Admin` + `Storage Admin` roles.

**Auth server login broken after deploy**
→ `BETTER_AUTH_URL` must exactly match your Vercel deployment URL (no trailing slash).

**CORS errors from frontend to auth-server**
→ Add frontend URL to `ALLOWED_ORIGINS` in auth-server env vars, then redeploy.

**Docusaurus build fails on Vercel**
→ Ensure Node version is 18+. Set in Vercel project settings → General → Node.js Version → 18.x.
