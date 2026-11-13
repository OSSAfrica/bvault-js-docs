import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { sourceFiles, pageUrl } from './routes.mjs';

const output = 'dist/client';
await mkdir(output, { recursive: true });
// A top-level 404 prevents Pages' implicit SPA fallback from returning 200 for unknown URLs.
await writeFile(
  `${output}/404.html`,
  `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Page not found | bVault-js</title></head><body><main><h1>Page not found</h1><p>This documentation page does not exist.</p><a href="/docs/introduction">Open the documentation</a></main></body></html>`,
);
const hostname = process.env.VITE_SITE_URL?.replace(/\/$/, '');
if (hostname) {
  const url = new URL(hostname);
  if (url.protocol !== 'https:')
    throw new Error('VITE_SITE_URL must be an HTTPS production origin');
  if (url.pathname !== '/' || url.search || url.hash)
    throw new Error('VITE_SITE_URL must be an origin');
  const paths = ['/', ...(await sourceFiles()).map(pageUrl)];
  const xml = paths.map((path) => `<url><loc>${hostname}${path}</loc></url>`).join('');
  await writeFile(
    `${output}/sitemap.xml`,
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${xml}</urlset>`,
  );
}
// Preview hosts stay unindexed even when a production canonical origin is supplied.
const preview = process.env.CF_PAGES_BRANCH && process.env.CF_PAGES_BRANCH !== 'main';
await writeFile(
  `${output}/robots.txt`,
  preview || !hostname
    ? 'User-agent: *\nDisallow: /\n'
    : `User-agent: *\nAllow: /\nSitemap: ${hostname}/sitemap.xml\n`,
);
// A retained server bundle is a build artifact; Pages deploys only dist/client.
const redirects = await readFile('public/_redirects', 'utf8');
await writeFile(`${output}/_redirects`, redirects);
console.log('Prepared Cloudflare Pages static assets, 404, redirects, and indexing policy.');
