# bVault-js documentation

Documentation for [bvault-js](https://github.com/OSSAfrica/bvault-js), built with Fumadocs, TanStack Start, React, and MDX. The production build is prerendered static HTML for **Cloudflare Pages**; search runs in the browser from an exported index. No server runtime is needed in production.

## Development

Use Node 24 (`nvm use`) and npm. The committed lockfile is authoritative.

```bash
npm ci
npm run dev
```

The dev server listens on http://localhost:3000. Run `npm run build`, then `npm run preview` to test the real static output with Cloudflare Pages locally at http://localhost:4173.

```bash
npx playwright install chromium
npm run ci
```

CI runs formatting, a production build (which generates route types), typechecking, rendered-page/link/asset checks, and desktop/mobile Chromium smoke tests including search, redirects, and 404s. `npm run format` applies formatting. CodeQL uses GitHub's default setup; do not add a duplicate advanced CodeQL workflow. Security and dependency-review workflows follow the library repo. `Docs CI`, the DCO App, and `Security Hardening` must pass before merging. Signed commits and one PR approval are required, with DCO sign-off enforced by the same GitHub App used for the library.

## Writing docs

- Pages live in `content/docs`; `meta.json` controls section order.
- The filename determines the URL. `index.mdx` is its folder's landing page.
- Use `title` and `description` frontmatter. Fumadocs MDX components come from `src/components/mdx.tsx`; Docusaurus `:::` syntax is no longer supported.
- Keep runnable examples aligned with a published version. Stable docs target 0.3.4; `content/docs/next` is explicitly upcoming 1.0. Do not present branch-only exports as npm latest.
- Content changes automatically rebuild the search index. Update `public/_redirects` whenever a published URL changes. `scripts/check-content.mjs` checks rendered internal links/anchors and assets.
- Static assets live in `public`. Existing logos and social images retain `/img/...` URLs.

## Cloudflare Pages

Create or connect the **OSSAfrica/bvault-js-docs** repository in Cloudflare Pages with:

| Setting           | Value           |
| ----------------- | --------------- |
| Framework preset  | None            |
| Production branch | `main`          |
| Build command     | `npm run build` |
| Output directory  | `dist/client`   |
| Node version      | `24`            |

Enable preview builds for contribution branches according to the organization's fork policy. CI can run without Cloudflare credentials. This repository does not automatically deploy from GitHub Actions or ship a server bundle to Pages.

Set `VITE_SITE_URL` to the confirmed HTTPS production origin before launch. It supplies canonical metadata and the sitemap. Builds without it are intentionally unindexed; previews are blocked through Pages headers and branch-aware robots. Never put secrets in a `VITE_` variable.

For an existing direct-upload project, `npm run deploy` builds and uploads through Wrangler to `bvault-js-docs`; confirm that project belongs to the intended account before running it. Git-integrated Pages projects should use their configured Git deployment path instead.

Before cutover, check homepage, all deep links, search, mobile navigation, redirects, and missing-page status on a Pages preview. Record a known-good deployment; use Pages' deployment rollback if a production release fails. Keep the old Vercel deployment available until hostname redirects are ready. The maintainer is handling Vercel's dashboard switch; `vercel.json` also disables future automatic Git deployments once present on a branch. The Docusaurus PostHog plugin was removed; analytics are deliberately disabled until a separate reviewed configuration is supplied.

See the [migration tracker](https://github.com/OSSAfrica/bvault-js-docs/issues/2) and [Cloudflare Pages deployment issue](https://github.com/OSSAfrica/bvault-js-docs/issues/11) for launch ownership and remaining work.

## Contributing

Follow the [organization contribution guide](https://github.com/OSSAfrica/.github/blob/main/CONTRIBUTING.md) and [Code of Conduct](https://github.com/OSSAfrica/.github/blob/main/CODE_OF_CONDUCT.md). Include DCO sign-off (`git commit -s`, see [DCO.md](DCO.md)) and a valid commit signature, use a conventional commit title, and open a PR with the checks above. Use the documentation issue form for content errors; follow the organization security policy for private vulnerability reports.
