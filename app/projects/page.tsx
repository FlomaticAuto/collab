import Link from "next/link";
import { getProjects, Project } from "@/lib/notion";

const STATUS_COLOUR: Record<string, string> = {
  Active:        "var(--flo-success)",
  "In Progress": "var(--flo-warning)",
  Planned:       "var(--flo-teal)",
  Done:          "var(--flo-n-400)",
  Paused:        "var(--flo-danger)",
};

const STATUS_BG: Record<string, string> = {
  Active:        "#E8F5F0",
  "In Progress": "#FDF0E8",
  Planned:       "var(--flo-teal-lightest)",
  Done:          "var(--flo-n-100)",
  Paused:        "#FDF0EE",
};

const MOCK_PROJECTS: Project[] = [
  {
    id: "1",
    slug: "1",
    name: "Workspace Dashboard",
    status: "Active",
    description: "A real-time ops dashboard pulling data from Airtable, Make, and Zoho Books.",
    link: "",
    tags: ["Dashboard", "Airtable"],
  },
  {
    id: "2",
    slug: "2",
    name: "Olympic Paints CSO Insights",
    status: "In Progress",
    description: "Automated reporting pipeline for Olympic Paints field sales data.",
    link: "",
    tags: ["Automation", "Reporting"],
  },
];

async function getData(): Promise<Project[]> {
  if (!process.env.NOTION_PROJECTS_DB_ID) return MOCK_PROJECTS;
  try { return await getProjects(); } catch { return MOCK_PROJECTS; }
}

export default async function ProjectsPage() {
  const projects = await getData();

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <p className="label-eyebrow mb-3">What we&apos;re building</p>
      <h1 className="mb-3" style={{ fontFamily: "var(--flo-font-display)", fontWeight: 700, fontSize: 32, color: "var(--foreground)" }}>
        Projects
      </h1>
      <p className="mb-12" style={{ fontFamily: "var(--flo-font-body)", fontWeight: 300, color: "var(--muted)" }}>
        Everything we&apos;re building — status, context, and links in one place.
      </p>

      <div className="grid sm:grid-cols-2 gap-4">
        {projects.map((p) => (
          <Link
            key={p.id}
            href={`/projects/${p.slug}`}
            className="flo-card block p-5"
            style={{
              borderLeft: `4px solid ${STATUS_COLOUR[p.status] ?? "var(--flo-n-300)"}`,
            }}
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <h2 style={{ fontFamily: "var(--flo-font-ui)", fontWeight: 600, fontSize: 15, color: "var(--foreground)" }}>
                {p.name}
              </h2>
              <span
                style={{
                  fontFamily: "var(--flo-font-ui)",
                  fontSize: 10,
                  fontWeight: 600,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  padding: "2px 8px",
                  borderRadius: "var(--flo-radius-sm)",
                  background: STATUS_BG[p.status] ?? "var(--flo-n-100)",
                  color: STATUS_COLOUR[p.status] ?? "var(--flo-n-500)",
                  whiteSpace: "nowrap",
                }}
              >
                {p.status}
              </span>
            </div>
            <p className="mb-4" style={{ fontFamily: "var(--flo-font-body)", fontSize: 13, color: "var(--muted)", lineHeight: 1.6 }}>
              {p.description}
            </p>
            <div className="flex flex-wrap gap-2">
              {p.tags.map((tag) => (
                <span
                  key={tag}
                  style={{
                    fontFamily: "var(--flo-font-ui)",
                    fontSize: 10,
                    fontWeight: 600,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    padding: "2px 8px",
                    borderRadius: "var(--flo-radius-sm)",
                    background: "var(--flo-n-100)",
                    color: "var(--flo-n-500)",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
