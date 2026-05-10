import { Client } from "@notionhq/client";
import { NotionToMarkdown } from "notion-to-md";
import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const n2m = new NotionToMarkdown({ notionClient: notion });

// ── Database IDs from env ───────────────────────────────────────────────────
const DB = {
  blog: process.env.NOTION_BLOG_DB_ID!,
  projects: process.env.NOTION_PROJECTS_DB_ID!,
  docs: process.env.NOTION_DOCS_DB_ID!,
  ideas: process.env.NOTION_IDEAS_DB_ID!,
};

// ── Helpers ─────────────────────────────────────────────────────────────────

function prop(page: PageObjectResponse, name: string) {
  return (page.properties as Record<string, unknown>)[name];
}

function richText(p: unknown): string {
  const items = (p as { rich_text: { plain_text: string }[] }).rich_text;
  return items?.map((t) => t.plain_text).join("") ?? "";
}

function title(p: unknown): string {
  const items = (p as { title: { plain_text: string }[] }).title;
  return items?.map((t) => t.plain_text).join("") ?? "";
}

function select(p: unknown): string {
  return (p as { select?: { name: string } }).select?.name ?? "";
}

function multiSelect(p: unknown): string[] {
  return (
    (p as { multi_select: { name: string }[] }).multi_select?.map(
      (s) => s.name
    ) ?? []
  );
}

function date(p: unknown): string {
  return (p as { date?: { start: string } }).date?.start ?? "";
}

function url(p: unknown): string {
  return (p as { url?: string }).url ?? "";
}

// ── Types ────────────────────────────────────────────────────────────────────

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  author: string;
  date: string;
  tags: string[];
  excerpt: string;
  status: string;
}

export interface Project {
  id: string;
  name: string;
  status: string;
  description: string;
  link: string;
  tags: string[];
}

export interface Doc {
  id: string;
  title: string;
  category: string;
  date: string;
  description: string;
}

export interface Idea {
  id: string;
  title: string;
  owner: string;
  priority: string;
  notes: string;
}

// ── Fetchers ─────────────────────────────────────────────────────────────────

export async function getBlogPosts(): Promise<BlogPost[]> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const res = await (notion as any).dataSources.query({
    database_id: DB.blog,
    filter: { property: "Status", select: { equals: "Published" } },
    sorts: [{ property: "Date", direction: "descending" }],
  });
  return (res.results as PageObjectResponse[]).map((p) => ({
    id: p.id,
    slug: p.id.replace(/-/g, ""),
    title: title(prop(p, "Title")),
    author: select(prop(p, "Author")),
    date: date(prop(p, "Date")),
    tags: multiSelect(prop(p, "Tags")),
    excerpt: richText(prop(p, "Excerpt")),
    status: select(prop(p, "Status")),
  }));
}

export async function getBlogPost(id: string): Promise<{ post: BlogPost; markdown: string }> {
  const page = (await notion.pages.retrieve({ page_id: id })) as PageObjectResponse;
  const mdBlocks = await n2m.pageToMarkdown(id);
  const markdown = n2m.toMarkdownString(mdBlocks).parent;
  return {
    post: {
      id: page.id,
      slug: page.id.replace(/-/g, ""),
      title: title(prop(page, "Title")),
      author: select(prop(page, "Author")),
      date: date(prop(page, "Date")),
      tags: multiSelect(prop(page, "Tags")),
      excerpt: richText(prop(page, "Excerpt")),
      status: select(prop(page, "Status")),
    },
    markdown,
  };
}

export async function getProjects(): Promise<Project[]> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const res = await (notion as any).dataSources.query({
    database_id: DB.projects,
    sorts: [{ property: "Name", direction: "ascending" }],
  });
  return (res.results as PageObjectResponse[]).map((p) => ({
    id: p.id,
    name: title(prop(p, "Name")),
    status: select(prop(p, "Status")),
    description: richText(prop(p, "Description")),
    link: url(prop(p, "Link")),
    tags: multiSelect(prop(p, "Tags")),
  }));
}

export async function getDocs(): Promise<Doc[]> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const res = await (notion as any).dataSources.query({
    database_id: DB.docs,
    sorts: [{ property: "Date", direction: "descending" }],
  });
  return (res.results as PageObjectResponse[]).map((p) => ({
    id: p.id,
    title: title(prop(p, "Title")),
    category: select(prop(p, "Category")),
    date: date(prop(p, "Date")),
    description: richText(prop(p, "Description")),
  }));
}

export async function getIdeas(): Promise<Idea[]> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const res = await (notion as any).dataSources.query({
    database_id: DB.ideas,
    sorts: [{ property: "Priority", direction: "ascending" }],
  });
  return (res.results as PageObjectResponse[]).map((p) => ({
    id: p.id,
    title: title(prop(p, "Title")),
    owner: select(prop(p, "Owner")),
    priority: select(prop(p, "Priority")),
    notes: richText(prop(p, "Notes")),
  }));
}
