---
sidebar_position: 1
---

import FlashCardDeck from '@site/src/components/FlashCard';
import Quiz from '@site/src/components/Quiz';
import LessonComplete from '@site/src/components/LessonComplete';

# What Are AI Agents?

An **AI Agent** is a program that uses a Large Language Model (LLM) to perceive its environment, make decisions, and take actions — autonomously — to complete a goal.

Think of it this way: a regular chatbot is like a **vending machine** — you press a button, it gives you a snack. An AI Agent is like a **personal assistant** — you say "plan my trip to Dubai next month" and it searches flights, books hotels, checks your calendar, and sends you a summary. It *does things*, not just *says things*.

## Simple Definition

> **AI Agent = LLM + Tools + Memory + Goals**

Each piece plays a specific role:

- **LLM** — the brain. It reads the situation and decides what to do next.
- **Tools** — the hands. Python functions the agent can call: search the web, read a file, send an email, query a database.
- **Memory** — the notebook. The agent keeps track of what has happened so far (conversation history, retrieved facts, intermediate results).
- **Goals** — the mission. What the agent is trying to achieve, defined in its system prompt (`instructions`).

Without tools, an LLM can only talk. With tools, it can *act*. That's what makes agents powerful.

---

## Chatbot vs AI Agent

<div style={{display:"flex",gap:"16px",margin:"24px 0",flexWrap:"wrap"}}>
  <div style={{flex:1,minWidth:"220px",background:"linear-gradient(135deg,#1e1b4b,#312e81)",border:"1px solid #4338ca",borderRadius:"14px",padding:"20px"}}>
    <div style={{fontSize:"1.5rem",marginBottom:"8px"}}>💬</div>
    <div style={{color:"#a5b4fc",fontWeight:700,fontSize:"0.9rem",marginBottom:"12px",textTransform:"uppercase",letterSpacing:"0.08em"}}>Simple Chatbot</div>
    <div style={{display:"flex",flexDirection:"column",gap:"8px"}}>
      {["User asks a question","LLM generates a text reply","Done ✓"].map((s,i)=>(
        <div key={i} style={{display:"flex",alignItems:"center",gap:"8px",color:"#c7d2fe",fontSize:"0.85rem"}}>
          <span style={{background:"#3730a3",borderRadius:"50%",width:"22px",height:"22px",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:"0.75rem",fontWeight:700}}>{i+1}</span>
          {s}
        </div>
      ))}
    </div>
  </div>
  <div style={{flex:1,minWidth:"220px",background:"linear-gradient(135deg,#1a1035,#2e1065)",border:"1px solid #7c3aed",borderRadius:"14px",padding:"20px"}}>
    <div style={{fontSize:"1.5rem",marginBottom:"8px"}}>🤖</div>
    <div style={{color:"#c084fc",fontWeight:700,fontSize:"0.9rem",marginBottom:"12px",textTransform:"uppercase",letterSpacing:"0.08em"}}>AI Agent</div>
    <div style={{display:"flex",flexDirection:"column",gap:"8px"}}>
      {["User gives a goal","LLM reasons & plans","Calls tools (APIs, search…)","Observes result","Loops until goal complete ✓"].map((s,i)=>(
        <div key={i} style={{display:"flex",alignItems:"center",gap:"8px",color:"#e9d5ff",fontSize:"0.85rem"}}>
          <span style={{background:"#6d28d9",borderRadius:"50%",width:"22px",height:"22px",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:"0.75rem",fontWeight:700}}>{i+1}</span>
          {s}
        </div>
      ))}
    </div>
  </div>
</div>

---

## Real World Example

Let's make this concrete. Suppose a user says: *"What is the weather in Karachi today and should I carry an umbrella?"*

**A chatbot** would say: *"I don't have access to real-time weather data."*

**An AI Agent** would:
1. Recognize it needs current weather data
2. Call a `get_weather("Karachi")` tool
3. Get back: `{"temp": 34, "humidity": 90%, "rain_chance": 70%}`
4. Reason: 70% rain chance → umbrella recommended
5. Reply: *"It's 34°C in Karachi with 90% humidity and a 70% chance of rain. Yes, carry an umbrella!"*

```python
# Simple chatbot — just responds
response = openai.chat("What is the weather today?")
# Returns: "I don't have access to real-time weather data."

# AI Agent — actually checks the weather
agent = Agent(tools=[get_weather_tool])
result = agent.run("What is the weather in Karachi today?")
# Agent calls get_weather("Karachi") → returns real data
# Returns: "It's 34°C in Karachi with 70% rain chance. Carry an umbrella!"
```

The difference is not intelligence — both use the same LLM. The difference is **agency**: the ability to take real actions in the world.

---

## The Agentic Loop

Every AI agent runs through the same fundamental loop. This is sometimes called the **ReAct loop** (Reason + Act):

<div style={{margin:"24px 0",padding:"3px",background:"linear-gradient(90deg,#6366f1,#8b5cf6,#a855f7)",borderRadius:"16px"}}>
  <div style={{background:"#0f0c1e",borderRadius:"13px",padding:"24px"}}>
    <div style={{display:"flex",alignItems:"center",justifyContent:"center",flexWrap:"wrap",gap:"0"}}>
      {[
        {label:"User Input",icon:"👤",color:"#6366f1"},
        {label:"LLM Reasons",icon:"🧠",color:"#8b5cf6"},
        {label:"Tool Call",icon:"🔧",color:"#a855f7"},
        {label:"Observe",icon:"👁️",color:"#c084fc"},
        {label:"Final Answer",icon:"✅",color:"#34d399"},
      ].map((step,i,arr)=>(
        <div key={i} style={{display:"flex",alignItems:"center"}}>
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:"6px",minWidth:"80px"}}>
            <div style={{width:"52px",height:"52px",borderRadius:"50%",background:`${step.color}22`,border:`2px solid ${step.color}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.4rem"}}>{step.icon}</div>
            <span style={{color:"#e2e8f0",fontSize:"0.72rem",fontWeight:600,textAlign:"center",lineHeight:1.3}}>{step.label}</span>
          </div>
          {i < arr.length-1 && <div style={{color:"#6366f1",fontSize:"1.2rem",margin:"0 4px",marginBottom:"20px"}}>→</div>}
        </div>
      ))}
    </div>
    <div style={{textAlign:"center",marginTop:"16px",color:"#818cf8",fontSize:"0.78rem",letterSpacing:"0.05em"}}>↺ Loop repeats until goal is achieved</div>
  </div>
</div>

Here's what each step actually means:

**1. Receive** — the agent receives a user message, a scheduled trigger, or an event. This is the starting point of every turn.

**2. Reason** — the LLM reads the full conversation history (including any tool results so far) and decides: *"Do I have enough information to answer? Or do I need to call a tool?"*

**3. Call a Tool** — if the LLM decides it needs more information or needs to take an action, it outputs a structured JSON tool call: `{ "tool": "search_web", "args": { "query": "Karachi weather today" } }`.

**4. Observe** — your code runs the actual Python function, gets the result, and feeds it back to the LLM as a new message: `{ "role": "tool", "content": "{ temp: 34°C, rain: 70% }" }`.

**5. Loop** — the LLM reads the tool result and decides again: do I need another tool? Or can I answer now? This continues until the agent produces a final answer.

:::info Why does this matter?
This loop is what makes agents autonomous. A single user message can trigger 10+ tool calls behind the scenes — searching, calculating, reading, writing — before the final response is generated.
:::

---

## Why Agents Are a Paradigm Shift

Before agents, software was **deterministic** — code did exactly what you programmed. To add a feature, you had to write new code.

With agents, software is **goal-directed** — you describe *what* you want, not *how* to do it. The agent figures out the steps.

| Traditional Software | AI Agent |
|---|---|
| You define every step in code | You define the goal in plain language |
| Breaks on unexpected inputs | Adapts to new situations |
| Requires code change for new features | Give the agent a new tool |
| One function = one task | One agent = unlimited tasks |
| Static | Dynamic |

This is why companies like Salesforce, Notion, GitHub, and Linear are all building agents into their products. It's not just a trend — it's a fundamentally better way to build software for tasks that involve judgment, context, and multi-step reasoning.

---

## What Agents Are NOT Good At

Agents are powerful but not magic. They struggle with:

- **Precise arithmetic** — LLMs are bad at math. Always give agents a `calculate()` tool.
- **Real-time data** — the LLM's knowledge has a cutoff date. Tools are how you get fresh data.
- **Very long tasks with no checkpoints** — agents can drift. Break long tasks into sub-agents.
- **High-stakes irreversible actions** — don't let an agent delete your database without a human confirmation step.

Understanding these limitations makes you a better agent builder — you'll know when to add guardrails, human-in-the-loop checks, and validation steps.

---

## 🃏 Flash Cards

Review the key concepts from this lesson:

<FlashCardDeck
  title="What Are AI Agents — Flash Cards"
  cards={[
    {
      question: "What is an AI Agent?",
      answer: "An AI Agent is an autonomous system that uses an LLM to make decisions and take actions — going beyond simple question answering to actually complete multi-step goals using tools, memory, and a reasoning loop."
    },
    {
      question: "What is the formula for an AI Agent?",
      answer: "AI Agent = LLM + Tools + Memory + Goals. The LLM reasons, tools take actions in the real world, memory tracks context, and goals define what to achieve."
    },
    {
      question: "What is the 'agentic loop' (ReAct loop)?",
      answer: "The cycle where an agent: (1) Receives input → (2) LLM reasons → (3) Calls a tool → (4) Observes result → (5) Reasons again → loops until the goal is complete. A single user message can trigger many tool calls."
    },
    {
      question: "What is a 'tool' in the OpenAI Agents SDK?",
      answer: "A Python function decorated with @function_tool that the agent can call to interact with external systems — like web search, file reading, database queries, or API calls. Tools are what give agents the ability to act."
    },
    {
      question: "How does an AI Agent differ from a chatbot?",
      answer: "A chatbot responds to messages with text. An agent actively takes actions, uses tools, runs in a loop, and can complete complex multi-step tasks autonomously. The difference is agency — the ability to act, not just talk."
    },
    {
      question: "What tasks are agents NOT good at?",
      answer: "Precise arithmetic (use a calculator tool), real-time data (use an API tool), very long multi-hour tasks (break into sub-agents), and irreversible high-stakes actions (add human approval steps)."
    },
  ]}
/>

---

## 📝 Chapter Quiz

<Quiz
  title="What Are AI Agents — Quiz"
  questions={[
    {
      question: "Which of the following best describes an AI Agent?",
      options: [
        "A simple question-answering chatbot",
        "An AI system that reasons, uses tools, and takes actions to complete goals",
        "A pre-trained language model like GPT-4",
        "A database that stores conversation history"
      ],
      correct: 1,
      explanation: "AI Agents go beyond responding — they actively reason, call tools, and loop until they complete complex, multi-step goals autonomously."
    },
    {
      question: "What are the four components of the AI Agent formula?",
      options: [
        "Input, Output, Training, Deployment",
        "Python, FastAPI, OpenAI, Qdrant",
        "LLM, Tools, Memory, Goals",
        "Model, Dataset, Fine-tuning, Inference"
      ],
      correct: 2,
      explanation: "An AI Agent = LLM (for reasoning) + Tools (for taking actions) + Memory (to track context) + Goals (what to accomplish)."
    },
    {
      question: "In the OpenAI Agents SDK, what decorator marks a Python function as a callable tool?",
      options: [
        "@agent_function",
        "@tool_use",
        "@function_tool",
        "@sdk_tool"
      ],
      correct: 2,
      explanation: "The @function_tool decorator from the agents SDK registers a Python function as a tool the agent can call during its reasoning loop."
    },
    {
      question: "What happens during the 'agentic loop'?",
      options: [
        "The model is retrained on new data",
        "The agent repeatedly reasons → calls tools → observes results until the goal is complete",
        "The user must approve every tool call manually",
        "The agent searches the internet without any LLM reasoning"
      ],
      correct: 1,
      explanation: "The agentic loop is: receive input → LLM reasons → calls a tool → observes result → reasons again → loops until done. This is what makes agents autonomous."
    },
    {
      question: "Why should you NOT let an agent perform irreversible high-stakes actions without a safety check?",
      options: [
        "Agents are too slow for such tasks",
        "LLMs can make mistakes and agents can drift — always add human-in-the-loop for critical operations",
        "The OpenAI API does not support it",
        "Irreversible actions cost more tokens"
      ],
      correct: 1,
      explanation: "Agents can misinterpret goals or make errors — especially on long tasks. For deleting data, sending emails to thousands, or financial transactions, always add a confirmation step."
    },
  ]}
/>

<LessonComplete lessonId="module-1/what-are-ai-agents" />
