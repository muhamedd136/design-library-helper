#!/usr/bin/env node
/**
 * Zero-dependency static server for the design library.
 * Re-runs the resources sync on every request for data/styles.js, so dropping
 * a new screenshot into /resources and hitting refresh is enough.
 *
 *   node scripts/serve.mjs [port]
 */
import { createServer } from 'node:http';
import { createReadStream, existsSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, extname, normalize } from 'node:path';
import { sync } from './sync.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const PORT = Number(process.argv[2] || process.env.PORT || 4321);

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png',
  '.webp': 'image/webp', '.gif': 'image/gif', '.avif': 'image/avif',
  '.svg': 'image/svg+xml', '.ico': 'image/x-icon',
};

createServer((req, res) => {
  let pathname = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (pathname === '/') pathname = '/index.html';

  if (pathname === '/data/styles.js') {
    try {
      const r = sync({ quiet: true });
      if (r.added.length) console.log(`[sync] +${r.added.length} new image(s) -> drafts`);
    } catch (err) {
      console.error('[sync] failed:', err.message);
    }
  }

  const filePath = join(ROOT, normalize(pathname).replace(/^(\.\.[/\\])+/, ''));
  if (!filePath.startsWith(ROOT) || !existsSync(filePath) || statSync(filePath).isDirectory()) {
    res.writeHead(404, { 'content-type': 'text/plain' });
    return res.end('404');
  }

  res.writeHead(200, {
    'content-type': MIME[extname(filePath).toLowerCase()] || 'application/octet-stream',
    'cache-control': 'no-cache',
  });
  createReadStream(filePath).pipe(res);
}).listen(PORT, () => {
  sync({ quiet: true });
  console.log(`\n  Design Style Library  ->  http://localhost:${PORT}\n`);
});
