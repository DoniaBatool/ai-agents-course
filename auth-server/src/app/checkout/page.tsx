"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

declare global {
  interface Window { Paddle: any; }
}

function CheckoutInner() {
  const params = useSearchParams();
  const userId = params.get("userId") ?? "";
  const email  = params.get("email")  ?? "";

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdn.paddle.com/paddle/v2/paddle.js";
    script.async = true;
    script.onload = () => {
      window.Paddle.Initialize({
        token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN,
        eventCallback: (event: any) => {
          if (event.name === "checkout.completed") {
            const frontendUrl =
              process.env.NEXT_PUBLIC_FRONTEND_URL ?? "http://localhost:3000";
            window.location.href = `${frontendUrl}?auth=1&paid=1`;
          }
        },
      });

      window.Paddle.Checkout.open({
        items: [
          {
            priceId: process.env.NEXT_PUBLIC_PADDLE_PRICE_ID,
            quantity: 1,
          },
        ],
        customer: email ? { email } : undefined,
        customData: { userId },
      });
    };
    document.head.appendChild(script);
  }, [userId, email]);

  return (
    <main style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0a0618 0%, #0f0c1e 50%, #0a0618 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'Inter', system-ui, sans-serif",
    }}>
      <div style={{ textAlign: "center", color: "#a5b4fc" }}>
        <div style={{
          width: "56px", height: "56px", borderRadius: "16px",
          background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "1.5rem", margin: "0 auto 16px",
        }}>💳</div>
        <p style={{ fontSize: "1rem", margin: 0 }}>Loading secure checkout…</p>
      </div>
    </main>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div />}>
      <CheckoutInner />
    </Suspense>
  );
}
