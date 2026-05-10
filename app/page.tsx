import Link from "next/link";

const sections = [
  {
    href: "/blog",
    label: "Blog",
    description: "Notes, ideas, and interesting finds — searchable and always up to date.",
    icon: "✦",
  },
  {
    href: "/projects",
    label: "Projects",
    description: "Status and context for everything we're building together.",
    icon: "◈",
  },
  {
    href: "/docs",
    label: "Docs",
    description: "Reports, specs, and reference documents we've published.",
    icon: "▤",
  },
  {
    href: "/ideas",
    label: "Ideas",
    description: "A holding area for things worth exploring — owned, prioritised, and tracked.",
    icon: "◎",
  },
];

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-24">
      <div className="mb-16">
        <p className="label-eyebrow mb-3">FlowmaticAuto · Collab</p>
        <h1
          className="mb-5"
          style={{ fontFamily: "var(--flo-font-display)", fontWeight: 800, fontSize: 48, color: "var(--flo-teal)", lineHeight: 1.1 }}
        >
          Quint &amp; Armand
        </h1>
        <p
          className="max-w-xl"
          style={{ fontFamily: "var(--flo-font-body)", fontWeight: 300, fontSize: 15, color: "var(--muted)", lineHeight: 1.65 }}
        >
          A shared space to think, build, and stay aligned. Everything lives here — updated once, visible to both.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {sections.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="flo-card block p-6"
          >
            <div className="text-2xl mb-3" style={{ color: "var(--flo-teal)" }}>
              {s.icon}
            </div>
            <h2
              className="mb-1"
              style={{ fontFamily: "var(--flo-font-display)", fontWeight: 700, fontSize: 18, color: "var(--foreground)" }}
            >
              {s.label}
            </h2>
            <p style={{ fontFamily: "var(--flo-font-body)", fontSize: 14, color: "var(--muted)", lineHeight: 1.6 }}>
              {s.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
