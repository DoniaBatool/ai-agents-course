---
sidebar_position: 4
---

import FlashCardDeck from '@site/src/components/FlashCard';
import Quiz from '@site/src/components/Quiz';

# Streaming Responses

:::tip Learning Objectives — ⏱️ 25 min
- Understand why streaming dramatically improves user experience
- Implement streaming with Runner.run_streamed()
- Handle different stream event types
- Know when to stream vs when not to
:::

## Why Streaming Matters

Without streaming, your user sees nothing until the entire response is generated. For a short answer (2 seconds) this is fine. For a detailed analysis that takes 15 seconds — it feels broken.

**Streaming shows tokens as they're generated** — just like ChatGPT's typing effect. The user sees output immediately, knows the agent is working, and can start reading before it finishes.

<div style={{display:"flex",gap:"14px",margin:"20px 0",flexWrap:"wrap"}}>
  <div style={{flex:1,minWidth:"220px",background:"#1c0a0a",border:"1px solid #7f1d1d",borderRadius:"12px",padding:"16px"}}>
    <div style={{color:"#f87171",fontWeight:700,marginBottom:"8px"}}>❌ Without Streaming</div>
    <div style={{color:"#fca5a5",fontSize:"0.85rem",lineHeight:1.6}}>
      User: "Analyze this 500-word document"<br/>
      <em style={{color:"#64748b"}}>[15 seconds of silence]</em><br/>
      Agent: [full response appears all at once]<br/><br/>
      Feels broken. User wonders if it crashed.
    </div>
  </div>
  <div style={{flex:1,minWidth:"220px",background:"#0c1a0c",border:"1px solid #166534",borderRadius:"12px",padding:"16px"}}>
    <div style={{color:"#4ade80",fontWeight:700,marginBottom:"8px"}}>✅ With Streaming</div>
    <div style={{color:"#86efac",fontSize:"0.85rem",lineHeight:1.6}}>
      User: "Analyze this 500-word document"<br/>
      Agent: "The document discusses..." <em style={{color:"#64748b"}}>[typing]</em><br/>
      "...with three main themes:" <em style={{color:"#64748b"}}>[typing]</em><br/><br/>
      Feels alive. User reads as it generates.
    </div>
  </div>
</div>

---

## How Streaming Works

Instead of waiting for the full response, the API sends **events** as they happen:

```
event: raw_response_event  → token: "The"
event: raw_response_event  → token: " document"
event: raw_response_event  → token: " discusses"
event: tool_call_start     → tool: search_web called
event: tool_call_done      → result: "..."
event: raw_response_event  → token: " Based"
event: agent_updated_stream_event → agent finished
```

Your code handles each event type and decides what to show the user.

---

## Basic Streaming Implementation

```python
import asyncio
from dotenv import load_dotenv
from agents import Agent, Runner, function_tool
from agents.stream_events import RawResponsesStreamEvent

load_dotenv()

agent = Agent(
    name="Writer",
    instructions="You are an expert technical writer. Write clearly and in detail.",
    model="gpt-4o-mini",
)

async def stream_response(prompt: str):
    """Stream the agent's response token by token."""

    print("Agent: ", end="", flush=True)

    async with Runner.run_streamed(agent, prompt) as stream:
        async for event in stream.stream_events():

            # RawResponsesStreamEvent carries individual tokens
            if isinstance(event, RawResponsesStreamEvent):
                data = event.data
                # Check if this event has text content
                if hasattr(data, "delta") and hasattr(data.delta, "text"):
                    print(data.delta.text, end="", flush=True)

    print()  # newline after response

async def main():
    await stream_response(
        "Explain the difference between synchronous and asynchronous programming "
        "in Python, with examples."
    )

asyncio.run(main())
```

---

## Full Streaming with All Event Types

For production apps, you want to handle all event types — showing tool calls in progress, errors, and completion signals:

```python
import asyncio
from dotenv import load_dotenv
from agents import Agent, Runner, function_tool
from agents.stream_events import (
    RawResponsesStreamEvent,
    RunItemStreamEvent,
    AgentUpdatedStreamEvent,
)

load_dotenv()

@function_tool
async def get_news(topic: str) -> str:
    """Get the latest news headlines for a given topic."""
    # Simulated API call
    import asyncio
    await asyncio.sleep(0.5)  # simulate network delay
    return f"Latest news on '{topic}': AI regulation bill passes, tech stocks rally..."

agent = Agent(
    name="News Reporter",
    instructions="You are a news reporter. Use get_news to fetch current headlines, then write a brief summary.",
    tools=[get_news],
    model="gpt-4o-mini",
)

async def stream_with_status(prompt: str):
    """Stream response with tool call status indicators."""

    print(f"\nUser: {prompt}")
    print("─" * 50)

    async with Runner.run_streamed(agent, prompt) as stream:
        async for event in stream.stream_events():

            # Text tokens arriving
            if isinstance(event, RawResponsesStreamEvent):
                if hasattr(event.data, "delta") and hasattr(event.data.delta, "text"):
                    print(event.data.delta.text, end="", flush=True)

            # Tool calls and messages
            elif isinstance(event, RunItemStreamEvent):
                item = event.item

                # Tool is being called
                if hasattr(item, "type") and item.type == "tool_call_item":
                    print(f"\n🔧 Calling tool: {item.raw_item.name}...", flush=True)

                # Tool result received
                elif hasattr(item, "type") and item.type == "tool_call_output_item":
                    print(f"✅ Tool result received\n", flush=True)

    print("\n" + "─" * 50)
    print("✓ Stream complete")

async def main():
    await stream_with_status("What's the latest news on artificial intelligence?")

asyncio.run(main())
```

**Output:**
```
User: What's the latest news on artificial intelligence?
──────────────────────────────────────────────────
🔧 Calling tool: get_news...
✅ Tool result received

Based on the latest headlines, the AI space is seeing significant developments...
──────────────────────────────────────────────────
✓ Stream complete
```

---

## Streaming in a Web API (FastAPI + SSE)

In production web apps, you expose streaming via **Server-Sent Events (SSE)** — the browser receives tokens and displays them in real time, creating the ChatGPT-like effect.

```python
from fastapi import FastAPI
from fastapi.responses import StreamingResponse
from agents import Agent, Runner
from agents.stream_events import RawResponsesStreamEvent
import asyncio
import json

app = FastAPI()

agent = Agent(
    name="Web Assistant",
    instructions="You are a helpful assistant. Be detailed and thorough.",
    model="gpt-4o-mini",
)

@app.post("/chat/stream")
async def chat_stream(request: dict):
    """Stream agent responses via Server-Sent Events."""

    async def generate():
        async with Runner.run_streamed(agent, request["message"]) as stream:
            async for event in stream.stream_events():
                if isinstance(event, RawResponsesStreamEvent):
                    if hasattr(event.data, "delta") and hasattr(event.data.delta, "text"):
                        token = event.data.delta.text
                        # SSE format: "data: {json}\n\n"
                        yield f"data: {json.dumps({'token': token})}\n\n"

        # Signal stream end
        yield f"data: {json.dumps({'done': True})}\n\n"

    return StreamingResponse(
        generate(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )
```

**Frontend JavaScript to consume it:**
```javascript
const response = await fetch('/chat/stream', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ message: userInput }),
});

const reader = response.body.getReader();
const decoder = new TextDecoder();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;

  const lines = decoder.decode(value).split('\n');
  for (const line of lines) {
    if (line.startsWith('data: ')) {
      const data = JSON.parse(line.slice(6));
      if (data.token) outputDiv.textContent += data.token;
      if (data.done) console.log('Stream complete');
    }
  }
}
```

---

## Official Streaming API (from OpenAI Docs)

The [official SDK docs](https://openai.github.io/openai-agents-python/streaming/) use a slightly different pattern — `Runner.run_streamed()` returns a `RunResultStreaming` object directly (no `async with`), and you call `.stream_events()` on it:

```python
import asyncio
from openai.types.responses import ResponseTextDeltaEvent
from agents import Agent, Runner

agent = Agent(
    name="Joker",
    instructions="You are a helpful assistant.",
)

async def main():
    # Returns RunResultStreaming — no "async with" needed
    result = Runner.run_streamed(agent, input="Please tell me 5 jokes.")

    async for event in result.stream_events():
        if event.type == "raw_response_event" and isinstance(event.data, ResponseTextDeltaEvent):
            print(event.data.delta, end="", flush=True)

asyncio.run(main())
```

:::important Keep consuming until the iterator ends
A streaming run is **not complete** until the async iterator finishes. Post-processing like session persistence and history compaction can happen after the last visible token arrives. Always drain the full stream.
:::

---

## Run Item Events — Higher Level Updates

Instead of token-by-token raw events, `RunItemStreamEvent` fires when a **complete item** is generated — a message, a tool call, or a tool result. This is better for showing progress indicators:

```python
import asyncio
import random
from agents import Agent, ItemHelpers, Runner, function_tool

@function_tool
def how_many_jokes() -> int:
    return random.randint(1, 10)

async def main():
    agent = Agent(
        name="Joker",
        instructions="First call `how_many_jokes`, then tell that many jokes.",
        tools=[how_many_jokes],
    )

    result = Runner.run_streamed(agent, input="Hello")
    print("=== Run starting ===")

    async for event in result.stream_events():
        if event.type == "raw_response_event":
            continue  # Skip raw token events

        elif event.type == "agent_updated_stream_event":
            print(f"Agent updated: {event.new_agent.name}")

        elif event.type == "run_item_stream_event":
            if event.item.type == "tool_call_item":
                print("-- Tool was called")
            elif event.item.type == "tool_call_output_item":
                print(f"-- Tool output: {event.item.output}")
            elif event.item.type == "message_output_item":
                print(f"-- Message: {ItemHelpers.text_message_output(event.item)}")

    print("=== Run complete ===")

asyncio.run(main())
```

### All Run Item Event Names

| Event name | When it fires |
|---|---|
| `message_output_created` | A complete message was generated |
| `tool_called` | A tool was invoked |
| `tool_output` | Tool returned its result |
| `handoff_requested` | Agent is about to hand off |
| `handoff_occured` | Handoff completed (note: intentionally misspelled for backward compat) |
| `tool_search_called` | Hosted tool search request issued |
| `tool_search_output_created` | Tool search results arrived |
| `reasoning_item_created` | Reasoning item added |
| `mcp_approval_requested` | MCP tool needs approval |
| `mcp_approval_response` | MCP approval resolved |
| `mcp_list_tools` | MCP server listed available tools |

---

## Streaming + Human-in-the-Loop Approvals

Streaming integrates cleanly with tools that require approval before running. When an approval is needed, the stream pauses and you get `result.interruptions`:

```python
import asyncio
from agents import Agent, Runner

async def main():
    agent = Agent(
        name="File Manager",
        instructions="Help manage files. Ask permission before deleting.",
    )

    # First pass — stream until interrupted
    result = Runner.run_streamed(agent, "Delete temporary files if no longer needed.")
    async for _event in result.stream_events():
        pass  # drain the stream

    # Check if paused for approval
    if result.interruptions:
        state = result.to_state()
        for interruption in result.interruptions:
            # In production: ask the user; here we auto-approve
            print(f"Approving: {interruption}")
            state.approve(interruption)

        # Resume streaming from approved state
        result = Runner.run_streamed(agent, state)
        async for _event in result.stream_events():
            pass

asyncio.run(main())
```

---

## Cancelling a Stream

You can stop a stream mid-run with `result.cancel()`:

```python
result = Runner.run_streamed(agent, "Write a very long essay...")

async for event in result.stream_events():
    if event.type == "run_item_stream_event":
        if event.item.type == "message_output_item":
            text = ItemHelpers.text_message_output(event.item)
            if len(text) > 500:
                # Got enough — stop cleanly after this turn finishes
                result.cancel(mode="after_turn")
                break
```

| `cancel()` mode | Behavior |
|---|---|
| Default (`result.cancel()`) | Stop immediately |
| `result.cancel(mode="after_turn")` | Let the current turn finish, then stop |

---

## When to Stream vs When Not To

| Use Streaming | Don't Stream |
|---|---|
| Long text generation (>3 seconds) | Quick factual lookups |
| Conversational chat interfaces | Batch processing jobs |
| Creative writing / analysis | API endpoints consumed by other services |
| When UX quality matters | When you need the full output before acting |
| Real-time dashboards | Background tasks |

---

## 🃏 Flash Cards

<FlashCardDeck title="Streaming Responses" cards={[
  { question: "Why does streaming improve user experience?", answer: "Users see tokens as they're generated instead of waiting for the complete response. For long responses (5-30 seconds), this prevents the 'silence = broken' feeling and lets users start reading immediately." },
  { question: "What method do you use for streaming in the Agents SDK?", answer: "Runner.run_streamed(agent, message) — used as an async context manager. Yields stream events including raw tokens, tool call events, and completion signals." },
  { question: "What is RawResponsesStreamEvent?", answer: "A stream event that carries individual text tokens as the LLM generates them. Access the token via event.data.delta.text. These events fire continuously as text is generated." },
  { question: "What is Server-Sent Events (SSE)?", answer: "A web technology where the server streams data to the browser over a single HTTP connection. Each event is 'data: {json}\\n\\n'. Used to implement real-time streaming in web chat interfaces." },
  { question: "When should you NOT use streaming?", answer: "For batch processing, API endpoints consumed by other services, or when you need the complete output before taking action (e.g., validation, formatting). Streaming adds complexity when not needed." },
]} />

---

## 📝 Quiz

<Quiz title="Streaming Quiz" questions={[
  { question: "What is the main UX benefit of streaming for long responses?", options: ["It reduces API costs", "Users see output immediately as it's generated, avoiding the impression the app is broken", "It makes the agent faster", "It reduces token usage"], correct: 1, explanation: "For responses taking 5-30 seconds, showing nothing until completion feels like a crash. Streaming gives immediate visual feedback — users see the agent is actively working." },
  { question: "Which method enables streaming in the Agents SDK?", options: ["Runner.run(stream=True)", "Runner.run_streamed()", "Agent.stream()", "Runner.stream_response()"], correct: 1, explanation: "Runner.run_streamed(agent, message) is used as an async context manager. It yields events as they happen during agent execution." },
  { question: "What does the 'data: {json}\\n\\n' format represent?", options: ["JSON API response format", "Server-Sent Events (SSE) protocol format for streaming to browsers", "WebSocket message format", "FastAPI response schema"], correct: 1, explanation: "Server-Sent Events use the format 'data: {content}\\n\\n' for each event. Browsers have native support via the EventSource API, making SSE ideal for streaming chat interfaces." },
  { question: "When is streaming NOT recommended?", options: ["For chat interfaces", "For batch processing where you need the full output before acting", "For long text generation", "For real-time dashboards"], correct: 1, explanation: "If you need to process the complete output (validate it, store it, pass it to another system), streaming adds complexity without benefit. Use Runner.run() for batch/background tasks." },
  { question: "What event type carries individual text tokens?", options: ["AgentUpdatedStreamEvent", "RunItemStreamEvent", "RawResponsesStreamEvent", "TokenStreamEvent"], correct: 2, explanation: "RawResponsesStreamEvent carries individual tokens as the LLM generates them. Access via event.data.delta.text. This is what you print character-by-character to create the typing effect." },
]} />
