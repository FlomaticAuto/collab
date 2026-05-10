import { getProjectsWithBodies, ProjectWithBody } from "@/lib/notion";
import Accordion, { AccordionItem } from "@/components/Accordion";

const STATUS_ORDER = ["Active", "In Progress", "Planned", "Done", "Paused"];

const MOCK: ProjectWithBody[] = [
  {
    id: "1",
    slug: "1",
    name: "Workspace Dashboard",
    status: "Active",
    description: "A real-time ops dashboard pulling data from Airtable, Make, and Zoho Books.",
    link: "",
    tags: ["Dashboard", "Airtable"],
    bodyHtml: "<h3>Scope</h3><p>Connect your Notion <strong>Projects</strong> database to populate this with real engagements.</p>",
  },
  {
    id: "2",
    slug: "2",
    name: "Olympic Paints CSO Insights",
    status: "In Progress",
    description: "Automated reporting pipeline for Olympic Paints field sales data.",
    link: "",
    tags: ["Automation", "Reporting"],
    bodyHtml: "<h3>Status</h3><p>Currently piloting with two reps.</p>",
  },
];

async function getData(): Promise<ProjectWithBody[]> {
  if (!process.env.NOTION_PROJECTS_DB_ID) return MOCK;
  try {
    const items = await getProjectsWithBodies();
    return items.length > 0 ? items : MOCK;
  } catch {
    return MOCK;
  }
}

export default async function ProjectsPage() {
  const projects = await getData();
  const sorted = [...projects].sort((a, b) => {
    const ai = STATUS_ORDER.indexOf(a.status);
    const bi = STATUS_ORDER.indexOf(b.status);
    return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
  });

  const items: AccordionItem[] = sorted.map((p) => ({
    id: p.id,
    title: p.name,
    summary: p.description,
    meta: p.link ? "↗ external" : undefined,
    tags: p.tags,
    group: p.status || "Unsorted",
    bodyHtml:
      (p.link
        ? `<p><a href="${p.link}" target="_blank" rel="noopener noreferrer">${p.link}</a></p>`
        : "") + p.bodyHtml,
  }));

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <p className="label-eyebrow mb-3">What we&apos;re building</p>
      <h1
        className="mb-3"
        style={{ fontFamily: "var(--flo-font-display)", fontWeight: 800, fontSize: 36, letterSpacing: "0.02em", textTransform: "uppercase", color: "var(--foreground)" }}
      >
        Projects
      </h1>
      <p className="mb-8" style={{ fontFamily: "var(--flo-font-body)", fontWeight: 300, color: "var(--muted)" }}>
        Everything we&apos;re building — grouped by status. Click any project to see details.
      </p>
      <Accordion items={items} searchPlaceholder="Search projects by name, status, tag, or content…" />
    </div>
  );
}
