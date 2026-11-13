import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { load } from 'cheerio';
import { sourceFiles, pageUrl } from './routes.mjs';

const output = 'dist/client';
const files = await sourceFiles();
const urls = ['/', ...files.map(pageUrl)];
const pages = new Map();
for (const url of urls) {
  const candidates = url === '/' ? ['/index.html'] : [`${url}/index.html`, `${url}.html`];
  let html;
  for (const path of candidates) {
    try {
      html = await readFile(`${output}${path}`, 'utf8');
      break;
    } catch {
      /* try the other static layout */
    }
  }
  assert.ok(html, `No prerendered HTML for ${url}`);
  const $ = load(html);
  assert.ok($('h1').length, `Missing rendered heading: ${url}`);
  assert.ok($('title').text().includes('bVault-js'), `Missing metadata: ${url}`);
  assert.ok($('meta[name="description"]').attr('content'), `Missing description: ${url}`);
  assert.equal($('html').attr('lang'), 'en');
  assert.ok(!html.includes('Fumadocs on TanStack Start'), `Template metadata remains: ${url}`);
  pages.set(url, $);
}
const redirects = new Map(
  (await readFile('public/_redirects', 'utf8'))
    .trim()
    .split('\n')
    .map((line) => line.trim().split(/\s+/)),
);
for (const [from, target] of redirects)
  assert.ok(pages.has(target), `Invalid redirect ${from} → ${target}`);
for (const [url, $] of pages) {
  for (const element of $('a[href], img[src], link[rel="stylesheet"]')) {
    const href = $(element).attr('href') ?? $(element).attr('src');
    if (!href || /^(https?:|mailto:|data:|javascript:)/.test(href)) continue;
    const resolved = new URL(href, `https://local.invalid${url}`);
    let path = resolved.pathname.replace(/\/$/, '') || '/';
    if (redirects.has(path)) path = redirects.get(path);
    if (pages.has(path)) {
      if (resolved.hash) {
        const id = decodeURIComponent(resolved.hash.slice(1));
        assert.ok(
          pages
            .get(path)('[id]')
            .toArray()
            .some((el) => el.attribs.id === id),
          `Broken anchor ${url} → ${href}`,
        );
      }
    } else {
      assert.ok(
        await stat(`${output}${resolved.pathname}`).catch(() => null),
        `Broken asset/link ${url} → ${href}`,
      );
    }
  }
}
const search = await readFile(`${output}/api/search`, 'utf8').catch(() =>
  readFile(`${output}/api/search/index.html`, 'utf8'),
);
assert.doesNotThrow(() => JSON.parse(search), 'Search must export a static JSON index');
assert.ok(
  search.includes('initializ') || search.includes('Initializ'),
  'Search must include real documentation',
);
assert.ok((await readFile('vercel.json', 'utf8')).includes('"deploymentEnabled": false'));
console.log(
  `Validated ${urls.length} rendered pages, metadata, internal links/anchors/assets, redirects, search index, and Vercel disable config.`,
);
