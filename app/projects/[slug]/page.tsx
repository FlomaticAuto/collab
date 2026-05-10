import { getProjects, getProject } from "@/lib/notion";
import { notFound } from "next/navigation";
import Link from "next/link";
import Markdown from "@/components/Markdown";

export const dynamicParams = false;

export async function generateStaticParams() {
  if (!process.env.NOTION_PROJECTS_DB_ID) return [{ slug: "_placeholder" }];
  try {
    const projects = await getProjects();
    const params = projects.map((p) => ({ slug: p.slug }));
    return params.length > 0 ? params : [{ slug: "_placeholder" }];
  } catch {
    return [{ slug: "_placeholder" }];
  }
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  if (slug === "_placeholder" || !process.env.NOTION_PROJECTS_DB_ID) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-16">
        <Link href="/projects" className="text-sm mb-8 block" style={{ color: "var(--muted)" }}>
          ← Back to projects
        </Link>
        <div
          className="rounded-xl border p-8 text-center"
          style={{ borderColor: "var(--border)", color: "var(--muted)" }}
        >
          Connect your Notion database to view project details here.
        </div>
      </div>
    );
  }

  let project, markdown;
  try {
    ({ project, markdown } = await getProject(slug));
  } catch {
    notFound();
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <Link href="/projects" className="text-sm mb-8 inline-block" style={{ color: "var(--muted)" }}>
        ← Back to projects
      </Link>
      <p className="label-eyebrow mb-3">{project!.status || "Project"}</p>
      <h1
        className="mb-3"
        style={{ fontFamily: "var(--flo-font-display)", fontWeight: 700, fontSize: 32, color: "var(--foreground)" }}
      >
        {project!.name}
      </h1>
      {project!.description && (
        <p className="mb-6" style={{ fontFamily: "var(--flo-font-body)", fontWeight: 300, fontSize: 16, color: "var(--muted)", lineHeight: 1.65 }}>
          {project!.description}
        </p>
      )}
      {project!.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          {project!.tags.map((tag) => (
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
      )}
      {project!.link && (
        <a
          href={project!.link}
          target="_blank"
          rel="noopener noreferrer"
          className="mb-8 inline-block"
          style={{ fontFamily: "var(--flo-font-ui)", fontSize: 13, fontWeight: 600, color: "var(--flo-teal)" }}
        >
          View external link →
        </a>
      )}
      <Markdown source={markdown!} />
    </div>
  );
}
