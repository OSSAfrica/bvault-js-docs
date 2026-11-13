import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <>
          <img src="/img/logo.svg" width="26" height="26" alt="" />
          bVault-js
        </>
      ),
    },
    githubUrl: 'https://github.com/OSSAfrica/bvault-js',
    links: [
      { text: 'Stable 0.3.4', url: '/docs/introduction', active: 'nested-url' },
      { text: '1.0 preview', url: '/docs/next' },
      { text: 'npm', url: 'https://www.npmjs.com/package/bvault-js', external: true },
    ],
  };
}
