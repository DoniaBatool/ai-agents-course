import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Agents Course — Auth",
  description: "Authentication for AI Agents Development Course",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
