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

const THEMES = ["light", "dark"] as const;
type Theme = (typeof THEMES)[number];

export default function Nav() {
  const path = usePathname();
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const saved = (localStorage.getItem("flo-theme") as Theme) ?? "light";
    setTheme(saved);
    document.documentElement.setAttribute("data-theme", saved);
  }, []);

  function switchTheme(t: Theme) {
    setTheme(t);
    document.documentElement.setAttribute("data-theme", t);
    localStorage.setItem("flo-theme", t);
  }

  return (
    <header
      className="border-b px-6 py-4 flex items-center justify-between"
      style={{ borderColor: "var(--border)", background: "var(--surface)" }}
    >
      {/* Wordmark */}
      <Link
        href="/collab"
        style={{ fontFamily: "var(--flo-font-display)", fontWeight: 800, fontSize: 18, letterSpacing: "0.04em", color: "var(--flo-teal)" }}
      >
        FLOMATIC
        <span
          style={{ display: "block", fontFamily: "var(--flo-font-body)", fontWeight: 400, fontSize: 9, letterSpacing: "0.28em", color: "var(--muted)", marginTop: -2 }}
        >
          AUTOMATIONS
        </span>
      </Link>

      <div className="flex items-center gap-6">
        {/* Nav links */}
        <nav className="flex gap-6" style={{ fontFamily: "var(--flo-font-ui)", fontSize: 13, fontWeight: 500 }}>
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              style={{
                color: path === l.href ? "var(--flo-teal)" : "var(--muted)",
                borderBottom: path === l.href ? "2px solid var(--flo-teal)" : "2px solid transparent",
                paddingBottom: 2,
                transition: "color 0.15s",
              }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Theme tabs */}
        <div
          className="flex rounded-md overflow-hidden border"
          style={{ borderColor: "var(--border)", fontFamily: "var(--flo-font-ui)", fontSize: 11, fontWeight: 600 }}
        >
          {THEMES.map((t) => (
            <button
              key={t}
              onClick={() => switchTheme(t)}
              style={{
                padding: "3px 10px",
                background: theme === t ? "var(--flo-teal)" : "transparent",
                color: theme === t ? "#fff" : "var(--muted)",
                textTransform: "capitalize",
                cursor: "pointer",
                border: "none",
                transition: "background 0.15s",
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
