import { getBlogPosts, getBlogPost } from "@/lib/notion";
import { notFound } from "next/navigation";
import Link from "next/link";
import Markdown from "@/components/Markdown";

export const dynamicParams = false;

export async function generateStaticParams() {
  if (!process.env.NOTION_BLOG_DB_ID) {
    // Static export requires at least one param — placeholder never renders real content
    return [{ slug: "_placeholder" }];
  }
  try {
    const posts = await getBlogPosts();
    const params = posts.map((p) => ({ slug: p.slug }));
    return params.length > 0 ? params : [{ slug: "_placeholder" }];
  } catch {
    return [{ slug: "_placeholder" }];
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  if (slug === "_placeholder" || !process.env.NOTION_BLOG_DB_ID) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-16">
        <Link href="/blog" className="text-sm mb-8 block" style={{ color: "var(--muted)" }}>
          ← Back to blog
        </Link>
        <div
          className="rounded-xl border p-8 text-center"
          style={{ borderColor: "var(--border)", color: "var(--muted)" }}
        >
          Connect your Notion database to read posts here.
        </div>
      </div>
    );
  }

  let post, markdown;
  try {
    ({ post, markdown } = await getBlogPost(slug));
  } catch {
    notFound();
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <Link href="/collab/blog" className="text-sm mb-8 block" style={{ color: "var(--muted)" }}>
        ← Back to blog
      </Link>
      <p className="text-xs mb-2" style={{ color: "var(--accent-light)" }}>
        {post!.author} · {post!.date}
      </p>
      <h1 className="text-3xl font-bold tracking-tight mb-4">{post!.title}</h1>
      <div className="flex flex-wrap gap-2 mb-10">
        {post!.tags.map((tag) => (
          <span
            key={tag}
            className="text-xs px-2 py-0.5 rounded-full"
            style={{ background: "var(--border)", color: "var(--muted)" }}
          >
            {tag}
          </span>
        ))}
      </div>
      <Markdown source={markdown!} />
    </div>
  );
}
