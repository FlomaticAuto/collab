# How the FlomaticAuto Collab Site Works

A user-facing guide for Quint and Armand. Use this when adding content to Notion and you want to know what will appear on
[flomaticauto.github.io/collab](https://flomaticauto.github.io/collab/).

---

## TL;DR

You write in Notion. Within ~15 minutes, the site rebuilds and your page appears under the matching tab.

```
You add a page in Notion
        ↓
Make.com polls Notion every 15 minutes (scenario: Notion → GitHub Pages Redeploy)
        ↓
Make detects the new/changed page → triggers GitHub Actions
        ↓
GitHub builds the site (fetches from Notion, downloads images, renders markdown)
        ↓
Site is live at flomaticauto.github.io/collab
```

You don't push code. You don't run a build. You just write in Notion and refresh the site after a few minutes.

---

## The four content areas

The site has four tabs, each backed by a separate Notion database in the
**Collab — FlowmaticAuto** workspace.

| Tab | Notion database | What it's for |
|---|---|---|
| **Blog** | Blog Posts | Notes, ideas, research, written-up findings |
| **Projects** | Projects | Active and past engagements with status |
| **Docs** | Docs | Reference material — methodologies, decisions, standards |
| **Ideas** | Ideas | Things worth exploring — owned, prioritised, not forgotten |

### Which database your page goes in determines which tab it shows up under.
Putting a page in the **Docs** database makes it appear on the **Docs** tab, not Blog.

---

## What to write in Notion (per database)

Each database has named properties on the side panel. Fill them in — they map directly to what shows on the cards.

### Blog Posts
| Notion property | Type | Used for |
|---|---|---|
| `Title` | Title | The post title |
| `Author` | Select | Quint or Armand |
| `Date` | Date | Sort order (newest first) |
| `Tags` | Multi-select | Pills under the post |
| `Excerpt` | Text | The preview line under the title |
| `Status` | Select | **Must be `Published` to appear** — Draft posts are hidden |

The page **body** (what you type into the page itself) is rendered as the post content when someone clicks the post.

### Projects
| Notion property | Type | Used for |
|---|---|---|
| `Name` | Title | Project name |
| `Status` | Select | Active / In Progress / Planned / Done / Paused — colours the left border |
| `Description` | Text | Description on the card |
| `Link` | URL | "View external link" button on the detail page |
| `Tags` | Multi-select | Tag pills |

Body of the page → full project detail view when clicked.

### Docs (the accordion knowledge base)
| Notion property | Type | Used for |
|---|---|---|
| `Title` | Title | The doc title (rendered in caps) |
| `Category` | Select | Groups docs into sections (Company / Technical / Client / Financial / General) |
| `Date` | Date | Shown on the right |
| `Description` | Text | The summary line under the title |
| `Tags` | Multi-select | Pills under the description (optional — add the column if you want them) |

Body of the page → expanded content when the user clicks the chevron.
**Docs expand inline** — they don't navigate to a separate page.

### Ideas
| Notion property | Type | Used for |
|---|---|---|
| `Title` | Title | Idea title |
| `Owner` | Select | Quint / Armand / etc. |
| `Priority` | Select | High / Medium / Low — colour-coded pill |
| `Notes` | Text | Short summary on the card |

Body of the page → full idea detail when clicked.

---

## Writing the page body

The body of each Notion page is converted to **markdown**, then rendered with
brand-styled prose on the site. That means:

- **Headings** (H1/H2/H3 in Notion) become big section titles
- **Bullet lists** and **numbered lists** render as expected
- **Bold**, *italic*, `inline code`, and code blocks all carry over
- **Tables** render as styled tables
- **Quotes** become teal-bordered blockquotes
- **Links** become teal underlined links
- **Images** are downloaded at build time and served from the site itself
  (Notion image URLs expire after 1 hour, so we make our own copies)

What does NOT carry over today:
- Notion-specific blocks like databases-inside-pages, synced blocks, callouts with custom icons
- Toggles render as plain headings + content
- Embeds (Figma, YouTube, etc.) render as plain links

If you need anything fancy, write it in plain text/markdown style and it'll come out clean.

---

## What happens after you save in Notion

**0 sec** — You finish editing in Notion. Nothing visible yet.

**Up to 15 min later** — Make.com's scenario polls the Notion database. When it sees a new or
edited page, it fires a "redeploy" signal at GitHub.

**~2 min after that** — GitHub Actions:
1. Pulls the latest code
2. Asks Notion's API for every page in every database
3. Downloads any images on those pages and saves them to the site
4. Generates static HTML for every page (Blog post, Project, Doc, Idea)
5. Deploys the result to GitHub Pages

**~17 min total worst case** — Refresh the site. Your page is there.

**To force an immediate update**: open the Make scenario at
[eu2.make.com/863966/scenarios/9208180/edit](https://eu2.make.com/863966/scenarios/9208180/edit)
and click **Run once**. The first GitHub Action is queued in seconds; the build still takes ~2 min.

---

## Things that won't appear

A page won't show up if any of these are true:

- **Blog only**: `Status` is not `Published`
- The page has no `Title` (or `Name` for Projects) — looks blank
- The page is in the wrong database (e.g. you wrote a doc in the Blog Posts database expecting it on the Docs tab)
- The Notion integration was disconnected from that database. (To check: in Notion, open the database → top-right `…` → Connections → confirm "Flomatic Colab" is listed.)
- It's been less than ~15 minutes since you saved AND you haven't manually triggered Make

---

## Themes and fonts (visitor side)

Anyone visiting the site can switch between five colour themes (Light / Dark / Vivid / Steel / Ink) and five fonts
(Syne / Jakarta / Serif / Mono / Grotesk). The choice is saved per-browser; nothing to configure on your side.

---

## Quick checklist for adding a new doc

1. Open the **Docs** database in the Notion workspace
2. Click **+ New** → name your page
3. Fill in `Category`, `Date`, `Description` on the right panel
4. (Optional) Add the `Tags` column to the database if you want tag pills, then tag the page
5. Write the content in the page body
6. Wait 5–17 minutes, or hit **Run once** in Make
7. Refresh `flomaticauto.github.io/collab/docs/`
8. Click the chevron on your new doc to expand it

---

## When something goes wrong

- **Page didn't appear after 20 min**: hit **Run once** in Make → wait 3 min → refresh. If still missing, check the page is in the right database and (for Blog) `Status = Published`.
- **Image broken**: the build downloads images into `public/images/notion/`. If a Notion image URL was unreachable during build, the original (expired) URL is left in. Re-saving the Notion page and triggering a new build usually fixes it.
- **Markdown looks weird**: Notion exports very minimal markdown. Stick to plain headings, lists, paragraphs, and code blocks for the cleanest output.
- **GitHub Action failed**: check [github.com/FlomaticAuto/collab/actions](https://github.com/FlomaticAuto/collab/actions) — most failures are transient (Notion API rate limit, GitHub Pages deploy hiccup) and resolve on the next push.

---

## Architecture (one-liner per moving piece)

- **Next.js 16** static export with `basePath: /collab` — generates a folder of HTML files
- **GitHub Pages** — serves those files at `flomaticauto.github.io/collab`
- **Notion API v5** — `dataSources.query()` pulls pages; `notion-to-md` converts blocks to markdown
- **Make.com** — webhook bridge: watches Notion → triggers GitHub workflow_dispatch
- **GitHub Actions** — runs `npm run build`, injects a SPA 404 fallback, uploads to Pages
