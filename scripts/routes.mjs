import { glob } from 'node:fs/promises';
export async function sourceFiles() {
  const files = [];
  for await (const file of glob('**/*.{md,mdx}', { cwd: 'content/docs' })) files.push(file);
  return files.sort();
}
export function pageUrl(file) {
  return `/docs/${file.replace(/\.mdx?$/, '').replace(/(^|\/)index$/, '')}`.replace(/\/$/, '');
}
