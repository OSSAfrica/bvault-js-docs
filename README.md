# bVault-js documentation

Documentation for [bvault-js](https://github.com/OSSAfrica/bvault-js), built with Fumadocs, TanStack Start, React, and MDX. The production build is prerendered static HTML for **Cloudflare Pages**; search runs in the browser from an exported index. No server runtime is needed in production.

## Development

Use **Bun 1.4.4** for dependency installation and project scripts. The committed `bun.lock` is authoritative. Keep Node 24 available (`nvm use`) for the Vite, Playwright, and Wrangler command-line tools.

```bash
bun install --frozen-lockfile
bun run dev:open
```

`dev:open` starts the dev server and opens the docs at **http://localhost:3000/docs/introduction**. To start without opening a browser, use `bun run dev` (or `bun start`) and visit the same URL. Stop the server with Ctrl+C.

To build and view the production output in the local Cloudflare Pages runtime:

```bash
bun run preview:build
```

Open **http://localhost:4173/docs/introduction**. If you already built the site with `bun run build`, use `bun run preview` to serve that output without rebuilding. The homepage is available at `/` on either server.

| Command                 | Purpose                                                    |
| ----------------------- | ---------------------------------------------------------- |
| `bun run dev`           | Live-reloading dev server on port 3000                     |
| `bun run dev:open`      | Dev server and open the docs in your browser               |
| `bun run build`         | Prerender production assets into `dist/client`             |
| `bun run preview`       | Serve an existing build with Cloudflare Pages on port 4173 |
| `bun run preview:build` | Build and start the Pages preview                          |
| `bun run ci`            | Run formatting, build, types, content, and browser checks  |

For browser checks, install Chromium once:

```bash
bunx playwright install chromium
bun run ci
```

CI runs formatting, a production build (which generates route types), typechecking, rendered-page/link/asset checks, and desktop/mobile Chromium smoke tests including search, redirects, and 404s. `bun run format` applies formatting. CodeQL uses GitHub's default setup; do not add a duplicate advanced CodeQL workflow. Security and dependency-review workflows follow the library repo. `Docs CI`, the DCO App, and `Security Hardening` must pass before merging. Signed commits and one PR approval are required, with DCO sign-off enforced by the same GitHub App used for the library.

## Writing docs

- Pages live in `content/docs`; `meta.json` controls section order.
- The filename determines the URL. `index.mdx` is its folder's landing page.
- Use `title` and `description` frontmatter. Fumadocs MDX components come from `src/components/mdx.tsx`; Docusaurus `:::` syntax is no longer supported.
- Keep runnable examples aligned with a published version. Stable docs target 0.3.4; `content/docs/next` documents the published 1.0.0-preview.0 prerelease installed with `bvault-js@preview`. Keep preview and stable APIs distinct, and verify the registry tags and published artifact before updating their status. `content/docs/next/development.mdx` records changes merged for staged preview.1; do not move those guarantees or install pins into published-version docs until npm approval and registry publication are verified.
- Content changes automatically rebuild the search index. Update `public/_redirects` whenever a published URL changes. `scripts/check-content.mjs` checks rendered internal links/anchors and assets.
- Static assets live in `public`. Existing logos and social images retain `/img/...` URLs.

## Cloudflare Pages

Create or connect the **OSSAfrica/bvault-js-docs** repository in Cloudflare Pages with:

| Setting           | Value                   |
| ----------------- | ----------------------- |
| Framework preset  | None                    |
| Production branch | `main`                  |
| Build command     | `bun run build`         |
| Output directory  | `dist/client`           |
| Node version      | `24`                    |
| Bun version       | `1.4.4` (`BUN_VERSION`) |

Set `BUN_VERSION=1.4.4` in Pages build environment variables and use the committed Bun lockfile for dependency installation.

Enable preview builds for contribution branches according to the organization's fork policy. CI can run without Cloudflare credentials. This repository does not automatically deploy from GitHub Actions or ship a server bundle to Pages.

Set `VITE_SITE_URL` to the confirmed HTTPS production origin before launch. It supplies canonical metadata and the sitemap. Builds without it are intentionally unindexed; previews are blocked through Pages headers and branch-aware robots. Never put secrets in a `VITE_` variable.

For an existing direct-upload project, `bun run deploy` builds and uploads through Wrangler to `bvault-js-docs`; confirm that project belongs to the intended account before running it. Git-integrated Pages projects should use their configured Git deployment path instead.

Before cutover, check homepage, all deep links, search, mobile navigation, redirects, and missing-page status on a Pages preview. Record a known-good deployment; use Pages' deployment rollback if a production release fails. Keep the old Vercel deployment available until hostname redirects are ready. The maintainer is handling Vercel's dashboard switch; `vercel.json` also disables future automatic Git deployments once present on a branch. The Docusaurus PostHog plugin was removed; analytics are deliberately disabled until a separate reviewed configuration is supplied.

See the [migration tracker](https://github.com/OSSAfrica/bvault-js-docs/issues/2) and [Cloudflare Pages deployment issue](https://github.com/OSSAfrica/bvault-js-docs/issues/11) for launch ownership and remaining work.

## Contributing

Follow the [organization contribution guide](https://github.com/OSSAfrica/.github/blob/main/CONTRIBUTING.md) and [Code of Conduct](https://github.com/OSSAfrica/.github/blob/main/CODE_OF_CONDUCT.md). Include DCO sign-off (`git commit -s`, see [DCO.md](DCO.md)) and a valid commit signature, use a conventional commit title, and open a PR with the checks above. Use the documentation issue form for content errors; follow the organization security policy for private vulnerability reports.
