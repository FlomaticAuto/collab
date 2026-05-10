import Link from "next/link";
import { getBlogPosts, BlogPost } from "@/lib/notion";

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
  try { return await getBlogPosts(); } catch { return MOCK_POSTS; }
}

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <p className="label-eyebrow mb-3">Writing</p>
      <h1 className="mb-3" style={{ fontFamily: "var(--flo-font-display)", fontWeight: 700, fontSize: 32, color: "var(--foreground)" }}>
        Blog
      </h1>
      <p className="mb-12" style={{ fontFamily: "var(--flo-font-body)", fontWeight: 300, color: "var(--muted)" }}>
        Notes, research, and things worth writing down.
      </p>

      <div className="space-y-3">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/blog/${post.slug}`}
            className="flo-card block p-5"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h2
                  className="mb-1 truncate"
                  style={{ fontFamily: "var(--flo-font-ui)", fontWeight: 600, fontSize: 15, color: "var(--foreground)" }}
                >
                  {post.title}
                </h2>
                <p className="mb-3 line-clamp-2" style={{ fontFamily: "var(--flo-font-body)", fontSize: 13, color: "var(--muted)" }}>
                  {post.excerpt}
                </p>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      style={{
                        fontFamily: "var(--flo-font-ui)",
                        fontSize: 10,
                        fontWeight: 600,
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                        padding: "2px 8px",
                        borderRadius: "var(--flo-radius-sm)",
                        background: "var(--flo-teal-lightest)",
                        color: "var(--flo-teal-darker)",
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="text-right shrink-0">
                <p style={{ fontFamily: "var(--flo-font-ui)", fontSize: 11, color: "var(--muted)" }}>{post.date}</p>
                <p style={{ fontFamily: "var(--flo-font-ui)", fontSize: 11, fontWeight: 600, color: "var(--flo-teal)" }}>{post.author}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
