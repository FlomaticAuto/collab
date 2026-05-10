import { getIdeas, Idea } from "@/lib/notion";

const PRIORITY_COLOUR: Record<string, string> = {
  High: "#ef4444",
  Medium: "#f59e0b",
  Low: "#6366f1",
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
  try {
    return await getIdeas();
  } catch {
    return MOCK_IDEAS;
  }
}

export default async function IdeasPage() {
  const ideas = await getData();

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold tracking-tight mb-3">Ideas</h1>
      <p className="mb-12 text-base" style={{ color: "var(--muted)" }}>
        Things worth exploring — owned, prioritised, and not forgotten.
      </p>

      <div className="space-y-3">
        {ideas.map((idea) => (
          <div
            key={idea.id}
            className="rounded-xl border p-5"
            style={{ borderColor: "var(--border)", background: "var(--surface)" }}
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <h2 className="font-semibold text-sm">{idea.title}</h2>
              <div className="flex items-center gap-2 shrink-0">
                <span
                  className="text-xs px-2 py-0.5 rounded-full font-medium"
                  style={{
                    background: (PRIORITY_COLOUR[idea.priority] ?? "#71717a") + "22",
                    color: PRIORITY_COLOUR[idea.priority] ?? "#71717a",
                  }}
                >
                  {idea.priority}
                </span>
                <span className="text-xs font-medium" style={{ color: "var(--accent-light)" }}>
                  {idea.owner}
                </span>
              </div>
            </div>
            {idea.notes && (
              <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                {idea.notes}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
