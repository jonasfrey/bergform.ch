/**
 * bergform.ch — Deno web server
 * © Jonas Immanuel Frey. All rights reserved.
 */

const PORT = 8002;

const MIME_TYPES: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json",
  ".gif": "image/gif",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".ico": "image/x-icon",
};

function getMimeType(path: string): string {
  const ext = path.substring(path.lastIndexOf("."));
  return MIME_TYPES[ext] ?? "application/octet-stream";
}

Deno.serve({ port: PORT }, async (req: Request): Promise<Response> => {
  const url = new URL(req.url);
  let path = url.pathname === "/" ? "/index.html" : url.pathname;

  // Prevent directory traversal
  path = path.replaceAll("..", "");

  try {
    const file = await Deno.open(`.${path}`, { read: true });
    return new Response(file.readable, {
      headers: { "Content-Type": getMimeType(path) },
    });
  } catch {
    return new Response("Not Found", { status: 404 });
  }
});

console.log(`bergform.ch running at http://localhost:${PORT}`);
