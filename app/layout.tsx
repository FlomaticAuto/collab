import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";

export const metadata: Metadata = {
  title: "FlowmaticAuto — Collab",
  description: "Quint & Armand — shared knowledge base, projects, and docs",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-screen flex flex-col">
        <Nav />
        <main className="flex-1">{children}</main>
        <footer
          className="border-t text-center py-6 text-sm"
          style={{ borderColor: "var(--border)", color: "var(--muted)" }}
        >
          FlowmaticAuto · {new Date().getFullYear()}
        </footer>
      </body>
    </html>
  );
}
