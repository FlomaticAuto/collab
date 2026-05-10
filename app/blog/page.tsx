import Link from "next/link";
import { getBlogPosts, BlogPost } from "@/lib/notion";

// Fallback mock data used when Notion env vars are not configured
const MOCK_POSTS: BlogPost[] = [
  {
    id: "1",
    slug: "1",
    title: "Getting started with Make.com automations",
    author: "Quint",
    date: "2026-05-01",
    tags: ["Automation", "Make"],
    excerpt: "A walkthrough of how we structure multi-step scenarios to avoid timeouts and keep modules reusable.",
    status: "Published",
  },
  {
    id: "2",
    slug: "2",
    title: "Notion as a CMS — what works and what doesn't",
    author: "Armand",
    date: "2026-04-20",
    tags: ["Notion", "CMS"],
    excerpt: "We've been using Notion databases as a backend for several client sites. Here's our honest take.",
    status: "Published",
  },
];

async function getPosts(): Promise<BlogPost[]> {
  if (!process.env.NOTION_BLOG_DB_ID) return MOCK_POSTS;
  try {
    return await getBlogPosts();
  } catch {
    return MOCK_POSTS;
  }
}

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold tracking-tight mb-3">Blog</h1>
      <p className="mb-12 text-base" style={{ color: "var(--muted)" }}>
        Notes, research, and things worth writing down.
      </p>

      <div className="space-y-px">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/collab/blog/${post.slug}`}
            className="block rounded-xl border p-5 transition-colors hover:border-indigo-500"
            style={{ borderColor: "var(--border)", background: "var(--surface)" }}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h2 className="font-semibold text-base mb-1 truncate">{post.title}</h2>
                <p className="text-sm leading-relaxed mb-3 line-clamp-2" style={{ color: "var(--muted)" }}>
                  {post.excerpt}
                </p>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-0.5 rounded-full"
                      style={{ background: "var(--border)", color: "var(--muted)" }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="text-xs mb-1" style={{ color: "var(--muted)" }}>
                  {post.date}
                </p>
                <p className="text-xs font-medium" style={{ color: "var(--accent-light)" }}>
                  {post.author}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
