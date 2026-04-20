// Copyright (c) Jonas Immanuel Frey. All rights reserved.
// Licensed under the terms specified by Jonas Immanuel Frey.

const PORT = 8002;

async function handler(req: Request): Promise<Response> {
  const url = new URL(req.url);
  let path = url.pathname;

  if (path === "/") {
    path = "/index.html";
  }

  const filePath = `./static${path}`;

  try {
    const file = await Deno.readFile(filePath);
    const contentType = getContentType(filePath);
    return new Response(file, {
      headers: { "content-type": contentType },
    });
  } catch {
    return new Response("Not Found", { status: 404 });
  }
}

function getContentType(path: string): string {
  const ext = path.split(".").pop()?.toLowerCase();
  const types: Record<string, string> = {
    html: "text/html; charset=utf-8",
    css: "text/css; charset=utf-8",
    js: "application/javascript; charset=utf-8",
    json: "application/json",
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    svg: "image/svg+xml",
    ico: "image/x-icon",
    webp: "image/webp",
    mp4: "video/mp4",
    webm: "video/webm",
    gif: "image/gif",
    stl: "application/octet-stream",
    glb: "model/gltf-binary",
    gltf: "model/gltf+json",
    woff2: "font/woff2",
    woff: "font/woff",
  };
  return types[ext || ""] || "application/octet-stream";
}

console.log(
  `\n  Copyright (c) Jonas Immanuel Frey. All rights reserved.\n`
);
console.log(`  bergform.ch / bergzwerg.ch — server running at http://localhost:${PORT}`);
console.log(`  Content is selected dynamically from the request's Host header / window.location.hostname.\n`);

Deno.serve({ port: PORT }, handler);
