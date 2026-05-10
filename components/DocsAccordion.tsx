"use client";
import { useMemo, useState } from "react";
import type { DocWithBody } from "@/lib/notion";

export default function DocsAccordion({ docs }: { docs: DocWithBody[] }) {
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return docs;
    return docs.filter((d) => {
      const haystack = [
        d.title,
        d.category,
        d.description,
        d.tags.join(" "),
        d.bodyHtml.replace(/<[^>]+>/g, " "),
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [query, docs]);

  const grouped = useMemo(() => {
    const map = new Map<string, DocWithBody[]>();
    for (const d of filtered) {
      const cat = d.category || "General";
      if (!map.has(cat)) map.set(cat, []);
      map.get(cat)!.push(d);
    }
    return Array.from(map.entries());
  }, [filtered]);

  return (
    <>
      <div className="info-search-wrap">
        <svg className="info-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="7" />
          <line x1="21" y1="21" x2="16.5" y2="16.5" />
        </svg>
        <input
          className="info-search"
          type="text"
          placeholder="Search by title, section, tag, or content…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {grouped.length === 0 && (
        <div className="info-empty">No documents match your search.</div>
      )}

      {grouped.map(([cat, items]) => (
        <section key={cat} className="info-section">
          <div className="info-section-head">
            <h2 className="info-section-title">{cat}</h2>
            <span className="info-section-count">{items.length}</span>
          </div>
          {items.map((d) => {
            const open = openId === d.id;
            return (
              <div key={d.id} className={`info-card ${open ? "open" : ""}`}>
                <div
                  className="info-card-head"
                  onClick={() => setOpenId(open ? null : d.id)}
                >
                  <svg className="info-card-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="9 6 15 12 9 18" />
                  </svg>
                  <div className="info-card-text">
                    <h3 className="info-card-title">{d.title || "Untitled"}</h3>
                    {d.description && <p className="info-card-summary">{d.description}</p>}
                    {d.tags.length > 0 && (
                      <div style={{ marginTop: 6 }}>
                        {d.tags.map((t) => (
                          <span key={t} className="info-tag">{t}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  {d.date && <p className="info-card-meta">{d.date}</p>}
                </div>
                <div className="info-card-body" dangerouslySetInnerHTML={{ __html: d.bodyHtml }} />
              </div>
            );
          })}
        </section>
      ))}
    </>
  );
}
