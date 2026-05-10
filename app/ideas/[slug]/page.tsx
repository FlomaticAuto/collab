import { getIdeas, getIdea } from "@/lib/notion";
import { notFound } from "next/navigation";
import Link from "next/link";
import Markdown from "@/components/Markdown";

export const dynamicParams = false;

export async function generateStaticParams() {
  if (!process.env.NOTION_IDEAS_DB_ID) return [{ slug: "_placeholder" }];
  try {
    const ideas = await getIdeas();
    const params = ideas.map((i) => ({ slug: i.slug }));
    return params.length > 0 ? params : [{ slug: "_placeholder" }];
  } catch {
    return [{ slug: "_placeholder" }];
  }
}

export default async function IdeaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  if (slug === "_placeholder" || !process.env.NOTION_IDEAS_DB_ID) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-16">
        <Link href="/ideas" className="text-sm mb-8 block" style={{ color: "var(--muted)" }}>
          ← Back to ideas
        </Link>
        <div
          className="rounded-xl border p-8 text-center"
          style={{ borderColor: "var(--border)", color: "var(--muted)" }}
        >
          Connect your Notion database to view idea details here.
        </div>
      </div>
    );
  }

  let idea, markdown;
  try {
    ({ idea, markdown } = await getIdea(slug));
  } catch {
    notFound();
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <Link href="/ideas" className="text-sm mb-8 inline-block" style={{ color: "var(--muted)" }}>
        ← Back to ideas
      </Link>
      <p className="label-eyebrow mb-3">{idea!.priority || "Idea"} · {idea!.owner || "Unowned"}</p>
      <h1
        className="mb-6"
        style={{ fontFamily: "var(--flo-font-display)", fontWeight: 700, fontSize: 32, color: "var(--foreground)" }}
      >
        {idea!.title}
      </h1>
      {idea!.notes && (
        <p className="mb-10" style={{ fontFamily: "var(--flo-font-body)", fontWeight: 300, fontSize: 16, color: "var(--muted)", lineHeight: 1.65 }}>
          {idea!.notes}
        </p>
      )}
      <Markdown source={markdown!} />
    </div>
  );
}
