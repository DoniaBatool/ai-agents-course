"""AI Agents Course — RAG Backend Server"""

# ⚠️ load_dotenv() MUST be first — before any other imports that use env vars
from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import Response, JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from pydantic import BaseModel
from agents import Runner
from rag.agent import course_agent
from openai import AsyncOpenAI
import os

openai_client = AsyncOpenAI()

app = FastAPI(title="AI Agents Course API", version="1.0.0")

# ── Manual CORS middleware (bypasses Starlette's built-in CORS quirks) ──────────
class CORSMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        cors_headers = {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS, PATCH",
            "Access-Control-Allow-Headers": "Content-Type, Authorization, Accept, X-Requested-With",
            "Access-Control-Max-Age": "86400",
        }
        # Respond to preflight immediately — no route lookup needed
        if request.method == "OPTIONS":
            return Response(status_code=200, headers=cors_headers)

        response = await call_next(request)
        for k, v in cors_headers.items():
            response.headers[k] = v
        return response

app.add_middleware(CORSMiddleware)


# ── Pydantic models ────────────────────────────────────────────────────────────
class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    response: str

class TranslateRequest(BaseModel):
    text: str

class TranslateResponse(BaseModel):
    translation: str


# ── Routes ─────────────────────────────────────────────────────────────────────
@app.get("/")
def root():
    return {"status": "AI Agents Course API running"}


@app.get("/health")
def health():
    return {"status": "healthy"}


@app.get("/debug/search")
async def debug_search():
    """Debug: test Qdrant connection directly."""
    import os
    from rag.tools import search_course_content_raw
    result = search_course_content_raw("what is an AI agent")
    return {
        "result": result[:300],
        "qdrant_url_set": bool(os.getenv("QDRANT_URL")),
        "qdrant_key_set": bool(os.getenv("QDRANT_API_KEY")),
        "openai_key_set": bool(os.getenv("OPENAI_API_KEY")),
    }


@app.post("/translate", response_model=TranslateResponse)
async def translate(request: TranslateRequest):
    """Translate any text to Urdu using GPT-4o-mini."""
    try:
        result = await openai_client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are an expert Urdu translator. Translate the given text to clear, natural Urdu script. Return ONLY the Urdu translation, no extra commentary."},
                {"role": "user", "content": request.text},
            ],
        )
        return TranslateResponse(translation=result.choices[0].message.content)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """Send a message to the AI course tutor (RAG-powered)."""
    try:
        from rag.tools import search_course_content_raw

        # 1. Search course content
        context = search_course_content_raw(request.message)

        # 2. Call OpenAI directly with context
        result = await openai_client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system",
                    "content": """You are an expert AI tutor for the AI Agents Development Course.
Use the provided course content to answer questions accurately.
Give clear, practical explanations with code examples when relevant.
Answer in the same language the student uses (English or Urdu)."""
                },
                {
                    "role": "user",
                    "content": f"Course content:\n{context}\n\nQuestion: {request.message}"
                },
            ],
        )
        return ChatResponse(response=result.choices[0].message.content)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
