import { marked } from "marked";

export default async function Markdown({ source }: { source: string }) {
  const html = await marked.parse(source || "*No content yet.*", { gfm: true, breaks: true });
  return (
    <article
      className="flo-prose"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
