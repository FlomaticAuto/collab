"use client";
import { useMemo, useState } from "react";

export interface AccordionItem {
  id: string;
  title: string;
  summary?: string;
  meta?: string;
  tags?: string[];
  group?: string;
  bodyHtml: string;
}

export default function Accordion({
  items,
  searchPlaceholder = "Search by title, tag, or content…",
  emptyMessage = "No items match your search.",
  showGroups = true,
}: {
  items: AccordionItem[];
  searchPlaceholder?: string;
  emptyMessage?: string;
  showGroups?: boolean;
}) {
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((d) => {
      const haystack = [
        d.title,
        d.summary ?? "",
        d.meta ?? "",
        (d.tags ?? []).join(" "),
        d.bodyHtml.replace(/<[^>]+>/g, " "),
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [query, items]);

  const grouped = useMemo(() => {
    if (!showGroups) return [["", filtered] as [string, AccordionItem[]]];
    const map = new Map<string, AccordionItem[]>();
    for (const d of filtered) {
      const g = d.group || "General";
      if (!map.has(g)) map.set(g, []);
      map.get(g)!.push(d);
    }
    return Array.from(map.entries());
  }, [filtered, showGroups]);

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
          placeholder={searchPlaceholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {filtered.length === 0 && <div className="info-empty">{emptyMessage}</div>}

      {grouped.map(([group, list]) => (
        <section key={group} className="info-section">
          {showGroups && (
            <div className="info-section-head">
              <h2 className="info-section-title">{group}</h2>
              <span className="info-section-count">{list.length}</span>
            </div>
          )}
          {list.map((d) => {
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
                    {d.summary && <p className="info-card-summary">{d.summary}</p>}
                    {d.tags && d.tags.length > 0 && (
                      <div style={{ marginTop: 6 }}>
                        {d.tags.map((t) => (
                          <span key={t} className="info-tag">{t}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  {d.meta && <p className="info-card-meta">{d.meta}</p>}
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
