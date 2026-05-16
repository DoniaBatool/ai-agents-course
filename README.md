# AI Agents Development Course

Complete course platform for learning AI Agents with OpenAI Agents SDK.

## Project Structure

```
ai-agents-course/
├── frontend/       → Docusaurus course website  (Vercel)
├── auth-server/    → Next.js + Better-Auth       (Vercel)
└── rag-agent/      → FastAPI + OpenAI + Qdrant   (Google Cloud Run)
```

## Tech Stack

| Component | Technology | Hosting |
|-----------|-----------|---------|
| Frontend | Docusaurus 3.x | Vercel |
| Auth | Next.js + Better-Auth | Vercel |
| Backend | FastAPI + OpenAI Agents SDK | Google Cloud Run |
| Vector DB | Qdrant Cloud | Qdrant Cloud (free tier) |
| Database | Neon Postgres | Neon (free tier) |
| AI | OpenAI API (gpt-4o-mini) | OpenAI |

## Setup Guide

### Step 1: Create Required Accounts (All Free)
- [ ] [qdrant.io](https://qdrant.io) → Create cluster → Copy URL + API Key
- [ ] [neon.tech](https://neon.tech) → Create project → Copy connection string
- [ ] [OpenAI](https://platform.openai.com) → API Key (already have ✅)
- [ ] [Google Cloud](https://console.cloud.google.com) → New project → Enable Cloud Run API
- [ ] [Vercel](https://vercel.com) → Connect GitHub repo

### Step 2: Setup Environment Variables

**frontend/.env.local**
```
BACKEND_URL=http://localhost:8000
AUTH_URL=http://localhost:3001
```

**auth-server/.env.local**
```
BETTER_AUTH_SECRET=your-32-char-secret
BETTER_AUTH_URL=http://localhost:3001
DATABASE_URL=your-neon-connection-string
ALLOWED_ORIGINS=http://localhost:3000
```

**rag-agent/.env**
```
OPENAI_API_KEY=sk-your-key
QDRANT_URL=https://your-cluster.qdrant.io
QDRANT_API_KEY=your-qdrant-key
QDRANT_COLLECTION=ai-agents-course
DATABASE_URL=your-neon-connection-string
```

### Step 3: Run Locally

**Terminal 1 — Frontend**
```bash
cd frontend
npm install
npm start
# Opens at http://localhost:3000
```

**Terminal 2 — Auth Server**
```bash
cd auth-server
npm install
npm run dev
# Opens at http://localhost:3001
```

**Terminal 3 — RAG Backend**
```bash
cd rag-agent
pip install -e .
uvicorn main:app --reload --port 8000
# Opens at http://localhost:8000
```

### Step 4: Ingest Course Content into Qdrant
```bash
cd rag-agent
python scripts/ingest.py
```

### Step 5: Deploy

**Frontend + Auth → Vercel**
1. Push to GitHub
2. Import repo in Vercel
3. Set environment variables in Vercel dashboard
4. Deploy!

**Backend → Google Cloud Run**
1. Add GCP_SA_KEY, GCP_PROJECT_ID, OPENAI_API_KEY etc to GitHub Secrets
2. Push to main branch → Auto deploys via GitHub Actions

## Course Modules

- **Module 1**: AI Agents Fundamentals
- **Module 2**: OpenAI Agents SDK
- **Module 3**: Advanced Patterns (Memory, Multi-Agent, RAG)
- **Module 4**: Real Projects & Google Cloud Deployment
