"""Ingest course docs into Qdrant vector database"""

import os, glob, frontmatter
from openai import OpenAI
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct
from dotenv import load_dotenv

load_dotenv()

client = OpenAI()
qdrant = QdrantClient(url=os.getenv("QDRANT_URL"), api_key=os.getenv("QDRANT_API_KEY"))
COLLECTION = os.getenv("QDRANT_COLLECTION", "ai-agents-course")

def create_collection():
    qdrant.recreate_collection(
        collection_name=COLLECTION,
        vectors_config=VectorParams(size=1536, distance=Distance.COSINE),
    )
    print(f"✅ Collection '{COLLECTION}' created")

def ingest_docs(docs_path: str = "../frontend/docs"):
    points = []
    md_files = glob.glob(f"{docs_path}/**/*.md", recursive=True)
    print(f"Found {len(md_files)} markdown files")

    for idx, path in enumerate(md_files):
        post = frontmatter.load(path)
        content = str(post.content)[:2000]  # limit chunk size
        title = post.get("title", os.path.basename(path))

        embedding = client.embeddings.create(
            model="text-embedding-3-small", input=content
        ).data[0].embedding

        points.append(PointStruct(
            id=idx,
            vector=embedding,
            payload={"title": title, "content": content, "path": path}
        ))
        print(f"  ✅ Ingested: {title}")

    qdrant.upsert(collection_name=COLLECTION, points=points)
    print(f"\n🎉 {len(points)} documents ingested into Qdrant!")

if __name__ == "__main__":
    create_collection()
    ingest_docs()
