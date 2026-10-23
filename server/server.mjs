// ─────────────────────────────────────────────────────────────
//  baxromjonov.uz — yengil production server (faqat Node o'rnatilgan modullar)
//  • dist/ ichidagi saytni beradi (gzip/brotli, kesh, xavfsizlik headerlari)
//  • POST /api/send-telegram — formani Telegram botga yuboradi
//  • GET  /healthz — Docker healthcheck uchun
// ─────────────────────────────────────────────────────────────
import http from "node:http";
import fs from "node:fs";
import fsp from "node:fs/promises";
import path from "node:path";
import zlib from "node:zlib";
import { fileURLToPath } from "node:url";
import { buildMessage, sendToTelegram, tashkentTime } from "./telegram.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(process.env.DIST_DIR || path.join(__dirname, "..", "dist"));
const PORT = Number(process.env.PORT || 3000);
const HOST = process.env.HOST || "0.0.0.0";
const VERSION = process.env.APP_VERSION || "2.0.0";
const TOKEN = process.env.TELEGRAM_BOT_TOKEN || "";
const CHAT_ID = process.env.TELEGRAM_CHAT_ID || "";

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".otf": "font/otf",
};
const COMPRESSIBLE = new Set([".html", ".js", ".mjs", ".css", ".json", ".xml", ".txt", ".svg"]);

const CSP = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self' data:",
  "img-src 'self' data: blob:",
  "media-src 'self'",
  "connect-src 'self' https:",
  "frame-src 'self'",
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join("; ");

// O'quvchi loyihalari (iframe ichida) tashqi CDN ishlatishi mumkin — ularga yumshoqroq siyosat.
const CSP_STUDENT = "frame-ancestors 'self'; object-src 'none'; base-uri 'self'";

function baseHeaders(extra = {}, csp = CSP) {
  return {
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "X-Frame-Options": "SAMEORIGIN",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
    "Content-Security-Policy": csp,
    "X-Portfolio": `v${VERSION}`,
    ...extra,
  };
}

// ── Kichik xotira keshi (siqilgan fayllar) ──
const cache = new Map();
const CACHE_LIMIT = 300 * 1024; // 300 KB dan katta fayllar oqim bilan beriladi

async function readCompressed(file, stat, encoding) {
  const key = `${file}:${stat.mtimeMs}:${encoding}`;
  if (cache.has(key)) return cache.get(key);
  const raw = await fsp.readFile(file);
  const buf =
    encoding === "br"
      ? zlib.brotliCompressSync(raw, { params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 9 } })
      : encoding === "gzip"
      ? zlib.gzipSync(raw, { level: 9 })
      : raw;
  if (cache.size > 400) cache.clear();
  cache.set(key, buf);
  return buf;
}

function pickEncoding(req, ext) {
  if (!COMPRESSIBLE.has(ext)) return "identity";
  const ae = String(req.headers["accept-encoding"] || "");
  if (/\bbr\b/.test(ae)) return "br";
  if (/\bgzip\b/.test(ae)) return "gzip";
  return "identity";
}

async function resolveFile(urlPath) {
  let p;
  try {
    p = decodeURIComponent(urlPath.split("?")[0]);
  } catch {
    return null;
  }
  if (p.includes("\0")) return null;
  let file = path.normalize(path.join(ROOT, p));
  if (!file.startsWith(ROOT)) return null; // path traversal himoyasi
  try {
    let st = await fsp.stat(file);
    if (st.isDirectory()) {
      file = path.join(file, "index.html");
      st = await fsp.stat(file);
    }
    return { file, stat: st };
  } catch {
    return null;
  }
}

async function serveStatic(req, res) {
  const url = req.url || "/";
  let hit = await resolveFile(url);
  let isFallback = false;
  if (!hit) {
    // Fayl kengaytmasi bo'lsa — haqiqiy 404; aks holda SPA index.html
    if (path.extname(url.split("?")[0])) {
      res.writeHead(404, baseHeaders({ "Content-Type": "text/plain; charset=utf-8" }));
      return res.end("404 — topilmadi");
    }
    hit = await resolveFile("/index.html");
    isFallback = true;
    if (!hit) {
      res.writeHead(500, baseHeaders({ "Content-Type": "text/plain; charset=utf-8" }));
      return res.end("dist topilmadi. Avval: npm run build");
    }
  }

  const { file, stat } = hit;
  const ext = path.extname(file).toLowerCase();
  const type = MIME[ext] || "application/octet-stream";
  const rel = path.relative(ROOT, file).split(path.sep).join("/");
  const immutable = rel.startsWith("assets/");
  const cacheControl = ext === ".html" ? "no-cache" : immutable ? "public, max-age=31536000, immutable" : "public, max-age=86400";
  const etag = `W/"${stat.size.toString(16)}-${Math.floor(stat.mtimeMs).toString(16)}"`;

  if (req.headers["if-none-match"] === etag) {
    res.writeHead(304, baseHeaders({ ETag: etag, "Cache-Control": cacheControl }));
    return res.end();
  }

  const headers = baseHeaders(
    {
      "Content-Type": type,
      "Cache-Control": cacheControl,
      ETag: etag,
      Vary: "Accept-Encoding",
    },
    rel.startsWith("student-projects/") ? CSP_STUDENT : CSP
  );
  if (isFallback) headers["X-Robots-Tag"] = "noindex";

  // Video uchun Range so'rovlari (o'quvchi loyihalaridagi mp4)
  const range = req.headers.range;
  if (range && (ext === ".mp4" || ext === ".webm")) {
    const m = /bytes=(\d*)-(\d*)/.exec(range);
    if (m) {
      const start = m[1] ? Number(m[1]) : 0;
      const end = m[2] ? Math.min(Number(m[2]), stat.size - 1) : stat.size - 1;
      if (start <= end && start < stat.size) {
        res.writeHead(206, { ...headers, "Content-Range": `bytes ${start}-${end}/${stat.size}`, "Accept-Ranges": "bytes", "Content-Length": end - start + 1 });
        if (req.method === "HEAD") return res.end();
        return fs.createReadStream(file, { start, end }).pipe(res);
      }
    }
  }

  const encoding = pickEncoding(req, ext);
  if (stat.size <= CACHE_LIMIT || encoding !== "identity") {
    const body = stat.size <= CACHE_LIMIT * 8 ? await readCompressed(file, stat, encoding) : null;
    if (body) {
      if (encoding !== "identity") headers["Content-Encoding"] = encoding;
      headers["Content-Length"] = body.length;
      res.writeHead(200, headers);
      return res.end(req.method === "HEAD" ? undefined : body);
    }
  }
  headers["Content-Length"] = stat.size;
  headers["Accept-Ranges"] = "bytes";
  res.writeHead(200, headers);
  if (req.method === "HEAD") return res.end();
  fs.createReadStream(file).pipe(res);
}

// ── Oddiy rate limit: 1 IP dan 10 daqiqada 5 ta yuborish ──
const hits = new Map();
function limited(ip) {
  const now = Date.now();
  const win = 10 * 60 * 1000;
  const arr = (hits.get(ip) || []).filter((t) => now - t < win);
  arr.push(now);
  hits.set(ip, arr);
  if (hits.size > 5000) hits.clear();
  return arr.length > 5;
}

function clientIp(req) {
  return String(
    req.headers["cf-connecting-ip"] || String(req.headers["x-forwarded-for"] || "").split(",")[0] || req.socket.remoteAddress || "noma’lum"
  ).trim();
}

function json(res, status, data) {
  res.writeHead(status, baseHeaders({ "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" }));
  res.end(JSON.stringify(data));
}

async function readBody(req, limit = 20 * 1024) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on("data", (c) => {
      size += c.length;
      if (size > limit) {
        reject(Object.assign(new Error("too large"), { status: 413 }));
        req.destroy();
        return;
      }
      chunks.push(c);
    });
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

async function handleTelegram(req, res) {
  if (req.method !== "POST") return json(res, 405, { ok: false, message: "Faqat POST." });
  if (!String(req.headers["content-type"] || "").includes("application/json")) {
    return json(res, 415, { ok: false, message: "JSON kutilgan." });
  }
  const ip = clientIp(req);
  if (limited(ip)) return json(res, 429, { ok: false, message: "Juda ko‘p urinish. 10 daqiqadan keyin qayta yuboring." });
  if (!TOKEN || !CHAT_ID) {
    return json(res, 503, { ok: false, message: "Forma hali sozlanmagan. Iltimos, Telegram orqali yozing: @asadbek_baxromjonov" });
  }
  let data;
  try {
    data = JSON.parse(await readBody(req));
  } catch (e) {
    return json(res, e.status || 400, { ok: false, message: "Noto‘g‘ri so‘rov." });
  }
  const msg = buildMessage(data || {}, {
    ip,
    country: req.headers["cf-ipcountry"] || "—",
    ua: req.headers["user-agent"] || "—",
    time: tashkentTime(),
  });
  if (msg.spam) return json(res, 200, { ok: true });
  if (msg.error) return json(res, 400, { ok: false, message: msg.error });
  try {
    await sendToTelegram(msg.text, { token: TOKEN, chatId: CHAT_ID });
    return json(res, 200, { ok: true });
  } catch (e) {
    console.error("[telegram]", e.message);
    return json(res, 502, { ok: false, message: "Telegramga yuborilmadi. Birozdan keyin urinib ko‘ring." });
  }
}

const server = http.createServer(async (req, res) => {
  try {
    const url = req.url || "/";
    if (url === "/healthz") return json(res, 200, { ok: true, version: VERSION });
    if (url.startsWith("/api/send-telegram")) return await handleTelegram(req, res);
    if (url.startsWith("/api/")) return json(res, 404, { ok: false, message: "Topilmadi." });
    if (req.method !== "GET" && req.method !== "HEAD") {
      res.writeHead(405, baseHeaders({ Allow: "GET, HEAD" }));
      return res.end();
    }
    return await serveStatic(req, res);
  } catch (e) {
    console.error("[server]", e);
    if (!res.headersSent) json(res, 500, { ok: false, message: "Server xatosi." });
    else res.end();
  }
});

server.keepAliveTimeout = 65000;
server.listen(PORT, HOST, () => {
  console.log(`baxromjonov.uz v${VERSION} → http://${HOST}:${PORT}  (dist: ${ROOT})`);
  if (!TOKEN || !CHAT_ID) console.warn("⚠ TELEGRAM_BOT_TOKEN yoki TELEGRAM_CHAT_ID yo‘q — forma ishlamaydi.");
});

const stop = () => server.close(() => process.exit(0));
process.on("SIGTERM", stop);
process.on("SIGINT", stop);
