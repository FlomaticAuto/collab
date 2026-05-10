import { getBlogPostsWithBodies, BlogPostWithBody } from "@/lib/notion";
import Accordion, { AccordionItem } from "@/components/Accordion";

const MOCK: BlogPostWithBody[] = [
  {
    id: "1",
    slug: "1",
    title: "Getting started with Make.com automations",
    author: "Quint",
    date: "2026-05-01",
    tags: ["Automation", "Make"],
    excerpt: "A walkthrough of how we structure multi-step scenarios.",
    status: "Published",
    bodyHtml: "<h3>Why Make</h3><p>Connect your Notion <strong>Blog Posts</strong> database to populate this with real content.</p>",
  },
  {
    id: "2",
    slug: "2",
    title: "Notion as a CMS — what works and what doesn't",
    author: "Armand",
    date: "2026-04-20",
    tags: ["Notion", "CMS"],
    excerpt: "Our honest take on using Notion databases as a backend for client sites.",
    status: "Published",
    bodyHtml: "<h3>The pros</h3><p>Editors love it. Built-in versioning. Easy collaboration.</p>",
  },
];

async function getData(): Promise<BlogPostWithBody[]> {
  if (!process.env.NOTION_BLOG_DB_ID) return MOCK;
  try {
    const items = await getBlogPostsWithBodies();
    return items.length > 0 ? items : MOCK;
  } catch {
    return MOCK;
  }
}

export default async function BlogPage() {
  const posts = await getData();
  const items: AccordionItem[] = posts.map((p) => ({
    id: p.id,
    title: p.title,
    summary: p.excerpt,
    meta: [p.author, p.date].filter(Boolean).join(" · "),
    tags: p.tags,
    group: p.date ? p.date.slice(0, 4) : "Undated",
    bodyHtml: p.bodyHtml,
  }));

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <p className="label-eyebrow mb-3">Writing</p>
      <h1
        className="mb-3"
        style={{ fontFamily: "var(--flo-font-display)", fontWeight: 800, fontSize: 36, letterSpacing: "0.02em", textTransform: "uppercase", color: "var(--foreground)" }}
      >
        Blog
      </h1>
      <p className="mb-8" style={{ fontFamily: "var(--flo-font-body)", fontWeight: 300, color: "var(--muted)" }}>
        Notes, research, and things worth writing down. Click any post to read.
      </p>
      <Accordion items={items} searchPlaceholder="Search posts by title, author, tag, or content…" />
    </div>
  );
}
