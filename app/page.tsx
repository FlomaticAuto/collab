import Link from "next/link";

const sections = [
  {
    href: "/collab/blog",
    label: "Blog",
    description: "Notes, ideas, and interesting finds — searchable and always up to date.",
    icon: "✦",
  },
  {
    href: "/collab/projects",
    label: "Projects",
    description: "Status and context for everything we're building together.",
    icon: "◈",
  },
  {
    href: "/collab/docs",
    label: "Docs",
    description: "Reports, specs, and reference documents we've published.",
    icon: "▤",
  },
  {
    href: "/collab/ideas",
    label: "Ideas",
    description: "A holding area for things worth exploring — owned, prioritised, and tracked.",
    icon: "◎",
  },
];

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-24">
      <div className="mb-16">
        <p className="text-sm font-medium mb-3" style={{ color: "var(--accent-light)" }}>
          FlowmaticAuto
        </p>
        <h1 className="text-5xl font-bold tracking-tight mb-5">
          Quint &amp; Armand
        </h1>
        <p className="text-xl max-w-xl leading-relaxed" style={{ color: "var(--muted)" }}>
          A shared space to think, build, and stay aligned. Everything lives here — updated once, visible to both.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {sections.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="group rounded-xl border p-6 transition-colors hover:border-indigo-500"
            style={{ borderColor: "var(--border)", background: "var(--surface)" }}
          >
            <div className="text-2xl mb-3" style={{ color: "var(--accent)" }}>
              {s.icon}
            </div>
            <h2 className="font-semibold text-lg mb-1">{s.label}</h2>
            <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
              {s.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
