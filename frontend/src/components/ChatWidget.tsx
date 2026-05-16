import React, { useState, useRef, useEffect } from "react";
import styles from "./ChatWidget.module.css";

// TODO: Replace with your Cloud Run URL after deployment
const RAG_API =
  typeof window !== "undefined" && window.location.hostname !== "localhost"
    ? "https://ai-agents-rag-127978308986.asia-south1.run.app"
    : "http://localhost:8001";

interface Message {
  role: "user" | "assistant";
  text: string;
}

const STARTERS = [
  "What is an AI Agent?",
  "How do I use @function_tool?",
  "Explain the agentic loop",
  "What is RAG and how does it work?",
];

export default function ChatWidget() {
  const [open, setOpen]         = useState(false);
  const [input, setInput]       = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef  = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open, loading]);

  // Focus input when opened
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 200);
  }, [open]);

  // Listen for "Ask AI" from TextSelectionPopup
  useEffect(() => {
    const handler = (e: Event) => {
      const { message } = (e as CustomEvent).detail;
      setOpen(true);
      send(message);
    };
    window.addEventListener("tutor-ask", handler);
    return () => window.removeEventListener("tutor-ask", handler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const send = async (text?: string) => {
    const msg = (text ?? input).trim();
    if (!msg || loading) return;

    setInput("");
    setError(null);
    setMessages((prev) => [...prev, { role: "user", text: msg }]);
    setLoading(true);

    try {
      const res = await fetch(`${RAG_API}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg }),
      });
      if (!res.ok) throw new Error(`API error ${res.status}`);
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", text: data.response }]);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Unknown error";
      setError("Could not reach the AI Tutor. Make sure the RAG backend is running. (" + msg + ")");
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  };

  const clearChat = () => { setMessages([]); setError(null); };

  return (
    <>
      {/* ── Floating bubble ── */}
      <button
        className={`${styles.bubble} ${open ? styles.bubbleOpen : ""}`}
        onClick={() => setOpen((o) => !o)}
        aria-label="Open AI Tutor"
      >
        {open ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2a10 10 0 0 1 10 10c0 5.52-4.48 10-10 10a9.96 9.96 0 0 1-5.01-1.34L2 22l1.34-4.99A9.96 9.96 0 0 1 2 12 10 10 0 0 1 12 2z"/>
            <circle cx="8"  cy="12" r="1" fill="currentColor"/>
            <circle cx="12" cy="12" r="1" fill="currentColor"/>
            <circle cx="16" cy="12" r="1" fill="currentColor"/>
          </svg>
        )}
        {!open && messages.length === 0 && (
          <span className={styles.bubblePulse} />
        )}
      </button>

      {/* ── Chat panel ── */}
      <div className={`${styles.panel} ${open ? styles.panelOpen : ""}`}>

        {/* Header */}
        <div className={styles.panelHeader}>
          <div className={styles.headerInfo}>
            <div className={styles.avatar}>🤖</div>
            <div>
              <p className={styles.botName}>AI Tutor</p>
              <p className={styles.botStatus}>
                <span className={styles.statusDot} />
                RAG-powered · Course expert
              </p>
            </div>
          </div>
          {messages.length > 0 && (
            <button className={styles.clearBtn} onClick={clearChat} title="Clear chat">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/>
                <path d="M10 11v6"/><path d="M14 11v6"/>
              </svg>
            </button>
          )}
        </div>

        {/* Messages */}
        <div className={styles.messages}>
          {messages.length === 0 && (
            <div className={styles.welcome}>
              <p className={styles.welcomeText}>
                👋 Hi! I'm your AI Tutor. Ask me anything about this course.
              </p>
              <div className={styles.starters}>
                {STARTERS.map((s) => (
                  <button key={s} className={styles.starter} onClick={() => send(s)}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m, i) => (
            <div key={i} className={`${styles.msg} ${m.role === "user" ? styles.msgUser : styles.msgBot}`}>
              {m.role === "assistant" && <span className={styles.msgAvatar}>🤖</span>}
              <div className={`${styles.bubble2} ${m.role === "user" ? styles.bubble2User : styles.bubble2Bot}`}>
                {m.text.split("\n").map((line, j) => (
                  <span key={j}>{line}{j < m.text.split("\n").length - 1 && <br />}</span>
                ))}
              </div>
            </div>
          ))}

          {loading && (
            <div className={`${styles.msg} ${styles.msgBot}`}>
              <span className={styles.msgAvatar}>🤖</span>
              <div className={`${styles.bubble2} ${styles.bubble2Bot} ${styles.typingBubble}`}>
                <span className={styles.dot1} />
                <span className={styles.dot2} />
                <span className={styles.dot3} />
              </div>
            </div>
          )}

          {error && (
            <div className={styles.errorMsg}>
              ⚠️ {error}
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className={styles.inputRow}>
          <textarea
            ref={inputRef}
            className={styles.input}
            placeholder="Ask anything about the course…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            rows={1}
            disabled={loading}
          />
          <button
            className={`${styles.sendBtn} ${input.trim() && !loading ? styles.sendBtnActive : ""}`}
            onClick={() => send()}
            disabled={!input.trim() || loading}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="22" y1="2" x2="11" y2="13"/>
              <polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}
