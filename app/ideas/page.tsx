import { getIdeasWithBodies, IdeaWithBody } from "@/lib/notion";
import Accordion, { AccordionItem } from "@/components/Accordion";

const PRIORITY_ORDER = ["High", "Medium", "Low"];

const MOCK: IdeaWithBody[] = [
  {
    id: "1",
    slug: "1",
    title: "Automated client onboarding flow in Make",
    owner: "Quint",
    priority: "High",
    notes: "Trigger on new Airtable row → create Zoho contact → send welcome email → Slack notification.",
    bodyHtml: "<h3>Detail</h3><p>Connect your Notion <strong>Ideas</strong> database to populate this.</p>",
  },
  {
    id: "2",
    slug: "2",
    title: "Self-serve invoice portal for small clients",
    owner: "Armand",
    priority: "Medium",
    notes: "Lightweight page where clients view and download their invoices without logging into Zoho.",
    bodyHtml: "<h3>Why</h3><p>Reduces inbound admin requests.</p>",
  },
];

async function getData(): Promise<IdeaWithBody[]> {
  if (!process.env.NOTION_IDEAS_DB_ID) return MOCK;
  try {
    const items = await getIdeasWithBodies();
    return items.length > 0 ? items : MOCK;
  } catch {
    return MOCK;
  }
}

export default async function IdeasPage() {
  const ideas = await getData();
  const sorted = [...ideas].sort((a, b) => {
    const ai = PRIORITY_ORDER.indexOf(a.priority);
    const bi = PRIORITY_ORDER.indexOf(b.priority);
    return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
  });

  const items: AccordionItem[] = sorted.map((i) => ({
    id: i.id,
    title: i.title,
    summary: i.notes,
    meta: i.owner,
    tags: [],
    group: i.priority || "Unprioritised",
    bodyHtml: i.bodyHtml,
  }));

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <p className="label-eyebrow mb-3">Exploration</p>
      <h1
        className="mb-3"
        style={{ fontFamily: "var(--flo-font-display)", fontWeight: 800, fontSize: 36, letterSpacing: "0.02em", textTransform: "uppercase", color: "var(--foreground)" }}
      >
        Ideas
      </h1>
      <p className="mb-8" style={{ fontFamily: "var(--flo-font-body)", fontWeight: 300, color: "var(--muted)" }}>
        Things worth exploring — owned, prioritised, and not forgotten. Click any idea for context.
      </p>
      <Accordion items={items} searchPlaceholder="Search ideas by title, owner, or content…" />
    </div>
  );
}
