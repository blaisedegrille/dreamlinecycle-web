import fs from "node:fs";
import path from "node:path";
import { createServer } from "node:http";

const root = path.resolve(process.cwd(), "out");
const contentTypes = {
  ".avif": "image/avif",
  ".css": "text/css; charset=utf-8",
  ".gif": "image/gif",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".map": "application/json; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".otf": "font/otf",
  ".png": "image/png",
  ".rss": "application/rss+xml; charset=utf-8",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".ttf": "font/ttf",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".xml": "application/xml; charset=utf-8",
};

function isInsideRoot(filePath) {
  return filePath === root || filePath.startsWith(`${root}${path.sep}`);
}

function sendFile(request, response, filePath, statusCode = 200) {
  const extension = path.extname(filePath).toLowerCase();
  const headers = {
    "Content-Type": contentTypes[extension] ?? "application/octet-stream",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "strict-origin-when-cross-origin",
  };

  if (filePath.includes(`${path.sep}_next${path.sep}static${path.sep}`) ||
      filePath.includes(`${path.sep}generated${path.sep}`)) {
    headers["Cache-Control"] = "public, max-age=31536000, immutable";
  } else {
    headers["Cache-Control"] = "no-cache";
  }

  response.writeHead(statusCode, headers);
  if (request.method === "HEAD") {
    response.end();
    return;
  }
  fs.createReadStream(filePath).pipe(response);
}

const server = createServer((request, response) => {
  if (request.method !== "GET" && request.method !== "HEAD") {
    response.writeHead(405, { Allow: "GET, HEAD" });
    response.end("Method not allowed");
    return;
  }

  let pathname;
  try {
    pathname = decodeURIComponent(new URL(request.url ?? "/", "http://localhost").pathname);
  } catch {
    response.writeHead(400);
    response.end("Bad request");
    return;
  }

  const requestedPath = path.resolve(root, `.${pathname}`);
  if (!isInsideRoot(requestedPath)) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  let filePath = requestedPath;
  try {
    if (fs.statSync(filePath).isDirectory()) {
      if (!pathname.endsWith("/")) {
        response.writeHead(308, { Location: `${pathname}/${new URL(request.url, "http://localhost").search}` });
        response.end();
        return;
      }
      filePath = path.join(filePath, "index.html");
    } else if (!fs.existsSync(filePath) && fs.existsSync(`${filePath}.html`)) {
      filePath = `${filePath}.html`;
    }

    if (!isInsideRoot(filePath) || !fs.statSync(filePath).isFile()) {
      throw new Error("not a file");
    }
  } catch {
    const notFound = path.join(root, "404.html");
    if (fs.existsSync(notFound)) {
      sendFile(request, response, notFound, 404);
    } else {
      response.writeHead(404);
      response.end("Not found");
    }
    return;
  }

  sendFile(request, response, filePath);
});

const args = process.argv.slice(2);
const portIndex = args.indexOf("--port");
const port = Number(portIndex >= 0 ? args[portIndex + 1] : process.env.PORT ?? 3000);
const host = process.env.HOST ?? "127.0.0.1";

if (!fs.existsSync(path.join(root, "index.html"))) {
  console.error("Static export not found. Run `npm run build` first.");
  process.exit(1);
}

server.listen(port, host, () => {
  console.log(`Serving ${path.relative(process.cwd(), root)} at http://${host}:${port}`);
});

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => server.close(() => process.exit(0)));
}
