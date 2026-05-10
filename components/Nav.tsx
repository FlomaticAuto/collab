"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const links = [
  { href: "/", label: "Home" },
  { href: "/blog", label: "Blog" },
  { href: "/projects", label: "Projects" },
  { href: "/docs", label: "Docs" },
  { href: "/ideas", label: "Ideas" },
];

const THEMES = [
  { id: "light", label: "Light" },
  { id: "dark",  label: "Dark" },
  { id: "vivid", label: "Vivid" },
  { id: "steel", label: "Steel" },
  { id: "ink",   label: "Ink" },
] as const;
type ThemeId = (typeof THEMES)[number]["id"];

const FONTS = [
  { id: "syne",     label: "Syne",     display: "'Syne', sans-serif",             body: "'DM Sans', sans-serif" },
  { id: "jakarta",  label: "Jakarta",  display: "'Plus Jakarta Sans', sans-serif", body: "'Plus Jakarta Sans', sans-serif" },
  { id: "playfair", label: "Serif",    display: "'Playfair Display', serif",       body: "'Source Serif 4', serif" },
  { id: "mono",     label: "Mono",     display: "'JetBrains Mono', monospace",     body: "'JetBrains Mono', monospace" },
  { id: "grotesk",  label: "Grotesk",  display: "'Space Grotesk', sans-serif",     body: "'Space Grotesk', sans-serif" },
] as const;
type FontId = (typeof FONTS)[number]["id"];

function applyFont(fontId: FontId) {
  const f = FONTS.find((x) => x.id === fontId);
  if (!f) return;
  document.documentElement.style.setProperty("--flo-font-display", f.display);
  document.documentElement.style.setProperty("--flo-font-body", f.body);
}

export default function Nav() {
  const path = usePathname();
  const [theme, setTheme] = useState<ThemeId>("light");
  const [font, setFont] = useState<FontId>("syne");

  useEffect(() => {
    const savedTheme = (localStorage.getItem("flo-theme") as ThemeId) ?? "light";
    const savedFont  = (localStorage.getItem("flo-font")  as FontId)  ?? "syne";
    setTheme(savedTheme);
    setFont(savedFont);
    document.documentElement.setAttribute("data-theme", savedTheme);
    applyFont(savedFont);
  }, []);

  function switchTheme(t: ThemeId) {
    setTheme(t);
    document.documentElement.setAttribute("data-theme", t);
    localStorage.setItem("flo-theme", t);
  }

  function switchFont(f: FontId) {
    setFont(f);
    applyFont(f);
    localStorage.setItem("flo-font", f);
  }

  const tabStyle = (active: boolean) => ({
    padding: "3px 9px",
    background: active ? "var(--accent)" : "transparent",
    color: active ? "var(--surface)" : "var(--muted)",
    textTransform: "uppercase" as const,
    letterSpacing: "0.05em",
    cursor: "pointer",
    border: "none",
    transition: "background 0.15s, color 0.15s",
    fontFamily: "var(--flo-font-ui)",
    fontSize: 10,
    fontWeight: 600,
  });

  return (
    <header
      className="border-b px-6"
      style={{ borderColor: "var(--border)", background: "var(--surface)" }}
    >
      {/* Top row: wordmark + nav + theme tabs */}
      <div className="flex items-center justify-between py-3">
        <Link href="/" style={{ textDecoration: "none" }}>
          <span style={{ fontFamily: "var(--flo-font-display)", fontWeight: 800, fontSize: 17, letterSpacing: "0.04em", color: "var(--accent)" }}>
            FLOMATIC
          </span>
          <span style={{ display: "block", fontFamily: "var(--flo-font-body)", fontWeight: 400, fontSize: 9, letterSpacing: "0.28em", color: "var(--muted)", marginTop: -2 }}>
            AUTOMATIONS
          </span>
        </Link>

        <div className="flex items-center gap-5">
          <nav className="flex gap-5" style={{ fontFamily: "var(--flo-font-ui)", fontSize: 13, fontWeight: 500 }}>
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                style={{
                  color: path === l.href ? "var(--accent)" : "var(--muted)",
                  borderBottom: path === l.href ? "2px solid var(--accent)" : "2px solid transparent",
                  paddingBottom: 2,
                  transition: "color 0.15s",
                  textDecoration: "none",
                }}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Colour theme tabs */}
          <div className="flex rounded-md overflow-hidden border" style={{ borderColor: "var(--border)" }}>
            {THEMES.map((t, i) => (
              <button
                key={t.id}
                onClick={() => switchTheme(t.id)}
                style={{
                  ...tabStyle(theme === t.id),
                  borderLeft: i > 0 ? "1px solid var(--border)" : "none",
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom row: font picker */}
      <div
        className="flex items-center gap-2 pb-2"
        style={{ fontFamily: "var(--flo-font-ui)", fontSize: 10, color: "var(--muted)" }}
      >
        <span style={{ letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 600, marginRight: 4 }}>
          Font
        </span>
        <div className="flex rounded-md overflow-hidden border" style={{ borderColor: "var(--border)" }}>
          {FONTS.map((f, i) => (
            <button
              key={f.id}
              onClick={() => switchFont(f.id)}
              style={{
                ...tabStyle(font === f.id),
                fontFamily: f.display,
                borderLeft: i > 0 ? "1px solid var(--border)" : "none",
                fontSize: 11,
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
