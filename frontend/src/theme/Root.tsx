import React, { useEffect, useState } from "react";
import BrowserOnly from "@docusaurus/BrowserOnly";
import { useLocation } from "@docusaurus/router";

const AUTH_SERVER = "https://ai-agents-course-w12u.vercel.app";
const STORAGE_KEY = "ai_course_auth";

function AuthGuard({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // If redirected back from auth server with ?auth=1, save to localStorage
    const params = new URLSearchParams(window.location.search);
    if (params.get("auth") === "1") {
      localStorage.setItem(STORAGE_KEY, "1");
      window.history.replaceState({}, "", window.location.pathname);
    }

    // Homepage is public — everything else requires login
    const isProtected = location.pathname !== "/" && location.pathname !== "";

    if (isProtected) {
      const loggedIn = localStorage.getItem(STORAGE_KEY);
      if (!loggedIn) {
        const redirectBack = encodeURIComponent(
          window.location.origin + location.pathname
        );
        window.location.href = `${AUTH_SERVER}/login?redirect=${redirectBack}`;
        return;
      }
    }

    setReady(true);
  }, [location.pathname]);

  if (!ready && location.pathname !== "/") return null;

  return (
    <>
      {children}
      <BrowserOnly>
        {() => {
          const ChatWidget = require("@/components/ChatWidget").default;
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
