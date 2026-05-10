"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const links = [
  { href: "/collab", label: "Home" },
  { href: "/collab/blog", label: "Blog" },
  { href: "/collab/projects", label: "Projects" },
  { href: "/collab/docs", label: "Docs" },
  { href: "/collab/ideas", label: "Ideas" },
];

const THEMES = [
  { id: "light", label: "Light" },
  { id: "dark",  label: "Dark" },
  { id: "vivid", label: "Vivid" },
  { id: "steel", label: "Steel" },
  { id: "ink",   label: "Ink" },
] as const;

type ThemeId = (typeof THEMES)[number]["id"];

export default function Nav() {
  const path = usePathname();
  const [theme, setTheme] = useState<ThemeId>("light");

  useEffect(() => {
    const saved = (localStorage.getItem("flo-theme") as ThemeId) ?? "light";
    setTheme(saved);
    document.documentElement.setAttribute("data-theme", saved);
  }, []);

  function switchTheme(t: ThemeId) {
    setTheme(t);
    document.documentElement.setAttribute("data-theme", t);
    localStorage.setItem("flo-theme", t);
  }

  return (
    <header
      className="border-b px-6 py-3 flex items-center justify-between"
      style={{ borderColor: "var(--border)", background: "var(--surface)" }}
    >
      {/* Wordmark */}
      <Link href="/collab" style={{ textDecoration: "none" }}>
        <span style={{ fontFamily: "var(--flo-font-display)", fontWeight: 800, fontSize: 17, letterSpacing: "0.04em", color: "var(--accent)" }}>
          FLOMATIC
        </span>
        <span style={{ display: "block", fontFamily: "var(--flo-font-body)", fontWeight: 400, fontSize: 9, letterSpacing: "0.28em", color: "var(--muted)", marginTop: -2 }}>
          AUTOMATIONS
        </span>
      </Link>

      <div className="flex items-center gap-5">
        {/* Nav links */}
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

        {/* Theme tabs */}
        <div
          className="flex rounded-md overflow-hidden border"
          style={{ borderColor: "var(--border)", fontFamily: "var(--flo-font-ui)", fontSize: 10, fontWeight: 600 }}
        >
          {THEMES.map((t) => (
            <button
              key={t.id}
              onClick={() => switchTheme(t.id)}
              title={t.label}
              style={{
                padding: "3px 9px",
                background: theme === t.id ? "var(--accent)" : "transparent",
                color: theme === t.id ? "var(--surface)" : "var(--muted)",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                cursor: "pointer",
                border: "none",
                borderLeft: t.id !== "light" ? "1px solid var(--border)" : "none",
                transition: "background 0.15s, color 0.15s",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
