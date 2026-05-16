"""RAG search tool for OpenAI Agents SDK"""

from agents import function_tool
from qdrant_client import QdrantClient
from openai import OpenAI
import os

# Lazy initialization — clients created on first use, after .env is loaded
_openai_client = None
_qdrant_client = None

def get_openai():
    global _openai_client
    if _openai_client is None:
        _openai_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    return _openai_client

def get_qdrant():
    global _qdrant_client
    if _qdrant_client is None:
        _qdrant_client = QdrantClient(
            url=os.getenv("QDRANT_URL"),
            api_key=os.getenv("QDRANT_API_KEY"),
        )
    return _qdrant_client

COLLECTION = os.getenv("QDRANT_COLLECTION", "ai-agents-course")

def search_course_content_raw(query: str) -> str:
    """Search course content — plain function, no decorator."""
    try:
        embedding = get_openai().embeddings.create(
            model="text-embedding-3-small",
            input=query
        ).data[0].embedding

        results = get_qdrant().search(
            collection_name=os.getenv("QDRANT_COLLECTION", "ai-agents-course"),
            query_vector=embedding,
            limit=3
        )

        if not results:
            return "No relevant content found."

        return "\n\n---\n\n".join([
            f"**{r.payload.get('title', 'Section')}**\n{r.payload.get('content', '')}"
            for r in results
        ])
    except Exception as e:
        return f"Search unavailable: {str(e)}. Answer from training knowledge."


@function_tool
def search_course_content(query: str) -> str:
    """Search the AI Agents course content for relevant information."""
    try:
        # Create embedding for the query
        embedding = get_openai().embeddings.create(
            model="text-embedding-3-small",
            input=query
        ).data[0].embedding

        # Search Qdrant
        results = get_qdrant().search(
            collection_name=os.getenv("QDRANT_COLLECTION", "ai-agents-course"),
            query_vector=embedding,
            limit=3
        )

        if not results:
            return "No relevant content found in the course materials."

        context = "\n\n---\n\n".join([
            f"**{r.payload.get('title', 'Section')}**\n{r.payload.get('content', '')}"
            for r in results
        ])
        return context

    except Exception as e:
        # Return error as string so agent can handle it gracefully
        return f"Search unavailable: {str(e)}. Answer from your training knowledge instead."
