// Tiny static server for dist/ with clean URLs (/story -> dist/story/index.html).
// Usage: node server.mjs [port]   (PORT env var also honoured)
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), 'dist');
const port = Number(process.argv[2] || process.env.PORT || 3000);

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
};

async function resolveFile(pathname) {
  const clean = normalize(decodeURIComponent(pathname)).replace(/^(\.\.[/\\])+/, '');
  const candidates = [clean, join(clean, 'index.html'), `${clean}.html`];
  for (const rel of candidates) {
    const file = resolve(root, '.' + sep + rel);
    if (!file.startsWith(root)) continue;
    try {
      if ((await stat(file)).isFile()) return file;
    } catch {
      /* try next */
    }
  }
  return null;
}

createServer(async (req, res) => {
  try {
    const { pathname } = new URL(req.url, 'http://localhost');
    const file = await resolveFile(pathname);
    if (!file) {
      const notFound = await readFile(join(root, '404.html'));
      res.writeHead(404, { 'Content-Type': TYPES['.html'] }).end(notFound);
      return;
    }
    const body = await readFile(file);
    res.writeHead(200, { 'Content-Type': TYPES[extname(file)] || 'application/octet-stream' }).end(body);
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'text/plain' }).end('Server error');
    console.error(err);
  }
}).listen(port, () => console.log(`Serving dist/ at http://localhost:${port}`));
