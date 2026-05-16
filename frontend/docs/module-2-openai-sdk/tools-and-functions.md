---
sidebar_position: 3
---

import FlashCardDeck from '@site/src/components/FlashCard';
import Quiz from '@site/src/components/Quiz';

# Tools and Functions

:::tip Learning Objectives — ⏱️ 35 min
- Understand the full power of tools in the Agents SDK
- Build tools with proper typing, error handling, and validation
- Create tools that call real APIs
- Understand tool design patterns for production agents
:::

## What Are Tools Really?

Tools are the bridge between the LLM's *intelligence* and the *real world*. An LLM without tools can only generate text about things. An LLM with tools can actually *do* things.

Think of it this way:
- **Without tools:** "Here's how you would check the stock price..." (just text)
- **With tools:** *actually calls Yahoo Finance API, returns real data* → "AAPL is currently $189.32, up 2.3%"

The LLM decides *when* and *what* to call. Your Python function does the actual work. The SDK is the messenger between them.

---

## Tool Anatomy Deep Dive

```python
from agents import function_tool
from typing import Optional

@function_tool
def search_products(
    query: str,
    category: Optional[str] = None,
    max_price: float = 500.0,
    in_stock_only: bool = True,
) -> list[dict]:
    """
    Search the product catalog for items matching the query.

    Args:
        query: Search term (e.g. 'wireless headphones', 'laptop stand')
        category: Optional category filter (electronics, clothing, books, etc.)
        max_price: Maximum price in USD (default: 500)
        in_stock_only: If True, only return items currently in stock

    Returns:
        List of products with id, name, price, category, and stock status
    """
    # Your actual implementation here
    results = db.search(query, category=category, max_price=max_price)
    if in_stock_only:
        results = [r for r in results if r["in_stock"]]
    return results
```

**What the SDK extracts automatically:**

| Python | → | JSON Schema |
|---|---|---|
| Function name | → | Tool name (`search_products`) |
| Docstring | → | Tool description |
| `str` | → | `"type": "string"` |
| `float` | → | `"type": "number"` |
| `bool` | → | `"type": "boolean"` |
| `Optional[str]` | → | Optional field (not required) |
| Default `= None` | → | Not in `required` list |

---

## Type System — Getting This Right Matters

The type hints you write directly affect how the LLM understands your tools. Wrong or missing types lead to wrong arguments being passed.

```python
from typing import Optional, Literal
from pydantic import BaseModel

# ── Basic types ──────────────────────────────────────────────────────────────

@function_tool
def book_flight(
    origin: str,          # "LAH" or "Lahore"
    destination: str,     # "DXB" or "Dubai"
    date: str,            # "2024-03-15" (ISO format)
    passengers: int = 1,  # number 1-9
    seat_class: Literal["economy", "business", "first"] = "economy",
) -> dict:
    """Book a flight between two cities."""
    ...

# ── Pydantic models for complex inputs ──────────────────────────────────────

class Address(BaseModel):
    street: str
    city: str
    country: str
    postal_code: str

@function_tool
def create_shipment(
    sender: Address,
    recipient: Address,
    weight_kg: float,
    express: bool = False,
) -> dict:
    """Create a shipping order between two addresses."""
    ...

# ── Return types — be explicit ──────────────────────────────────────────────

@function_tool
def get_user_profile(user_id: str) -> dict:
    """Get complete profile for a user by their ID.
    Returns: name, email, plan, created_at, last_login"""
    return {
        "name": "Ahmed Khan",
        "email": "ahmed@example.com",
        "plan": "premium",
        "created_at": "2024-01-15",
        "last_login": "2024-03-10"
    }
```

---

## Error Handling in Tools

**Never let an unhandled exception crash your agent.** The SDK will stop the tool loop on an unhandled error. Instead, return error information as a string — the LLM can read it and decide what to do.

```python
@function_tool
def fetch_stock_price(ticker: str) -> str:
    """Get the current stock price for a given ticker symbol (e.g. AAPL, TSLA)."""
    try:
        # Call real API
        response = requests.get(f"https://api.example.com/stock/{ticker}", timeout=5)
        response.raise_for_status()
        data = response.json()
        return f"{ticker}: ${data['price']:.2f} ({data['change']:+.2f}%)"

    except requests.exceptions.Timeout:
        return f"Error: Stock API timed out for {ticker}. Try again in a moment."

    except requests.exceptions.HTTPError as e:
        if e.response.status_code == 404:
            return f"Error: Ticker '{ticker}' not found. Check the symbol is correct."
        return f"Error: API returned {e.response.status_code}"

    except Exception as e:
        return f"Error fetching {ticker}: {str(e)}"
```

When the agent receives an error string, it can:
- Try a different ticker symbol
- Inform the user the API is unavailable
- Try an alternative approach

This is much better than a crash.

---

## Real-World Tool Examples

### Tool: Web Search

```python
import httpx
from agents import function_tool

@function_tool
async def search_web(query: str, num_results: int = 5) -> str:
    """
    Search the web for current information on any topic.
    Use this for: recent events, real-time data, facts that may have changed,
    pricing, availability, or anything requiring up-to-date information.

    Returns top search result snippets with their source URLs.
    """
    async with httpx.AsyncClient() as client:
        response = await client.get(
            "https://api.search.example.com/search",
            params={"q": query, "num": num_results},
            headers={"Authorization": f"Bearer {os.getenv('SEARCH_API_KEY')}"}
        )
        data = response.json()

    results = []
    for item in data["results"]:
        results.append(f"• {item['title']}\n  {item['snippet']}\n  Source: {item['url']}")

    return "\n\n".join(results) if results else "No results found."
```

### Tool: Database Query

```python
import sqlite3
from agents import function_tool

@function_tool
def query_orders(
    customer_email: str,
    status: Optional[str] = None,
    limit: int = 10,
) -> str:
    """
    Query customer orders from the database.
    Returns order history with order ID, date, items, total, and status.

    status options: 'pending', 'shipped', 'delivered', 'cancelled'
    """
    conn = sqlite3.connect("orders.db")
    cursor = conn.cursor()

    if status:
        cursor.execute(
            "SELECT id, date, total, status FROM orders WHERE customer_email=? AND status=? LIMIT ?",
            (customer_email, status, limit)
        )
    else:
        cursor.execute(
            "SELECT id, date, total, status FROM orders WHERE customer_email=? LIMIT ?",
            (customer_email, limit)
        )

    rows = cursor.fetchall()
    conn.close()

    if not rows:
        return f"No orders found for {customer_email}"

    lines = [f"Orders for {customer_email}:"]
    for order_id, date, total, status in rows:
        lines.append(f"  #{order_id} | {date} | ${total:.2f} | {status}")

    return "\n".join(lines)
```

### Tool: Send Email

```python
import smtplib
from email.message import EmailMessage
from agents import function_tool

@function_tool
def send_email(
    to: str,
    subject: str,
    body: str,
    cc: Optional[str] = None,
) -> str:
    """
    Send an email to a recipient. Use this only when the user explicitly
    requests to send an email — always confirm the recipient and content first.

    Returns 'sent' on success or an error message on failure.
    """
    try:
        msg = EmailMessage()
        msg["From"] = os.getenv("EMAIL_FROM")
        msg["To"] = to
        msg["Subject"] = subject
        if cc:
            msg["Cc"] = cc
        msg.set_content(body)

        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as smtp:
            smtp.login(os.getenv("EMAIL_USER"), os.getenv("EMAIL_PASS"))
            smtp.send_message(msg)

        return f"Email sent successfully to {to}"

    except Exception as e:
        return f"Failed to send email: {str(e)}"
```

---

## Tool Design Patterns

<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:"14px",margin:"20px 0"}}>

<div style={{background:"#0c1a0c",border:"1px solid #166534",borderRadius:"12px",padding:"16px"}}>
  <div style={{color:"#4ade80",fontWeight:700,fontSize:"0.9rem",marginBottom:"8px"}}>✅ Single Responsibility</div>
  <div style={{color:"#86efac",fontSize:"0.82rem"}}>Each tool does ONE thing well. Don't make a tool that searches, filters, AND sorts. Split into separate tools — the agent can combine them.</div>
</div>

<div style={{background:"#0c1a0c",border:"1px solid #166534",borderRadius:"12px",padding:"16px"}}>
  <div style={{color:"#4ade80",fontWeight:700,fontSize:"0.9rem",marginBottom:"8px"}}>✅ Return Strings for Errors</div>
  <div style={{color:"#86efac",fontSize:"0.82rem"}}>Return error messages as strings, not exceptions. The LLM can read "Error: ticker not found" and react intelligently. Exceptions stop the loop.</div>
</div>

<div style={{background:"#0c1a0c",border:"1px solid #166534",borderRadius:"12px",padding:"16px"}}>
  <div style={{color:"#4ade80",fontWeight:700,fontSize:"0.9rem",marginBottom:"8px"}}>✅ Use Async for I/O</div>
  <div style={{color:"#86efac",fontSize:"0.82rem"}}>API calls, DB queries, file reads — make them async. The SDK supports async tools natively, allowing concurrent tool execution.</div>
</div>

<div style={{background:"#1c0a0a",border:"1px solid #7f1d1d",borderRadius:"12px",padding:"16px"}}>
  <div style={{color:"#f87171",fontWeight:700,fontSize:"0.9rem",marginBottom:"8px"}}>❌ Avoid Side Effects Without Warning</div>
  <div style={{color:"#fca5a5",fontSize:"0.82rem"}}>Tools that send emails, delete records, or charge cards need extra care. Add confirmation steps in your instructions or require explicit user approval.</div>
</div>

<div style={{background:"#1c0a0a",border:"1px solid #7f1d1d",borderRadius:"12px",padding:"16px"}}>
  <div style={{color:"#f87171",fontWeight:700,fontSize:"0.9rem",marginBottom:"8px"}}>❌ Don't Return Huge Payloads</div>
  <div style={{color:"#fca5a5",fontSize:"0.82rem"}}>Returning 10,000 tokens of raw data wastes context budget. Summarize, paginate, or filter before returning. Keep tool results focused.</div>
</div>

</div>

---

## 🃏 Flash Cards

<FlashCardDeck title="Tools and Functions" cards={[
  { question: "What three things does @function_tool extract from your function?", answer: "1) Tool name (from function name), 2) Tool description (from docstring), 3) Parameter schema (from type hints). All automatic — no extra configuration needed." },
  { question: "Why should tool errors return strings instead of raising exceptions?", answer: "Unhandled exceptions stop the agent loop. Returning an error string lets the LLM read it and decide how to proceed — try again, use a different approach, or inform the user." },
  { question: "What is the 'single responsibility' principle for tools?", answer: "Each tool should do ONE thing well. Don't combine search + filter + sort into one tool. Split into separate tools — the agent can combine them in sequence as needed." },
  { question: "When should tools be async?", answer: "Any tool that does I/O: API calls, database queries, file reads, HTTP requests. Use async def and httpx/asyncio. The SDK supports concurrent async tool execution." },
  { question: "How does Optional[str] affect the JSON schema?", answer: "Optional[str] = None means the parameter is not in the 'required' list. The LLM knows it's optional and may omit it. Without Optional, the LLM is required to provide a value." },
  { question: "Why should tool docstrings be detailed?", answer: "The docstring IS what the LLM reads to decide whether to call this tool. A vague docstring leads to wrong or missed tool calls. Be specific about what it does, when to use it, and what it returns." },
]} />

---

## 📝 Quiz

<Quiz title="Tools Quiz" questions={[
  { question: "What happens if a tool raises an unhandled exception?", options: ["The agent retries automatically 3 times", "The agent loop stops and returns an error", "The exception is silently ignored", "The LLM handles the exception"], correct: 1, explanation: "Unhandled exceptions break the agent loop. Always wrap tool logic in try/except and return error strings — the LLM can read them and decide how to handle the situation." },
  { question: "What Python annotation makes a parameter optional in a tool?", options: ["@optional", "Optional[str] = None", "str | None without a default", "nullable: str"], correct: 1, explanation: "Optional[str] = None marks the parameter as optional in the JSON schema. The LLM knows it doesn't have to provide this argument and can omit it when not relevant." },
  { question: "A tool returns 50,000 characters of raw API data. What's the problem?", options: ["Nothing — more data is always better", "It wastes the context window budget and slows the agent loop", "The API will reject the response", "Tools can't return strings longer than 1000 chars"], correct: 1, explanation: "Large tool returns consume the context window. In a multi-turn conversation with many tool calls, this can exhaust the 128K token budget quickly. Summarize or filter before returning." },
  { question: "When is it best to use async tools?", options: ["Always, for all tools", "Only for tools that call external APIs, databases, or do file I/O", "Never — agents don't support async", "Only when using gpt-4o"], correct: 1, explanation: "Async tools allow the SDK to execute multiple tool calls concurrently. Use async def for any tool that does I/O: HTTP requests, database queries, file reads." },
  { question: "What is wrong with this docstring: def get_data(id: str) -> dict: \"\"\"Get data.\"\"\"", options: ["It's too long", "It's too vague — the LLM doesn't know what data, when to call it, or what it returns", "Docstrings must be single-line", "The return type is wrong"], correct: 1, explanation: "The docstring is the LLM's only description of the tool. 'Get data' tells it nothing. Write: what it fetches, what id format to use, what the dict contains." },
]} />
