"use client";

import { useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

// ── Eye icons ──────────────────────────────────────────────────────────────────
function EyeOpen() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  );
}
function EyeOff() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  );
}

export default function LoginPage() {
  const [email,        setEmail]        = useState("");
  const [password,     setPassword]     = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error,        setError]        = useState("");
  const [loading,      setLoading]      = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await authClient.signIn.email({ email, password });
      if (result.error) {
        setError(result.error.message ?? "Login failed. Please check your credentials.");
      } else {
        // Redirect back to frontend with auth=1 + user name
        const params = new URLSearchParams(window.location.search);
        const redirect = params.get("redirect");
        const frontendUrl = process.env.NEXT_PUBLIC_FRONTEND_URL ?? "http://localhost:3000";
        const target = redirect ?? frontendUrl;
        const separator = target.includes("?") ? "&" : "?";
        const userName = encodeURIComponent((result.data as any)?.user?.name ?? "");
        const token    = encodeURIComponent((result.data as any)?.session?.token ?? "");
        window.location.href = `${target}${separator}auth=1&name=${userName}&token=${token}`;
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0a0618 0%, #0f0c1e 50%, #0a0618 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px",
      fontFamily: "'Inter', system-ui, sans-serif",
    }}>

      {/* Background glow */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(99,102,241,0.15) 0%, transparent 70%)",
      }} />

      <div style={{ width: "100%", maxWidth: "420px", position: "relative", zIndex: 1 }}>

        {/* Logo / Brand */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            width: "56px", height: "56px", borderRadius: "16px",
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            marginBottom: "16px", fontSize: "1.5rem",
          }}>
            🤖
          </div>
          <h1 style={{
            fontSize: "1.6rem", fontWeight: 800, color: "#fff",
            margin: "0 0 6px",
          }}>
            Welcome back
          </h1>
          <p style={{ color: "#94a3b8", fontSize: "0.9rem", margin: 0 }}>
            Sign in to continue your AI Agents journey
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: "rgba(15,12,30,0.8)",
          border: "1px solid rgba(99,102,241,0.2)",
          borderRadius: "20px",
          padding: "32px",
          backdropFilter: "blur(12px)",
          boxShadow: "0 0 40px rgba(99,102,241,0.08)",
        }}>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>

            {/* Email */}
            <div>
              <label style={{ display: "block", color: "#a5b4fc", fontSize: "0.82rem", fontWeight: 600, marginBottom: "8px", letterSpacing: "0.04em" }}>
                EMAIL ADDRESS
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                style={{
                  width: "100%", padding: "12px 16px",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(99,102,241,0.25)",
                  borderRadius: "12px", color: "#e2e8f0",
                  fontSize: "0.95rem", outline: "none",
                  boxSizing: "border-box",
                  transition: "border-color 0.2s",
                }}
                onFocus={e => e.target.style.borderColor = "#6366f1"}
                onBlur={e => e.target.style.borderColor = "rgba(99,102,241,0.25)"}
              />
            </div>

            {/* Password with eye toggle */}
            <div>
              <label style={{ display: "block", color: "#a5b4fc", fontSize: "0.82rem", fontWeight: 600, marginBottom: "8px", letterSpacing: "0.04em" }}>
                PASSWORD
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  style={{
                    width: "100%", padding: "12px 46px 12px 16px",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(99,102,241,0.25)",
                    borderRadius: "12px", color: "#e2e8f0",
                    fontSize: "0.95rem", outline: "none",
                    boxSizing: "border-box",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={e => e.target.style.borderColor = "#6366f1"}
                  onBlur={e => e.target.style.borderColor = "rgba(99,102,241,0.25)"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  style={{
                    position: "absolute", right: "14px", top: "50%",
                    transform: "translateY(-50%)",
                    background: "none", border: "none",
                    color: showPassword ? "#a855f7" : "#475569",
                    cursor: "pointer", padding: "2px",
                    display: "flex", alignItems: "center",
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#a855f7")}
                  onMouseLeave={e => (e.currentTarget.style.color = showPassword ? "#a855f7" : "#475569")}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff /> : <EyeOpen />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div style={{
                background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)",
                borderRadius: "10px", padding: "12px 14px",
                color: "#fca5a5", fontSize: "0.85rem",
                display: "flex", alignItems: "center", gap: "8px",
              }}>
                ⚠️ {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: "13px",
                background: loading
                  ? "rgba(99,102,241,0.4)"
                  : "linear-gradient(135deg, #6366f1, #8b5cf6)",
                border: "none", borderRadius: "12px",
                color: "#fff", fontSize: "0.95rem", fontWeight: 700,
                cursor: loading ? "not-allowed" : "pointer",
                transition: "opacity 0.2s, transform 0.1s",
                marginTop: "4px",
              }}
              onMouseEnter={e => { if (!loading) (e.target as HTMLButtonElement).style.opacity = "0.9"; }}
              onMouseLeave={e => { (e.target as HTMLButtonElement).style.opacity = "1"; }}
            >
              {loading ? "Signing in…" : "Sign In →"}
            </button>

          </form>

          {/* Divider */}
          <div style={{
            display: "flex", alignItems: "center", gap: "12px",
            margin: "24px 0",
          }}>
            <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.08)" }} />
            <span style={{ color: "#475569", fontSize: "0.78rem" }}>NEW TO THE COURSE?</span>
            <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.08)" }} />
          </div>

          <Link href="/signup" style={{
            display: "block", textAlign: "center",
            padding: "12px",
            background: "rgba(99,102,241,0.08)",
            border: "1px solid rgba(99,102,241,0.2)",
            borderRadius: "12px", color: "#a5b4fc",
            fontSize: "0.9rem", fontWeight: 600,
            textDecoration: "none",
            transition: "background 0.2s",
          }}
            onMouseEnter={e => (e.currentTarget.style.background = "rgba(99,102,241,0.15)")}
            onMouseLeave={e => (e.currentTarget.style.background = "rgba(99,102,241,0.08)")}
          >
            Create an account
          </Link>
        </div>

        {/* Footer */}
        <p style={{ textAlign: "center", color: "#334155", fontSize: "0.78rem", marginTop: "20px" }}>
          AI Agents Development Course · Built with OpenAI Agents SDK
        </p>
      </div>
    </main>
  );
}
