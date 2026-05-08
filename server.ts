import express from "express";
import path from "path";
import { createServer as createViteServer, loadEnv } from "vite";
import fs from "fs";
import os from "os";
import { mkdir } from "fs/promises";
import sanitizeFilename from "sanitize-filename";
import YTDlpWrapImport from "yt-dlp-wrap";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// yt-dlp-wrap is published as CJS and exposes the class at `.default`.
const YTDlpWrap: any = (YTDlpWrapImport as any)?.default ?? (YTDlpWrapImport as any);

type Platform = "instagram" | "youtube" | "tiktok" | "facebook" | "twitter" | "unknown";

function guessPlatform(info: any): Platform {
  const key = String(info?.extractor_key || info?.extractor || "").toLowerCase();
  const webpage = String(info?.webpage_url || "").toLowerCase();
  const hostish = `${key} ${webpage}`;

  if (hostish.includes("instagram")) return "instagram";
  if (hostish.includes("youtube") || hostish.includes("youtu")) return "youtube";
  if (hostish.includes("tiktok")) return "tiktok";
  if (hostish.includes("facebook")) return "facebook";
  if (hostish.includes("twitter") || hostish.includes("x")) return "twitter";
  return "unknown";
}

function formatBytes(bytes?: number): string | undefined {
  if (!bytes || !Number.isFinite(bytes)) return undefined;
  const units = ["B", "KB", "MB", "GB", "TB"];
  let v = bytes;
  let i = 0;
  while (v >= 1024 && i < units.length - 1) {
    v /= 1024;
    i++;
  }
  const digits = i === 0 ? 0 : i <= 2 ? 1 : 2;
  return `${v.toFixed(digits)}${units[i]}`;
}

function isAllowedUrl(raw: string): boolean {
  let u: URL;
  try {
    u = new URL(raw);
  } catch {
    return false;
  }

  if (u.protocol !== "https:" && u.protocol !== "http:") return false;
  const host = u.hostname.toLowerCase();

  // Simple allowlist for now (Reels + Shorts). You can expand later.
  const allowedHosts = [
    "instagram.com",
    "www.instagram.com",
    "youtube.com",
    "www.youtube.com",
    "m.youtube.com",
    "youtu.be",
  ];
  return allowedHosts.includes(host);
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Ensure yt-dlp is available (auto-download into a cache folder).
  const cacheDir = path.join(process.cwd(), ".cache", "yt-dlp");
  await mkdir(cacheDir, { recursive: true });
  const ytDlpBinaryName = os.platform() === "win32" ? "yt-dlp.exe" : "yt-dlp";
  const ytDlpBinaryPath = path.join(cacheDir, ytDlpBinaryName);
  if (!fs.existsSync(ytDlpBinaryPath)) {
    console.log(`[yt-dlp] Downloading binary to ${ytDlpBinaryPath} ...`);
    await YTDlpWrap.downloadFromGithub(ytDlpBinaryPath);
  }
  const ytDlp = new YTDlpWrap(ytDlpBinaryPath);

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", time: new Date().toISOString() });
  });

  // Download via yt-dlp (streams to client)
  app.get("/api/download", async (req, res) => {
    const { url, formatId, filename, ext } = req.query;
    if (!url) return res.status(400).send("URL is required");
    if (!formatId) return res.status(400).send("formatId is required");

    const sourceUrl = String(url);
    if (!isAllowedUrl(sourceUrl)) {
      return res.status(400).send("Unsupported or invalid URL. Only Instagram Reels and YouTube Shorts links are allowed.");
    }

    const safeExt = String(ext || "mp4")
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "")
      .slice(0, 5) || "mp4";

    const safeNameBase = sanitizeFilename(String(filename || "video")).replace(/\.+$/g, "") || "video";
    const outName = safeNameBase.endsWith(`.${safeExt}`) ? safeNameBase : `${safeNameBase}.${safeExt}`;

    try {
      res.setHeader("Content-Type", safeExt === "webm" ? "video/webm" : "video/mp4");
      res.setHeader("Content-Disposition", `attachment; filename="${outName}"`);

      const stream = ytDlp.execStream([
        "--no-playlist",
        "--no-warnings",
        "--newline",
        "-f",
        String(formatId),
        "-o",
        "-",
        sourceUrl,
      ]);

      let stderrText = "";
      stream.on("ytDlpEvent", (_eventType, eventData) => {
        // Collect minimal logs for debugging; don't spam stdout.
        if (eventData) stderrText += `${eventData}\n`;
      });

      stream.on("error", (err) => {
        console.error("yt-dlp stream error:", err);
        if (!res.headersSent) res.status(500);
        res.end("Download failed");
      });

      stream.on("end", () => {
        // normal end
      });

      stream.pipe(res);
    } catch (error) {
      console.error("Download error:", error);
      res.status(500).send("Download failed");
    }
  });

  // Fetch real metadata + available progressive formats (mp4/webm with audio+video)
  app.post("/api/fetch-video", async (req, res) => {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: "URL is required" });

    try {
      const sourceUrl = String(url);
      if (!isAllowedUrl(sourceUrl)) {
        return res.status(400).json({
          error: "Unsupported or invalid URL. Only Instagram Reels and YouTube Shorts links are allowed.",
        });
      }

      // getVideoInfo uses --dump-json under the hood.
      const info = await ytDlp.getVideoInfo(sourceUrl);
      const platform = guessPlatform(info);
      const title = String(info?.title || "Video");
      const durationSec = typeof info?.duration === "number" ? info.duration : undefined;

      const thumbnail =
        String(info?.thumbnail || "") ||
        (Array.isArray(info?.thumbnails) && info.thumbnails.length
          ? String(info.thumbnails[info.thumbnails.length - 1]?.url || "")
          : "");

      const formats: any[] = Array.isArray(info?.formats) ? info.formats : [];
      const progressive = formats
        .filter((f) => {
          if (!f) return false;
          if (f.vcodec === "none" || f.acodec === "none") return false;
          const ext = String(f.ext || "").toLowerCase();
          if (!ext) return false;
          return ext === "mp4" || ext === "webm";
        })
        .map((f) => {
          const height = typeof f.height === "number" ? f.height : undefined;
          const ext = String(f.ext || "mp4").toLowerCase();
          const sizeBytes = typeof f.filesize === "number" ? f.filesize : typeof f.filesize_approx === "number" ? f.filesize_approx : undefined;

          const label =
            height ? `${height}p (${ext.toUpperCase()})` : f.format_note ? String(f.format_note) : `Video (${ext.toUpperCase()})`;

          return {
            label,
            formatId: String(f.format_id),
            ext,
            size: formatBytes(sizeBytes),
            height: height || 0,
          };
        })
        .sort((a, b) => (b.height || 0) - (a.height || 0));

      if (!progressive.length) {
        return res.status(500).json({
          error:
            "Could not find a downloadable format for this link. (This can happen if the video requires login or the platform is blocking extraction.)",
        });
      }

      res.json({
        title,
        thumbnail: thumbnail || "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000",
        duration: durationSec ? new Date(durationSec * 1000).toISOString().substring(14, 19) : undefined,
        platform,
        qualities: progressive.map(({ label, formatId, ext, size }) => ({ label, formatId, ext, size })),
      });
    } catch (error) {
      console.error("Metadata error:", error);
      res.status(500).json({ error: "Failed to fetch video metadata" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const mode = process.env.NODE_ENV || "development";
    const env = loadEnv(mode, process.cwd(), "");

    const vite = await createViteServer({
      configFile: false,
      plugins: [react(), tailwindcss()],
      define: {
        "process.env.GEMINI_API_KEY": JSON.stringify(env.GEMINI_API_KEY),
      },
      resolve: {
        alias: {
          "@": process.cwd(),
        },
      },
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
