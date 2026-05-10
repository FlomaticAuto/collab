import { getDocsWithBodies, DocWithBody } from "@/lib/notion";
import Accordion, { AccordionItem } from "@/components/Accordion";

const MOCK: DocWithBody[] = [
  {
    id: "1",
    slug: "1",
    title: "FlowmaticAuto Services Overview",
    category: "Company",
    date: "2026-04-15",
    description: "What we offer, how we price, and how to scope a new engagement.",
    tags: ["pricing", "services", "scope"],
    bodyHtml: "<h3>Overview</h3><p>Connect your Notion <strong>Docs</strong> database and your real documents will appear here, fully searchable, with the body inline.</p>",
  },
  {
    id: "2",
    slug: "2",
    title: "Make.com Scenario Design Standards",
    category: "Technical",
    date: "2026-03-28",
    description: "Internal conventions for naming, error handling, and data mapping.",
    tags: ["make", "standards", "automation"],
    bodyHtml: "<h3>Naming</h3><p>Each scenario follows the pattern <code>Source → Action → Target</code>.</p>",
  },
];

async function getData(): Promise<DocWithBody[]> {
  if (!process.env.NOTION_DOCS_DB_ID) return MOCK;
  try {
    const items = await getDocsWithBodies();
    return items.length > 0 ? items : MOCK;
  } catch {
    return MOCK;
  }
}

export default async function DocsPage() {
  const docs = await getData();
  const items: AccordionItem[] = docs.map((d) => ({
    id: d.id,
    title: d.title,
    summary: d.description,
    meta: d.date,
    tags: d.tags,
    group: d.category || "General",
    bodyHtml: d.bodyHtml,
  }));

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <p className="label-eyebrow mb-3">Reference</p>
      <h1
        className="mb-3"
        style={{ fontFamily: "var(--flo-font-display)", fontWeight: 800, fontSize: 36, letterSpacing: "0.02em", textTransform: "uppercase", color: "var(--foreground)" }}
      >
        Docs
      </h1>
      <p className="mb-8" style={{ fontFamily: "var(--flo-font-body)", fontWeight: 300, color: "var(--muted)" }}>
        Searchable knowledge base — methodologies, calculations, decisions, and reference notes. Click any item to expand.
      </p>
      <Accordion items={items} searchPlaceholder="Search docs by title, category, tag, or content…" />
    </div>
  );
}
