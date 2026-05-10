import { getDocs, Doc } from "@/lib/notion";

const MOCK_DOCS: Doc[] = [
  {
    id: "1",
    title: "FlowmaticAuto Services Overview",
    category: "Company",
    date: "2026-04-15",
    description: "What we offer, how we price, and how to scope a new engagement.",
  },
  {
    id: "2",
    title: "Make.com Scenario Design Standards",
    category: "Technical",
    date: "2026-03-28",
    description: "Internal conventions for naming, error handling, and data mapping in Make scenarios.",
  },
];

async function getData(): Promise<Doc[]> {
  if (!process.env.NOTION_DOCS_DB_ID) return MOCK_DOCS;
  try {
    return await getDocs();
  } catch {
    return MOCK_DOCS;
  }
}

export default async function DocsPage() {
  const docs = await getData();

  const byCategory = docs.reduce<Record<string, Doc[]>>((acc, doc) => {
    const cat = doc.category || "General";
    (acc[cat] ??= []).push(doc);
    return acc;
  }, {});

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold tracking-tight mb-3">Docs</h1>
      <p className="mb-12 text-base" style={{ color: "var(--muted)" }}>
        Published reports, specs, and reference documents.
      </p>

      {Object.entries(byCategory).map(([cat, items]) => (
        <section key={cat} className="mb-10">
          <h2 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "var(--accent)" }}>
            {cat}
          </h2>
          <div className="space-y-3">
            {items.map((doc) => (
              <div
                key={doc.id}
                className="rounded-xl border p-5 flex items-start justify-between gap-4"
                style={{ borderColor: "var(--border)", background: "var(--surface)" }}
              >
                <div>
                  <h3 className="font-medium text-sm mb-1">{doc.title}</h3>
                  <p className="text-sm" style={{ color: "var(--muted)" }}>
                    {doc.description}
                  </p>
                </div>
                <p className="text-xs shrink-0" style={{ color: "var(--muted)" }}>
                  {doc.date}
                </p>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
