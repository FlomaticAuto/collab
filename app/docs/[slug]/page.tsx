import { getDocs, getDoc } from "@/lib/notion";
import { notFound } from "next/navigation";
import Link from "next/link";
import Markdown from "@/components/Markdown";

export const dynamicParams = false;

export async function generateStaticParams() {
  if (!process.env.NOTION_DOCS_DB_ID) return [{ slug: "_placeholder" }];
  try {
    const docs = await getDocs();
    const params = docs.map((d) => ({ slug: d.slug }));
    return params.length > 0 ? params : [{ slug: "_placeholder" }];
  } catch {
    return [{ slug: "_placeholder" }];
  }
}

export default async function DocPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  if (slug === "_placeholder" || !process.env.NOTION_DOCS_DB_ID) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-16">
        <Link href="/docs" className="text-sm mb-8 block" style={{ color: "var(--muted)" }}>
          ← Back to docs
        </Link>
        <div
          className="rounded-xl border p-8 text-center"
          style={{ borderColor: "var(--border)", color: "var(--muted)" }}
        >
          Connect your Notion database to read documents here.
        </div>
      </div>
    );
  }

  let doc, markdown;
  try {
    ({ doc, markdown } = await getDoc(slug));
  } catch {
    notFound();
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <Link href="/docs" className="text-sm mb-8 inline-block" style={{ color: "var(--muted)" }}>
        ← Back to docs
      </Link>
      <p className="label-eyebrow mb-3">{doc!.category || "General"}</p>
      <h1
        className="mb-3"
        style={{ fontFamily: "var(--flo-font-display)", fontWeight: 700, fontSize: 32, color: "var(--foreground)" }}
      >
        {doc!.title}
      </h1>
      {doc!.date && (
        <p className="mb-8" style={{ fontFamily: "var(--flo-font-ui)", fontSize: 12, color: "var(--muted)" }}>
          {doc!.date}
        </p>
      )}
      {doc!.description && (
        <p className="mb-10" style={{ fontFamily: "var(--flo-font-body)", fontWeight: 300, fontSize: 16, color: "var(--muted)", lineHeight: 1.65 }}>
          {doc!.description}
        </p>
      )}
      <Markdown source={markdown!} />
    </div>
  );
}
