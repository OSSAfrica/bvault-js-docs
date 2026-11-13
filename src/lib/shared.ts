export const appName = 'bVault-js';
export const gitConfig = { user: 'OSSAfrica', repo: 'bvault-js-docs', branch: 'main' };
export const siteUrl = import.meta.env.VITE_SITE_URL?.replace(/\/$/, '');

export function pageHead(title: string, description: string, path: string) {
  return {
    meta: [
      { title: `${title} | bVault-js` },
      { name: 'description', content: description },
      { property: 'og:title', content: `${title} | bVault-js` },
      { property: 'og:description', content: description },
      { property: 'og:type', content: 'website' },
      ...(siteUrl ? [{ property: 'og:image', content: `${siteUrl}/img/social-card.png` }] : []),
    ],
    links: siteUrl ? [{ rel: 'canonical', href: `${siteUrl}${path}` }] : [],
  };
}
