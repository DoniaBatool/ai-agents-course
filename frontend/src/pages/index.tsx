import React, { useEffect, useState } from "react";
import Link from "@docusaurus/Link";
import BrowserOnly from "@docusaurus/BrowserOnly";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import { ArrowRight, BookOpen, Brain, Code2, Network, Rocket } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Spotlight } from "@/components/ui/spotlight";
import RadialOrbitalTimeline from "@/components/ui/radial-orbital-timeline";
import styles from "./index.module.css";

// ── Course timeline data ───────────────────────────────────────────────────────
const COURSE_TIMELINE = [
  {
    id: 1,
    title: "Intro",
    date: "Start Here",
    content:
      "Course overview, prerequisites, and how to get the most out of this curriculum.",
    category: "Overview",
    icon: BookOpen,
    relatedIds: [2],
    status: "completed" as const,
    energy: 100,
    href: "/intro",
  },
  {
    id: 2,
    title: "Fundamentals",
    date: "Module 1",
    content:
      "Understand what AI agents are, how they reason, and build your first agent with the OpenAI Agents SDK.",
    category: "Foundation",
    icon: Brain,
    relatedIds: [1, 3],
    status: "completed" as const,
    energy: 90,
    href: "/module-1-fundamentals/what-are-ai-agents",
  },
  {
    id: 3,
    title: "OpenAI SDK",
    date: "Module 2",
    content:
      "Master tools, handoffs, guardrails, and the Runner loop. Build multi-step agent pipelines.",
    category: "SDK",
    icon: Code2,
    relatedIds: [2, 4],
    status: "in-progress" as const,
    energy: 70,
    href: "/module-2-openai-sdk/setup-environment",
  },
  {
    id: 4,
    title: "Advanced",
    date: "Module 3",
    content:
      "Multi-agent orchestration, RAG pipelines with Qdrant, memory systems, and tracing.",
    category: "Advanced",
    icon: Network,
    relatedIds: [3, 5],
    status: "pending" as const,
    energy: 45,
    href: "/module-3-advanced/memory-systems",
  },
  {
    id: 5,
    title: "Deploy",
    date: "Module 4",
    content:
      "Build a capstone project and ship it to Google Cloud Run. End-to-end production deployment.",
    category: "Deployment",
    icon: Rocket,
    relatedIds: [4],
    status: "pending" as const,
    energy: 20,
    href: "/module-4-projects/customer-support-agent",
  },
];

// ── Stats ──────────────────────────────────────────────────────────────────────
const STATS = [
  { label: "Modules",   value: "4"   },
  { label: "Lessons",   value: "20+" },
  { label: "Projects",  value: "5"   },
  { label: "Tech Stack",value: "6+"  },
];

// ── Main page ──────────────────────────────────────────────────────────────────
export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  // Hide the dark-mode toggle on the homepage only
  useEffect(() => {
    document.documentElement.setAttribute("data-page", "home");
    return () => {
      document.documentElement.removeAttribute("data-page");
    };
  }, []);

  return (
    <Layout title="Home" description={siteConfig.tagline} noFooter>
      <main className={styles.main}>

        {/* ── SECTION 1: Spline + Spotlight Hero ──────────────────────── */}
        <section className={styles.heroSection}>
          <Card className="w-full min-h-screen bg-black/[0.96] relative overflow-hidden rounded-none border-0">

            {/* Spotlight beam */}
            <Spotlight
              className="-top-40 left-0 md:left-60 md:-top-20"
              fill="white"
            />

            <div className={`flex flex-col md:flex-row h-full min-h-screen ${visible ? styles.fadeIn : styles.fadeOut}`}>

              {/* ── Left: text content ──────────────────────────────── */}
              <div className="flex-1 flex flex-col justify-center p-8 md:p-16 relative z-10">

                {/* Badge */}
                <div className={styles.badge}>
                  <span className={styles.badgeDot} />
                  OpenAI Agents SDK · Qdrant · FastAPI · Next.js
                </div>

                {/* Title */}
                <h1 style={{
                  marginTop: "24px",
                  marginBottom: "8px",
                  fontSize: "clamp(2.8rem, 6vw, 5rem)",
                  fontWeight: 900,
                  lineHeight: 1.05,
                  letterSpacing: "-0.02em",
                  color: "#ffffff",
                }}>
                  AI Agents<br />
                  <span style={{
                    background: "linear-gradient(90deg, #818cf8, #a855f7, #7c3aed)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}>
                    Development
                  </span>
                  <br />Course
                </h1>

                {/* Subtitle heading */}
                <div style={{ marginBottom: "16px", marginTop: "16px" }}>
                  <div style={{
                    fontSize: "clamp(1.4rem, 2.5vw, 2rem)",
                    fontWeight: 800,
                    background: "linear-gradient(90deg, #a5b4fc, #c084fc, #f9a8d4)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    lineHeight: 1.3,
                  }}>
                    Master the future of software —
                  </div>
                  <div style={{
                    fontSize: "clamp(1rem, 1.8vw, 1.3rem)",
                    fontWeight: 300,
                    color: "rgba(255,255,255,0.65)",
                    letterSpacing: "0.03em",
                    marginTop: "4px",
                  }}>
                    where AI thinks, decides &amp; acts.
                  </div>
                </div>

                {/* Subtitle */}
                <p className="text-neutral-400 max-w-md text-base md:text-lg leading-relaxed mb-8">
                  Build intelligent, production-ready AI agents from scratch — with
                  tools, memory, multi-agent orchestration, RAG, and cloud deployment.
                </p>

                {/* CTA buttons */}
                <div className="flex flex-wrap gap-4 mb-10">
                  <Link
                    to="/intro"
                    className="hero-cta-btn group"
                  >
                    Start Learning
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <a
                    href="#modules"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-indigo-300 no-underline border border-indigo-500/40 bg-indigo-500/10 hover:bg-indigo-500/20 hover:border-indigo-400/70 transition-all hover:-translate-y-0.5"
                  >
                    Explore Modules ↓
                  </a>
                </div>

                {/* Stats */}
                <div className="flex flex-wrap gap-8">
                  {STATS.map((s) => (
                    <div key={s.label} className="flex flex-col">
                      <span className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-purple-400">
                        {s.value}
                      </span>
                      <span className="text-xs text-neutral-500 uppercase tracking-widest mt-0.5">
                        {s.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Right: 3D Spline scene ──────────────────────────── */}
              <div className="flex-1 relative min-h-[400px] md:min-h-0">
                <BrowserOnly
                  fallback={
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full border-2 border-purple-500 border-t-transparent animate-spin" />
                    </div>
                  }
                >
                  {() => {
                    // eslint-disable-next-line @typescript-eslint/no-var-requires
                    const { SplineScene } = require("@/components/ui/splite");
                    return (
                      <SplineScene
                        scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                        className="w-full h-full"
                      />
                    );
                  }}
                </BrowserOnly>
              </div>

            </div>
          </Card>
        </section>

        {/* ── SECTION 2: Orbital Timeline ─────────────────────────────── */}
        <section id="modules" className={styles.orbitalSection}>
          <div className={styles.orbitalLabel}>
            <h2 className={styles.orbitalTitle}>Course Modules</h2>
            <p className={styles.orbitalHint}>
              Click any node to explore · Click "Start Module" to jump in
            </p>
          </div>
          <RadialOrbitalTimeline timelineData={COURSE_TIMELINE} />
        </section>

        {/* ── SECTION 3: Tech stack pills ─────────────────────────────── */}
        <section className={styles.stack}>
          {[
            "OpenAI Agents SDK", "FastAPI", "Qdrant", "Better-Auth",
            "Next.js 15", "Docusaurus 3", "Google Cloud Run", "Vercel",
            "Python 3.11", "TypeScript", "Drizzle ORM", "Neon Postgres",
          ].map((t) => (
            <span key={t} className={styles.pill}>{t}</span>
          ))}
        </section>

      </main>
    </Layout>
  );
}
