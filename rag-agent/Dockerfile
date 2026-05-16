FROM python:3.11-slim

WORKDIR /app

# Install dependencies first (layer caching — only re-runs if requirements change)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy source code
COPY . .

# Cloud Run listens on 8080
EXPOSE 8080

# Use 2 workers for production throughput
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080", "--workers", "2"]
