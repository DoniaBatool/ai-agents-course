import React, { useEffect, useState } from "react";
import BrowserOnly from "@docusaurus/BrowserOnly";
import { useLocation } from "@docusaurus/router";

const AUTH_SERVER = "https://ai-agents-course-w12u.vercel.app";
const STORAGE_KEY = "ai_course_auth";
const NAME_KEY    = "ai_course_user_name";
const TOKEN_KEY   = "ai_course_token";

// ── Inject user initials into navbar ──────────────────────────────────────────
function injectNavbarUser(name: string) {
  // Hide Login + Sign Up navbar buttons
  document.querySelectorAll<HTMLElement>(".navbar-login-btn, .navbar-signup-btn").forEach(el => {
    const li = el.closest("li");
    if (li) li.style.display = "none";
  });

  if (document.getElementById("navbar-user-badge")) return; // already injected

  const parts    = name.trim().split(" ").filter(Boolean);
  const initials = parts.length >= 2
    ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    : (parts[0]?.[0] ?? "U").toUpperCase();

  const navbarRight = document.querySelector<HTMLElement>(".navbar__items--right");
  if (!navbarRight) return;

  const wrapper = document.createElement("div");
  wrapper.id = "navbar-user-badge";
  wrapper.style.cssText = "display:flex;align-items:center;gap:10px;margin-left:8px;";

  const circle = document.createElement("div");
  circle.title = name || "Logged in";
  circle.style.cssText = [
    "width:36px;height:36px;border-radius:50%;",
    "background:linear-gradient(135deg,#7c3aed,#6366f1);",
    "color:#fff;font-weight:700;font-size:14px;",
    "display:flex;align-items:center;justify-content:center;",
    "cursor:default;user-select:none;",
    "border:2px solid rgba(165,180,252,0.4);",
    "box-shadow:0 0 12px rgba(99,102,241,0.4);",
  ].join("");
  circle.textContent = initials;

  const logout = document.createElement("button");
  logout.textContent = "Logout";
  logout.style.cssText = [
    "background:rgba(99,102,241,0.12);border:1px solid rgba(99,102,241,0.3);",
    "color:#a5b4fc;font-size:12px;font-weight:600;",
    "padding:5px 12px;border-radius:8px;cursor:pointer;",
    "transition:background 0.2s;font-family:inherit;",
  ].join("");
  logout.onmouseenter = () => { logout.style.background = "rgba(99,102,241,0.25)"; };
  logout.onmouseleave = () => { logout.style.background = "rgba(99,102,241,0.12)"; };
  logout.onclick = () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(NAME_KEY);
    localStorage.removeItem(TOKEN_KEY);
    window.location.href = "/";
  };

  wrapper.appendChild(circle);
  wrapper.appendChild(logout);
  navbarRight.appendChild(wrapper);
}

function removeNavbarUser() {
  document.getElementById("navbar-user-badge")?.remove();
  document.querySelectorAll<HTMLElement>(".navbar-login-btn, .navbar-signup-btn").forEach(el => {
    const li = el.closest("li");
    if (li) li.style.display = "";
  });
}

// ── Auth Guard ─────────────────────────────────────────────────────────────────
function AuthGuard({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    // Coming back from auth server
    if (params.get("auth") === "1") {
      localStorage.setItem(STORAGE_KEY, "1");
      const name = params.get("name");
      if (name) localStorage.setItem(NAME_KEY, decodeURIComponent(name));
      const token = params.get("token");
      if (token) localStorage.setItem(TOKEN_KEY, decodeURIComponent(token));
      window.history.replaceState({}, "", window.location.pathname);
    }

    const isHomepage  = location.pathname === "/" || location.pathname === "";
    const loggedIn    = localStorage.getItem(STORAGE_KEY) === "1";

    if (!isHomepage && !loggedIn) {
      const redirectBack = encodeURIComponent(window.location.origin + location.pathname);
      window.location.href = `${AUTH_SERVER}/login?redirect=${redirectBack}`;
      return;
    }

    setReady(true);

    // Update navbar after DOM is ready
    if (loggedIn) {
      const name = localStorage.getItem(NAME_KEY) ?? "";
      let attempts = 0;
      const tryInject = () => {
        if (document.querySelector(".navbar__items--right")) {
          injectNavbarUser(name);
        } else if (attempts++ < 10) {
          setTimeout(tryInject, 150);
        }
      };
      tryInject();
    } else {
      removeNavbarUser();
    }
  }, [location.pathname]);

  // Prevent flash of protected content while redirecting
  if (!ready && location.pathname !== "/" && location.pathname !== "") return null;

  return (
    <>
      {children}
      <BrowserOnly>
        {() => {
          const ChatWidget         = require("@/components/ChatWidget").default;
          const TextSelectionPopup = require("@/components/TextSelectionPopup").default;
          return (
            <>
              <ChatWidget />
              <TextSelectionPopup />
            </>
          );
        }}
      </BrowserOnly>
    </>
  );
}

export default function Root({ children }: { children: React.ReactNode }) {
  return <AuthGuard>{children}</AuthGuard>;
}
