import fs from "fs";
import path from "path";
import crypto from "crypto";
import https from "https";
import http from "http";

const IMAGE_DIR = path.join(process.cwd(), "public", "images", "notion");

function ensureDir() {
  if (!fs.existsSync(IMAGE_DIR)) {
    fs.mkdirSync(IMAGE_DIR, { recursive: true });
  }
}

function urlToFilename(imageUrl: string, ext: string): string {
  const hash = crypto.createHash("md5").update(imageUrl).digest("hex").slice(0, 12);
  return `${hash}.${ext}`;
}

function guessExt(imageUrl: string): string {
  const clean = imageUrl.split("?")[0];
  const match = clean.match(/\.(png|jpe?g|gif|webp|svg|avif)$/i);
  if (match) return match[1].toLowerCase().replace("jpeg", "jpg");
  return "jpg";
}

function download(imageUrl: string, dest: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    const get = imageUrl.startsWith("https") ? https.get : http.get;
    get(imageUrl, (res) => {
      // Follow up to 3 redirects
      if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        file.close();
        fs.unlinkSync(dest);
        download(res.headers.location, dest).then(resolve).catch(reject);
        return;
      }
      if (res.statusCode && res.statusCode >= 400) {
        file.close();
        fs.unlinkSync(dest);
        reject(new Error(`HTTP ${res.statusCode} for ${imageUrl}`));
        return;
      }
      res.pipe(file);
      file.on("finish", () => file.close(() => resolve()));
    }).on("error", (err) => {
      fs.unlink(dest, () => reject(err));
    });
  });
}

// Downloads image if not already cached. Returns the /collab-relative public path.
export async function localiseImage(imageUrl: string): Promise<string> {
  ensureDir();
  const ext = guessExt(imageUrl);
  const filename = urlToFilename(imageUrl, ext);
  const dest = path.join(IMAGE_DIR, filename);

  if (!fs.existsSync(dest)) {
    await download(imageUrl, dest);
  }

  // basePath is /collab — public files are served from there
  return `/collab/images/notion/${filename}`;
}

// Rewrites all Markdown image tags ![alt](url) replacing Notion URLs with local paths.
export async function rewriteImages(markdown: string): Promise<string> {
  const imageRegex = /!\[([^\]]*)\]\((https?:\/\/[^)]+)\)/g;
  const matches = [...markdown.matchAll(imageRegex)];
  if (matches.length === 0) return markdown;

  // Download all images in parallel
  const rewrites = await Promise.all(
    matches.map(async (match) => {
      const [full, alt, url] = match;
      try {
        const localPath = await localiseImage(url);
        return { full, replacement: `![${alt}](${localPath})` };
      } catch (err) {
        console.warn(`[notion-images] Failed to download ${url}:`, err);
        return { full, replacement: full }; // leave original on failure
      }
    })
  );

  let result = markdown;
  for (const { full, replacement } of rewrites) {
    result = result.replace(full, replacement);
  }
  return result;
}
