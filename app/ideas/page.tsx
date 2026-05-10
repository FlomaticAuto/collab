import { getIdeas, Idea } from "@/lib/notion";

const PRIORITY_COLOUR: Record<string, string> = {
  High:   "var(--flo-danger)",
  Medium: "var(--flo-warning)",
  Low:    "var(--flo-teal)",
};

const PRIORITY_BG: Record<string, string> = {
  High:   "#FDF0EE",
  Medium: "#FDF0E8",
  Low:    "var(--flo-teal-lightest)",
};

const MOCK_IDEAS: Idea[] = [
  {
    id: "1",
    title: "Automated client onboarding flow in Make",
    owner: "Quint",
    priority: "High",
    notes: "Trigger on new Airtable row → create Zoho contact → send welcome email → Slack notification.",
  },
  {
    id: "2",
    title: "Self-serve invoice portal for small clients",
    owner: "Armand",
    priority: "Medium",
    notes: "Lightweight page where clients can view and download their invoices without logging into Zoho.",
  },
];

async function getData(): Promise<Idea[]> {
  if (!process.env.NOTION_IDEAS_DB_ID) return MOCK_IDEAS;
  try { return await getIdeas(); } catch { return MOCK_IDEAS; }
}

export default async function IdeasPage() {
  const ideas = await getData();

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <p className="label-eyebrow mb-3">Exploration</p>
      <h1 className="mb-3" style={{ fontFamily: "var(--flo-font-display)", fontWeight: 700, fontSize: 32, color: "var(--foreground)" }}>
        Ideas
      </h1>
      <p className="mb-12" style={{ fontFamily: "var(--flo-font-body)", fontWeight: 300, color: "var(--muted)" }}>
        Things worth exploring — owned, prioritised, and not forgotten.
      </p>

      <div className="space-y-3">
        {ideas.map((idea) => (
          <div
            key={idea.id}
            className="border p-5"
            style={{
              borderColor: "var(--border)",
              background: "var(--surface)",
              borderRadius: "var(--flo-radius-lg)",
            }}
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <h2 style={{ fontFamily: "var(--flo-font-ui)", fontWeight: 600, fontSize: 14, color: "var(--foreground)" }}>
                {idea.title}
              </h2>
              <div className="flex items-center gap-2 shrink-0">
                <span
                  style={{
                    fontFamily: "var(--flo-font-ui)",
                    fontSize: 10,
                    fontWeight: 600,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    padding: "2px 8px",
                    borderRadius: "var(--flo-radius-sm)",
                    background: PRIORITY_BG[idea.priority] ?? "var(--flo-n-100)",
                    color: PRIORITY_COLOUR[idea.priority] ?? "var(--flo-n-500)",
                  }}
                >
                  {idea.priority}
                </span>
                <span style={{ fontFamily: "var(--flo-font-ui)", fontSize: 11, fontWeight: 600, color: "var(--flo-teal)" }}>
                  {idea.owner}
                </span>
              </div>
            </div>
            {idea.notes && (
              <p style={{ fontFamily: "var(--flo-font-body)", fontSize: 13, color: "var(--muted)", lineHeight: 1.6 }}>
                {idea.notes}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
