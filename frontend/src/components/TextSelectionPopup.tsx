import React, { useState, useEffect, useRef, useCallback } from "react";
import styles from "./TextSelectionPopup.module.css";

// TODO: Replace with your Cloud Run URL after deployment
const RAG_API =
  typeof window !== "undefined" && window.location.hostname !== "localhost"
    ? "https://ai-agents-rag-127978308986.asia-south1.run.app"
    : "http://localhost:8001";

interface PopupState {
  x: number;
  y: number;
  text: string;
}

export default function TextSelectionPopup() {
  const [popup, setPopup]             = useState<PopupState | null>(null);
  const [translation, setTranslation] = useState<string | null>(null);
  const [translating, setTranslating] = useState(false);
  const [translateError, setTranslateError] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  // ── detect text selection ────────────────────────────────────────────────
  const handleMouseUp = useCallback((e: MouseEvent) => {
    // Don't trigger inside the popup itself
    if (popupRef.current?.contains(e.target as Node)) return;

    setTimeout(() => {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;
      const text = selection.toString().trim();
      if (text.length < 5) { setPopup(null); setTranslation(null); return; }

      const range = selection.getRangeAt(0);
      const rect  = range.getBoundingClientRect();
      setPopup({
        x: rect.left + rect.width / 2 + window.scrollX,
        y: rect.top  + window.scrollY - 12,
        text,
      });
      setTranslation(null);
      setTranslateError(false);
    }, 10);
  }, []);

  const handleMouseDown = useCallback((e: MouseEvent) => {
    if (!popupRef.current?.contains(e.target as Node)) {
      setPopup(null);
      setTranslation(null);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mouseup",   handleMouseUp);
    document.addEventListener("mousedown", handleMouseDown);
    return () => {
      document.removeEventListener("mouseup",   handleMouseUp);
      document.removeEventListener("mousedown", handleMouseDown);
    };
  }, [handleMouseUp, handleMouseDown]);

  // ── Ask AI ──────────────────────────────────────────────────────────────
  const askAI = () => {
    if (!popup) return;
    const message = `Please explain this in more detail:\n\n"${popup.text}"`;
    window.dispatchEvent(new CustomEvent("tutor-ask", { detail: { message } }));
    setPopup(null);
    setTranslation(null);
  };

  // ── Translate ────────────────────────────────────────────────────────────
  const translate = async () => {
    if (!popup || translating) return;
    setTranslating(true);
    setTranslateError(false);
    try {
      const res = await fetch(`${RAG_API}/translate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: popup.text }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setTranslation(data.translation);
    } catch {
      setTranslateError(true);
    } finally {
      setTranslating(false);
    }
  };

  if (!popup) return null;

  return (
    <div
      ref={popupRef}
      className={styles.wrapper}
      style={{ left: popup.x, top: popup.y }}
      data-selection-popup="true"
    >
      {/* Action buttons */}
      {!translation && (
        <div className={styles.toolbar}>
          <button className={`${styles.btn} ${styles.btnAI}`} onClick={askAI}>
            <span>🤖</span> Ask AI
          </button>
          <div className={styles.divider} />
          <button
            className={`${styles.btn} ${styles.btnTranslate}`}
            onClick={translate}
            disabled={translating}
          >
            {translating ? (
              <span className={styles.spinner} />
            ) : (
              <span>🌐</span>
            )}
            اردو
          </button>
          <div className={styles.arrow} />
        </div>
      )}

      {/* Translation result */}
      {(translation || translateError) && (
        <div className={styles.translationCard}>
          <div className={styles.translationHeader}>
            <span className={styles.translationLabel}>🌐 Urdu Translation</span>
            <button className={styles.closeBtn} onClick={() => { setTranslation(null); setPopup(null); }}>×</button>
          </div>
          {translateError ? (
            <p className={styles.errorText}>⚠️ Could not translate. Make sure the RAG backend is running.</p>
          ) : (
            <p className={styles.translationText} dir="rtl">{translation}</p>
          )}
          <button className={styles.askAfterTranslate} onClick={askAI}>
            🤖 Also ask AI about this
          </button>
          <div className={styles.arrow} />
        </div>
      )}
    </div>
  );
}
