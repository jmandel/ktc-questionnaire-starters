// Dev server: bundles index.html (React/TSX, HMR) and also serves the plain
// static files the site links to at runtime (view.html, fhir/*.json).
// Run: bun dev.ts   (or: bun run dev)
import index from "./index.html";

Bun.serve({
  port: 8000,
  development: true,
  routes: { "/": index },
  async fetch(req) {
    const path = decodeURIComponent(new URL(req.url).pathname.slice(1));
    if (!path.includes("..")) {
      const f = Bun.file(path);
      if (await f.exists()) return new Response(f);
    }
    return new Response("Not found", { status: 404 });
  },
});

console.log("dev server: http://localhost:8000");
