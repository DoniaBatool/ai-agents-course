"use client";

import { useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

const STEPS = ["Account", "Background", "Done"];

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

export default function SignupPage() {
  const [step,          setStep]          = useState(0);
  const [name,          setName]          = useState("");
  const [email,         setEmail]         = useState("");
  const [password,      setPassword]      = useState("");
  const [confirm,       setConfirm]       = useState("");
  const [showPassword,  setShowPassword]  = useState(false);
  const [showConfirm,   setShowConfirm]   = useState(false);
  const [expLevel,      setExpLevel]      = useState("");
  const [pyLevel,       setPyLevel]       = useState("");
  const [goal,          setGoal]          = useState("");
  const [error,         setError]         = useState("");
  const [loading,       setLoading]       = useState(false);

  // ── Step 1: Account details ────────────────────────────────────────────────
  const handleStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setStep(1);
  };

  // ── Step 2: Background survey + create account ─────────────────────────────
  const handleStep2 = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await authClient.signUp.email({ name, email, password });
      if (result.error) {
        setError(result.error.message ?? "Signup failed.");
        return;
      }
      // Redirect to frontend with auth=1 so course pages unlock
      const frontendUrl = process.env.NEXT_PUBLIC_FRONTEND_URL ?? "http://localhost:3000";
      window.location.href = `${frontendUrl}?auth=1`;
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "12px 16px",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(99,102,241,0.25)",
    borderRadius: "12px", color: "#e2e8f0",
    fontSize: "0.95rem", outline: "none",
    boxSizing: "border-box",
  };

  const labelStyle: React.CSSProperties = {
    display: "block", color: "#a5b4fc",
    fontSize: "0.82rem", fontWeight: 600,
    marginBottom: "8px", letterSpacing: "0.04em",
  };

  return (
    <main style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0a0618 0%, #0f0c1e 50%, #0a0618 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "24px",
      fontFamily: "'Inter', system-ui, sans-serif",
    }}>
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(99,102,241,0.15) 0%, transparent 70%)" }} />

      <div style={{ width: "100%", maxWidth: "440px", position: "relative", zIndex: 1 }}>

        {/* Brand */}
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            width: "56px", height: "56px", borderRadius: "16px",
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            marginBottom: "16px", fontSize: "1.5rem",
          }}>🤖</div>
          <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#fff", margin: "0 0 6px" }}>
            Join the course
          </h1>
          <p style={{ color: "#94a3b8", fontSize: "0.9rem", margin: 0 }}>
            Build production-ready AI Agents from scratch
          </p>
        </div>

        {/* Step indicator */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0", marginBottom: "24px" }}>
          {STEPS.map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center" }}>
              <div style={{
                width: "28px", height: "28px", borderRadius: "50%",
                background: i <= step ? "linear-gradient(135deg,#6366f1,#8b5cf6)" : "rgba(255,255,255,0.06)",
                border: i === step ? "none" : "1px solid rgba(99,102,241,0.2)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "0.72rem", fontWeight: 700,
                color: i <= step ? "#fff" : "#475569",
                transition: "all 0.3s",
              }}>
                {i < step ? "✓" : i + 1}
              </div>
              <span style={{
                fontSize: "0.78rem", marginLeft: "6px",
                color: i === step ? "#a5b4fc" : "#475569",
                fontWeight: i === step ? 600 : 400,
              }}>{s}</span>
              {i < STEPS.length - 1 && (
                <div style={{
                  width: "32px", height: "1px",
                  background: i < step ? "#6366f1" : "rgba(255,255,255,0.08)",
                  margin: "0 10px", transition: "background 0.3s",
                }} />
              )}
            </div>
          ))}
        </div>

        {/* Card */}
        <div style={{
          background: "rgba(15,12,30,0.8)",
          border: "1px solid rgba(99,102,241,0.2)",
          borderRadius: "20px", padding: "32px",
          backdropFilter: "blur(12px)",
          boxShadow: "0 0 40px rgba(99,102,241,0.08)",
        }}>

          {/* ── STEP 0: Account ── */}
          {step === 0 && (
            <form onSubmit={handleStep1} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={labelStyle}>FULL NAME</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)}
                  required placeholder="Ali Hassan" style={inputStyle}
                  onFocus={e => e.target.style.borderColor="#6366f1"}
                  onBlur={e => e.target.style.borderColor="rgba(99,102,241,0.25)"} />
              </div>
              <div>
                <label style={labelStyle}>EMAIL ADDRESS</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  required placeholder="you@example.com" style={inputStyle}
                  onFocus={e => e.target.style.borderColor="#6366f1"}
                  onBlur={e => e.target.style.borderColor="rgba(99,102,241,0.25)"} />
              </div>
              <div>
                <label style={labelStyle}>PASSWORD</label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    placeholder="Min. 8 characters"
                    style={{ ...inputStyle, paddingRight: "46px" }}
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
              <div>
                <label style={labelStyle}>CONFIRM PASSWORD</label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showConfirm ? "text" : "password"}
                    value={confirm}
                    onChange={e => setConfirm(e.target.value)}
                    required
                    placeholder="••••••••"
                    style={{ ...inputStyle, paddingRight: "46px" }}
                    onFocus={e => e.target.style.borderColor = "#6366f1"}
                    onBlur={e => e.target.style.borderColor = "rgba(99,102,241,0.25)"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(v => !v)}
                    style={{
                      position: "absolute", right: "14px", top: "50%",
                      transform: "translateY(-50%)",
                      background: "none", border: "none",
                      color: showConfirm ? "#a855f7" : "#475569",
                      cursor: "pointer", padding: "2px",
                      display: "flex", alignItems: "center",
                      transition: "color 0.2s",
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#a855f7")}
                    onMouseLeave={e => (e.currentTarget.style.color = showConfirm ? "#a855f7" : "#475569")}
                    aria-label={showConfirm ? "Hide password" : "Show password"}
                  >
                    {showConfirm ? <EyeOff /> : <EyeOpen />}
                  </button>
                </div>
              </div>
              {error && (
                <div style={{ background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.3)",
                  borderRadius:"10px", padding:"12px 14px", color:"#fca5a5", fontSize:"0.85rem" }}>
                  ⚠️ {error}
                </div>
              )}
              <button type="submit" style={{
                padding:"13px", marginTop:"4px",
                background:"linear-gradient(135deg,#6366f1,#8b5cf6)",
                border:"none", borderRadius:"12px",
                color:"#fff", fontSize:"0.95rem", fontWeight:700, cursor:"pointer",
              }}>
                Continue →
              </button>
            </form>
          )}

          {/* ── STEP 1: Background survey ── */}
          {step === 1 && (
            <form onSubmit={handleStep2} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              <p style={{ color:"#94a3b8", fontSize:"0.88rem", margin:0, lineHeight:1.6 }}>
                Help us personalize your experience — just 2 quick questions.
              </p>

              {/* Experience level */}
              <div>
                <label style={labelStyle}>YOUR EXPERIENCE LEVEL</label>
                <div style={{ display:"flex", gap:"8px", flexWrap:"wrap" }}>
                  {[
                    { value:"beginner",     label:"🌱 Beginner",     desc:"New to programming" },
                    { value:"intermediate", label:"⚡ Intermediate",  desc:"Know some Python" },
                    { value:"advanced",     label:"🚀 Advanced",      desc:"Experienced dev" },
                  ].map(opt => (
                    <button key={opt.value} type="button"
                      onClick={() => setExpLevel(opt.value)}
                      style={{
                        flex:1, minWidth:"100px", padding:"10px 8px",
                        background: expLevel===opt.value ? "rgba(99,102,241,0.2)" : "rgba(255,255,255,0.03)",
                        border: expLevel===opt.value ? "1px solid #6366f1" : "1px solid rgba(99,102,241,0.15)",
                        borderRadius:"10px", color: expLevel===opt.value ? "#a5b4fc" : "#64748b",
                        fontSize:"0.8rem", cursor:"pointer", textAlign:"center", lineHeight:1.4,
                      }}>
                      <div style={{fontWeight:600}}>{opt.label}</div>
                      <div style={{fontSize:"0.72rem",marginTop:"2px"}}>{opt.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Python level */}
              <div>
                <label style={labelStyle}>PYTHON KNOWLEDGE</label>
                <div style={{ display:"flex", gap:"8px", flexWrap:"wrap" }}>
                  {[
                    { value:"none",         label:"None" },
                    { value:"basic",        label:"Basic" },
                    { value:"intermediate", label:"Intermediate" },
                    { value:"advanced",     label:"Advanced" },
                  ].map(opt => (
                    <button key={opt.value} type="button"
                      onClick={() => setPyLevel(opt.value)}
                      style={{
                        flex:1, padding:"10px 8px",
                        background: pyLevel===opt.value ? "rgba(139,92,246,0.2)" : "rgba(255,255,255,0.03)",
                        border: pyLevel===opt.value ? "1px solid #8b5cf6" : "1px solid rgba(139,92,246,0.15)",
                        borderRadius:"10px", color: pyLevel===opt.value ? "#c084fc" : "#64748b",
                        fontSize:"0.82rem", fontWeight:600, cursor:"pointer",
                      }}>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Goal */}
              <div>
                <label style={labelStyle}>YOUR GOAL (OPTIONAL)</label>
                <textarea value={goal} onChange={e => setGoal(e.target.value)}
                  placeholder="e.g. Build a customer support agent for my startup..."
                  rows={2}
                  style={{ ...inputStyle, resize:"none", lineHeight:1.5 }}
                  onFocus={e => e.target.style.borderColor="#6366f1"}
                  onBlur={e => e.target.style.borderColor="rgba(99,102,241,0.25)"} />
              </div>

              {error && (
                <div style={{ background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.3)",
                  borderRadius:"10px", padding:"12px 14px", color:"#fca5a5", fontSize:"0.85rem" }}>
                  ⚠️ {error}
                </div>
              )}

              <div style={{ display:"flex", gap:"10px" }}>
                <button type="button" onClick={() => setStep(0)}
                  style={{
                    flex:1, padding:"13px",
                    background:"rgba(255,255,255,0.04)",
                    border:"1px solid rgba(255,255,255,0.1)",
                    borderRadius:"12px", color:"#94a3b8",
                    fontSize:"0.9rem", cursor:"pointer",
                  }}>
                  ← Back
                </button>
                <button type="submit" disabled={loading}
                  style={{
                    flex:2, padding:"13px",
                    background: loading ? "rgba(99,102,241,0.4)" : "linear-gradient(135deg,#6366f1,#8b5cf6)",
                    border:"none", borderRadius:"12px",
                    color:"#fff", fontSize:"0.95rem", fontWeight:700,
                    cursor: loading ? "not-allowed" : "pointer",
                  }}>
                  {loading ? "Creating account…" : "Create Account →"}
                </button>
              </div>
            </form>
          )}

          {/* ── STEP 2: Success ── */}
          {step === 2 && (
            <div style={{ textAlign:"center", padding:"16px 0" }}>
              <div style={{
                width:"72px", height:"72px", borderRadius:"50%",
                background:"linear-gradient(135deg,#22c55e,#16a34a)",
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:"2rem", margin:"0 auto 20px",
              }}>✓</div>
              <h2 style={{ color:"#fff", fontSize:"1.4rem", fontWeight:800, margin:"0 0 10px" }}>
                You&apos;re in! 🎉
              </h2>
              <p style={{ color:"#94a3b8", fontSize:"0.9rem", lineHeight:1.7, margin:"0 0 28px" }}>
                Welcome to the AI Agents Development Course.<br />
                Your account has been created successfully.
              </p>
              <a href={process.env.NEXT_PUBLIC_FRONTEND_URL ?? "http://localhost:3000"}
                style={{
                  display:"block", padding:"13px",
                  background:"linear-gradient(135deg,#6366f1,#8b5cf6)",
                  borderRadius:"12px", color:"#fff",
                  fontSize:"0.95rem", fontWeight:700,
                  textDecoration:"none",
                }}>
                Start Learning →
              </a>
            </div>
          )}
        </div>

        {step < 2 && (
          <p style={{ textAlign:"center", color:"#475569", fontSize:"0.82rem", marginTop:"20px" }}>
            Already have an account?{" "}
            <Link href="/login" style={{ color:"#818cf8", textDecoration:"none", fontWeight:600 }}>
              Sign in
            </Link>
          </p>
        )}
      </div>
    </main>
  );
}
