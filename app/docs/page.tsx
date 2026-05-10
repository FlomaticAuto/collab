import { getDocsWithBodies, DocWithBody } from "@/lib/notion";
import DocsAccordion from "@/components/DocsAccordion";

const MOCK_DOCS: DocWithBody[] = [
  {
    id: "1",
    slug: "1",
    title: "FlowmaticAuto Services Overview",
    category: "Company",
    date: "2026-04-15",
    description: "What we offer, how we price, and how to scope a new engagement.",
    tags: ["pricing", "services", "scope"],
    bodyHtml:
      "<h3>Overview</h3><p>Connect your Notion <strong>Docs</strong> database and your real documents will appear here, fully searchable, with the body inline.</p>",
  },
  {
    id: "2",
    slug: "2",
    title: "Make.com Scenario Design Standards",
    category: "Technical",
    date: "2026-03-28",
    description: "Internal conventions for naming, error handling, and data mapping in Make scenarios.",
    tags: ["make", "standards", "automation"],
    bodyHtml:
      "<h3>Naming</h3><p>Each scenario follows the pattern <code>Source → Action → Target</code>. Connect Notion to populate this with your real standards doc.</p>",
  },
];

async function getData(): Promise<DocWithBody[]> {
  if (!process.env.NOTION_DOCS_DB_ID) return MOCK_DOCS;
  try {
    const docs = await getDocsWithBodies();
    return docs.length > 0 ? docs : MOCK_DOCS;
  } catch {
    return MOCK_DOCS;
  }
}

export default async function DocsPage() {
  const docs = await getData();

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <p className="label-eyebrow mb-3">Reference</p>
      <h1
        className="mb-3"
        style={{
          fontFamily: "var(--flo-font-display)",
          fontWeight: 800,
          fontSize: 36,
          letterSpacing: "0.02em",
          textTransform: "uppercase",
          color: "var(--foreground)",
        }}
      >
        Docs
      </h1>
      <p className="mb-8" style={{ fontFamily: "var(--flo-font-body)", fontWeight: 300, color: "var(--muted)" }}>
        Searchable knowledge base — methodologies, calculations, decisions, and reference notes. Click any item to expand.
      </p>

      <DocsAccordion docs={docs} />
    </div>
  );
}
