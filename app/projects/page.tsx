import { getProjects, Project } from "@/lib/notion";

const STATUS_COLOUR: Record<string, string> = {
  Active: "#22c55e",
  "In Progress": "#f59e0b",
  Planned: "#6366f1",
  Done: "#71717a",
  Paused: "#ef4444",
};

const MOCK_PROJECTS: Project[] = [
  {
    id: "1",
    name: "Workspace Dashboard",
    status: "Active",
    description: "A real-time ops dashboard pulling data from Airtable, Make, and Zoho Books.",
    link: "",
    tags: ["Dashboard", "Airtable"],
  },
  {
    id: "2",
    name: "Olympic Paints CSO Insights",
    status: "In Progress",
    description: "Automated reporting pipeline for Olympic Paints field sales data.",
    link: "",
    tags: ["Automation", "Reporting"],
  },
];

async function getData(): Promise<Project[]> {
  if (!process.env.NOTION_PROJECTS_DB_ID) return MOCK_PROJECTS;
  try {
    return await getProjects();
  } catch {
    return MOCK_PROJECTS;
  }
}

export default async function ProjectsPage() {
  const projects = await getData();

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold tracking-tight mb-3">Projects</h1>
      <p className="mb-12 text-base" style={{ color: "var(--muted)" }}>
        Everything we're building — status, context, and links in one place.
      </p>

      <div className="grid sm:grid-cols-2 gap-4">
        {projects.map((p) => (
          <div
            key={p.id}
            className="rounded-xl border p-5"
            style={{ borderColor: "var(--border)", background: "var(--surface)" }}
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <h2 className="font-semibold text-base">{p.name}</h2>
              <span
                className="text-xs px-2 py-0.5 rounded-full shrink-0 font-medium"
                style={{
                  background: (STATUS_COLOUR[p.status] ?? "#71717a") + "22",
                  color: STATUS_COLOUR[p.status] ?? "#71717a",
                }}
              >
                {p.status}
              </span>
            </div>
            <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--muted)" }}>
              {p.description}
            </p>
            <div className="flex flex-wrap gap-2">
              {p.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-0.5 rounded-full"
                  style={{ background: "var(--border)", color: "var(--muted)" }}
                >
                  {tag}
                </span>
              ))}
            </div>
            {p.link && (
              <a
                href={p.link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block text-xs"
                style={{ color: "var(--accent-light)" }}
              >
                View →
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
