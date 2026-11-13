import react from '@vitejs/plugin-react';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { fumadocsMdx } from 'fumadocs-mdx/vite';
import { glob } from 'node:fs/promises';

const pages = [{ path: '/' }, { path: '/api/search' }];
for await (const file of glob('**/*.{md,mdx}', { cwd: 'content/docs' })) {
  const slug = file.replace(/\.mdx?$/, '').replace(/(^|\/)index$/, '');
  pages.push({ path: `/docs/${slug}`.replace(/\/$/, '') });
}

export default defineConfig({
  server: { port: 3000 },
  plugins: [
    fumadocsMdx(),
    tailwindcss(),
    tanstackStart({
      prerender: { enabled: true, crawlLinks: false, failOnError: true },
      pages,
    }),
    react(),
  ],
  resolve: { tsconfigPaths: true },
});
