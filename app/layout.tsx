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
        {/* Restore theme from localStorage before first paint — prevents flash */}
        <script dangerouslySetInnerHTML={{ __html: `
          (function() {
            var t = localStorage.getItem('flo-theme');
            if (t) document.documentElement.setAttribute('data-theme', t);
          })();
        `}} />

        {/* GitHub Pages SPA: hard-redirect to the correct static page */}
        <script dangerouslySetInnerHTML={{ __html: `
          (function() {
            var params = new URLSearchParams(window.location.search);
            var p = params.get('p');
            if (p) {
              var h = params.get('h') || '';
              params.delete('p');
              params.delete('h');
              var rest = params.toString() ? '?' + params.toString() : '';
              window.location.replace('/collab' + decodeURIComponent(p) + rest + decodeURIComponent(h));
            }
          })();
        `}} />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Space+Grotesk:wght@400;500;600;700&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Playfair+Display:wght@700;800&family=Source+Serif+4:ital,wght@0,300;0,400;0,600;1,400&family=JetBrains+Mono:wght@400;500;600&display=swap"
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
