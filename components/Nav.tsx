"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/collab", label: "Home" },
  { href: "/collab/blog", label: "Blog" },
  { href: "/collab/projects", label: "Projects" },
  { href: "/collab/docs", label: "Docs" },
  { href: "/collab/ideas", label: "Ideas" },
];

export default function Nav() {
  const path = usePathname();
  return (
    <header
      className="border-b px-6 py-4 flex items-center justify-between"
      style={{ borderColor: "var(--border)", background: "var(--surface)" }}
    >
      <Link href="/collab" className="font-bold text-lg tracking-tight" style={{ color: "var(--accent-light)" }}>
        FlowmaticAuto
      </Link>
      <nav className="flex gap-6 text-sm">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="transition-colors"
            style={{
              color: path === l.href ? "var(--accent-light)" : "var(--muted)",
            }}
          >
            {l.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
