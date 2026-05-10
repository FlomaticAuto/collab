import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";

export const metadata: Metadata = {
  title: "FlowmaticAuto — Collab",
  description: "Quint & Armand — shared knowledge base, projects, and docs",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="light" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Space+Grotesk:wght@400;500;600;700&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <Nav />
        <main className="flex-1">{children}</main>
        <footer
          className="border-t text-center py-6 text-sm"
          style={{ borderColor: "var(--border)", color: "var(--muted)", fontFamily: "var(--flo-font-ui)" }}
        >
          Flomatic Automations · {new Date().getFullYear()}
        </footer>
      </body>
    </html>
  );
}
