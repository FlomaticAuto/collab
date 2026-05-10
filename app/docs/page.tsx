import Link from "next/link";
import { getDocs, Doc } from "@/lib/notion";

const MOCK_DOCS: Doc[] = [
  {
    id: "1",
    slug: "1",
    title: "FlowmaticAuto Services Overview",
    category: "Company",
    date: "2026-04-15",
    description: "What we offer, how we price, and how to scope a new engagement.",
  },
  {
    id: "2",
    slug: "2",
    title: "Make.com Scenario Design Standards",
    category: "Technical",
    date: "2026-03-28",
    description: "Internal conventions for naming, error handling, and data mapping in Make scenarios.",
  },
];

async function getData(): Promise<Doc[]> {
  if (!process.env.NOTION_DOCS_DB_ID) return MOCK_DOCS;
  try { return await getDocs(); } catch { return MOCK_DOCS; }
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
      <p className="label-eyebrow mb-3">Reference</p>
      <h1 className="mb-3" style={{ fontFamily: "var(--flo-font-display)", fontWeight: 700, fontSize: 32, color: "var(--foreground)" }}>
        Docs
      </h1>
      <p className="mb-12" style={{ fontFamily: "var(--flo-font-body)", fontWeight: 300, color: "var(--muted)" }}>
        Published reports, specs, and reference documents.
      </p>

      {Object.entries(byCategory).map(([cat, items]) => (
        <section key={cat} className="mb-10">
          <p className="label-eyebrow mb-4">{cat}</p>
          <div className="space-y-3">
            {items.map((doc) => (
              <Link
                key={doc.id}
                href={`/docs/${doc.slug}`}
                className="flo-card block p-5 flex items-start justify-between gap-4"
              >
                <div>
                  <h3 style={{ fontFamily: "var(--flo-font-ui)", fontWeight: 600, fontSize: 14, color: "var(--foreground)", marginBottom: 4 }}>
                    {doc.title}
                  </h3>
                  <p style={{ fontFamily: "var(--flo-font-body)", fontSize: 13, color: "var(--muted)" }}>
                    {doc.description}
                  </p>
                </div>
                <p style={{ fontFamily: "var(--flo-font-ui)", fontSize: 11, color: "var(--muted)", whiteSpace: "nowrap" }}>
                  {doc.date}
                </p>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
