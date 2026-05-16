<div align="center">

# 🤖 AI Agents Development Course

**Master the future of software — where AI thinks, decides & acts.**

Build intelligent, production-ready AI agents from scratch — with tools, memory, multi-agent orchestration, RAG, and cloud deployment.

[![Live Site](https://img.shields.io/badge/🌐_Live_Site-ai--agents--course--xi.vercel.app-7c3aed?style=for-the-badge)](https://ai-agents-course-xi.vercel.app)
[![Auth Server](https://img.shields.io/badge/🔐_Auth_Server-Vercel-black?style=for-the-badge)](https://ai-agents-course-w12u.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-DoniaBatool-181717?style=for-the-badge&logo=github)](https://github.com/DoniaBatool/ai-agents-course)

</div>

---

## 📚 Course Modules

```
┌─────────────────────────────────────────────────────────────────┐
│                    AI AGENTS COURSE ROADMAP                     │
├─────────────┬──────────────┬───────────────┬────────────────────┤
│  MODULE 1   │   MODULE 2   │   MODULE 3    │     MODULE 4       │
│ ─────────── │ ──────────── │ ───────────── │ ────────────────── │
│ Fundamentals│ OpenAI SDK   │ Advanced      │ Real Projects      │
│             │              │ Patterns      │ & Deployment       │
│ • What are  │ • Agents SDK │ • Memory      │ • Build 5 projects │
│   AI Agents │ • Tools      │ • RAG         │ • Google Cloud Run │
│ • LLMs      │ • Handoffs   │ • Multi-Agent │ • ChatGPT Apps SDK │
│ • Prompting │ • Streaming  │ • Guardrails  │ • Monetization     │
│ • Python    │ • Lifecycle  │ • Tracing     │ • Paddle Payments  │
└─────────────┴──────────────┴───────────────┴────────────────────┘
```

---

## 🏗️ Architecture

```
                        ┌─────────────────────────────────┐
                        │         USER BROWSER            │
                        └──────────────┬──────────────────┘
                                       │
               ┌───────────────────────┼───────────────────────┐
               │                       │                       │
               ▼                       ▼                       ▼
    ┌──────────────────┐   ┌───────────────────┐   ┌──────────────────┐
    │    FRONTEND      │   │   AUTH SERVER     │   │   RAG BACKEND    │
    │  Docusaurus 3    │   │  Next.js 15       │   │  FastAPI         │
    │                  │◄──│  BetterAuth       │   │  OpenAI Agents   │
    │  • Course pages  │   │  Drizzle ORM      │   │  SDK             │
    │  • Flashcards    │   │                   │   │                  │
    │  • Quizzes       │   │  • Login/Signup   │   │  • /chat         │
    │  • AI Chatbot    │   │  • Session mgmt   │   │  • /translate    │
    │                  │   │  • User profiles  │   │  • /health       │
    └──────────────────┘   └─────────┬─────────┘   └────────┬─────────┘
           │ Vercel                  │ Vercel                │ GCP
           │                         │                       │ Cloud Run
           │                         ▼                       ▼
           │               ┌─────────────────┐   ┌──────────────────┐
           │               │  Neon Postgres  │   │  Qdrant Cloud    │
           │               │  (user data)    │   │  (vector search) │
           │               └─────────────────┘   └──────────────────┘
           │
           └──► OpenAI API (GPT-4o-mini + text-embedding-3-small)
```

---

## 🛠️ Tech Stack

| Layer | Technology | Hosting | Purpose |
|-------|-----------|---------|---------|
| 🎨 **Frontend** | Docusaurus 3 + TypeScript | Vercel | Course website & content |
| 🔐 **Auth** | Next.js 15 + BetterAuth | Vercel | Login, signup, sessions |
| 🤖 **AI Backend** | FastAPI + OpenAI Agents SDK | Google Cloud Run | RAG chatbot & AI tutor |
| 🗄️ **Database** | Neon Postgres + Drizzle ORM | Neon (free) | User data & sessions |
| 📦 **Vector DB** | Qdrant Cloud | Qdrant (free) | Course content search |
| 🧠 **AI Models** | GPT-4o-mini + text-embedding-3-small | OpenAI | Chat & embeddings |
| 🚀 **CI/CD** | GitHub Actions | GitHub | Auto-deploy backend |

---

## 📁 Project Structure

```
ai-agents-course/
│
├── 🎨 frontend/                    ← Docusaurus course website
│   ├── docs/                       ← All course content (MDX)
│   │   ├── intro.md
│   │   ├── module-1-fundamentals/  (4 lessons)
│   │   ├── module-2-openai-sdk/    (4 lessons)
│   │   ├── module-3-advanced/      (4 lessons)
│   │   └── module-4-projects/      (5 lessons + projects)
│   ├── src/
│   │   ├── components/             ← FlashCard, Quiz, ChatWidget
│   │   ├── pages/index.tsx         ← Homepage (Spline 3D + Timeline)
│   │   └── theme/Root.tsx          ← Auth guard
│   └── vercel.json
│
├── 🔐 auth-server/                 ← Next.js 15 + BetterAuth
│   ├── src/app/
│   │   ├── login/page.tsx
│   │   ├── signup/page.tsx
│   │   └── api/auth/[...all]/      ← BetterAuth handler
│   └── src/lib/
│       ├── auth.ts                 ← BetterAuth config
│       ├── auth-client.ts
│       └── db/schema.ts            ← Drizzle schema
│
├── 🤖 rag-agent/                   ← FastAPI + OpenAI Agents SDK
│   ├── main.py                     ← API endpoints
│   ├── rag/agent.py                ← Course tutor agent
│   ├── scripts/index_content.py    ← Index docs into Qdrant
│   ├── requirements.txt
│   └── Dockerfile
│
├── .github/workflows/
│   └── deploy-backend.yml          ← Auto-deploy to Cloud Run
│
├── .gitignore
├── DEPLOYMENT.md
└── README.md
```

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js 18+
- Python 3.11+
- Accounts: [Neon](https://neon.tech), [Qdrant](https://qdrant.io), [OpenAI](https://platform.openai.com)

### 1️⃣ Clone & Install

```bash
git clone https://github.com/DoniaBatool/ai-agents-course.git
cd ai-agents-course
```

### 2️⃣ Setup Environment Variables

**`auth-server/.env`**
```env
BETTER_AUTH_SECRET=your-32-char-random-string
BETTER_AUTH_URL=http://localhost:3001
DATABASE_URL=postgresql://user:pass@host/db?sslmode=require
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3000
NEXT_PUBLIC_AUTH_URL=http://localhost:3001
```

**`rag-agent/.env`**
```env
OPENAI_API_KEY=sk-...
QDRANT_URL=https://your-cluster.qdrant.io
QDRANT_API_KEY=your-qdrant-key
```

### 3️⃣ Run All Services

```bash
# Terminal 1 — Frontend (http://localhost:3000)
cd frontend && npm install && npm start

# Terminal 2 — Auth Server (http://localhost:3001)
cd auth-server && npm install && npm run db:push && npm run dev

# Terminal 3 — RAG Backend (http://localhost:8001)
cd rag-agent
python3 -m venv venv && source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8001
```

### 4️⃣ Index Course Content into Qdrant

```bash
cd rag-agent
source venv/bin/activate
python scripts/index_content.py
```

---

## ☁️ Deployment

```
┌──────────────────────────────────────────────────────────────┐
│                    DEPLOYMENT FLOW                           │
│                                                              │
│   git push → main                                           │
│        │                                                     │
│        ├──► Vercel (frontend)    → ai-agents-course-xi      │
│        ├──► Vercel (auth-server) → ai-agents-course-w12u    │
│        └──► GitHub Actions       → Google Cloud Run         │
│                                       (rag-agent)           │
└──────────────────────────────────────────────────────────────┘
```

See [DEPLOYMENT.md](./DEPLOYMENT.md) for full step-by-step guide including GCP setup, GitHub Secrets, and post-deploy URL updates.

---

## 🔐 Auth Flow

```
User visits /course-page
        │
        ▼
  Logged in? ──NO──► Redirect to login page
        │                    │
       YES                   ▼
        │             Login / Signup
        │                    │
        ▼                    ▼
  Course unlocked ◄── Redirect back with ?auth=1
```

---

## 💳 Monetization (Pakistan-Friendly)

| Method | Details |
|--------|---------|
| **Paddle** | Payment processor — supports Pakistan payout |
| **Payoneer** | Receive international payments → Pakistani bank |
| **Free Tier** | Public lessons accessible without login |
| **Premium** | Full course + AI Tutor requires signup |

---

## 📊 Interactive Features

```
Every lesson includes:
┌─────────────────────────────────────────┐
│  📖 Lesson Content (MDX)                │
│  ┌─────────┐  ┌──────────┐             │
│  │🃏 Flash  │  │📝 Quiz   │             │
│  │  Cards  │  │(4 options│             │
│  │(flip to │  │+ explain)│             │
│  │ answer) │  │          │             │
│  └─────────┘  └──────────┘             │
│                                         │
│  💬 AI Tutor (bottom-right chatbot)     │
│  🔍 Text Selection Popup (ask AI)       │
└─────────────────────────────────────────┘
```

---

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'feat: add my feature'`
4. Push: `git push origin feature/my-feature`
5. Open a Pull Request

---

<div align="center">

Built with ❤️ by **Donia Batool**

[![OpenAI](https://img.shields.io/badge/OpenAI-Agents_SDK-412991?style=flat&logo=openai)](https://openai.com)
[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![Next.js](https://img.shields.io/badge/Next.js_15-black?style=flat&logo=next.js)](https://nextjs.org)
[![Docusaurus](https://img.shields.io/badge/Docusaurus_3-3ECC5F?style=flat&logo=docusaurus&logoColor=white)](https://docusaurus.io)
[![Vercel](https://img.shields.io/badge/Vercel-black?style=flat&logo=vercel)](https://vercel.com)

</div>
