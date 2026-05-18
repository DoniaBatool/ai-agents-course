"use client";

import React, { useEffect, useState } from "react";

interface Props {
  /** Unique lesson identifier, e.g. "module-1/lesson-1" */
  lessonId: string;
}

const AUTH_URL = "https://ai-agents-course-w12u.vercel.app"; // update if URL changes

export default function LessonComplete({ lessonId }: Props) {
  const [status, setStatus]   = useState<"idle" | "loading" | "done" | "error">("idle");
  const [alreadyDone, setAlreadyDone] = useState(false);
  const [courseDone, setCourseDone]   = useState(false);
  const [certLink, setCertLink]       = useState("");
  const [totalDone, setTotalDone]     = useState(0);

  // On mount: check localStorage if already marked complete
  useEffect(() => {
    const done = localStorage.getItem(`lesson-done:${lessonId}`);
    if (done === "1") setAlreadyDone(true);
  }, [lessonId]);

  async function markComplete() {
    setStatus("loading");
    try {
      const res = await fetch(`${AUTH_URL}/api/progress`, {
        method:      "POST",
        credentials: "include",  // sends auth cookie
        headers:     { "Content-Type": "application/json" },
        body:        JSON.stringify({ lessonId }),
      });

      if (res.status === 401) {
        // Not logged in — redirect to signup
        window.location.href = `${AUTH_URL}/signup`;
        return;
      }

      const data = await res.json();
      localStorage.setItem(`lesson-done:${lessonId}`, "1");
      setAlreadyDone(true);
      setTotalDone(data.completedCount ?? 0);

      if (data.completed) {
        setCourseDone(true);
        setCertLink(data.certLink ?? `${AUTH_URL}/certificate/${data.certId}`);
      }

      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  if (alreadyDone && !courseDone) {
    return (
      <div style={styles.box}>
        <span style={styles.checkmark}>✓</span>
        <span style={styles.doneText}>Lesson completed</span>
      </div>
    );
  }

  if (courseDone) {
    return (
      <div style={{ ...styles.box, borderColor: "#c9a84c", background: "rgba(201,168,76,0.08)" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>🎓</div>
          <div style={{ color: "#f0d080", fontSize: 18, fontWeight: "bold", marginBottom: 6 }}>
            Course Complete!
          </div>
          <div style={{ color: "#a5b4fc", fontSize: 14, marginBottom: 16 }}>
            Congratulations! Your certificate has been sent to your email.
          </div>
          <a href={certLink} target="_blank" rel="noreferrer" style={styles.certBtn}>
            View My Certificate →
          </a>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.box}>
      <button
        onClick={markComplete}
        disabled={status === "loading"}
        style={{
          ...styles.btn,
          opacity: status === "loading" ? 0.7 : 1,
          cursor:  status === "loading" ? "wait" : "pointer",
        }}
      >
        {status === "loading" ? "Saving…" : "✓  Mark Lesson as Complete"}
      </button>
      {status === "error" && (
        <p style={{ color: "#f87171", fontSize: 13, marginTop: 8 }}>
          Something went wrong. Please try again.
        </p>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  box: {
    margin:       "32px 0",
    padding:      "20px 24px",
    borderRadius: 10,
    border:       "1.5px solid rgba(99,102,241,0.4)",
    background:   "rgba(99,102,241,0.06)",
    display:      "flex",
    alignItems:   "center",
    gap:          12,
  },
  btn: {
    background:   "linear-gradient(135deg, #7c3aed, #6366f1)",
    color:        "#ffffff",
    border:       "none",
    borderRadius: 8,
    padding:      "12px 28px",
    fontSize:     15,
    fontWeight:   "bold",
    cursor:       "pointer",
    fontFamily:   "inherit",
  },
  certBtn: {
    display:      "inline-block",
    background:   "linear-gradient(135deg, #c9a84c, #f0d080)",
    color:        "#06041a",
    textDecoration: "none",
    padding:      "10px 24px",
    borderRadius: 8,
    fontWeight:   "bold",
    fontSize:     14,
  },
  checkmark: { color: "#4ade80", fontSize: 20 },
  doneText:  { color: "#a5b4fc", fontSize: 14 },
};
