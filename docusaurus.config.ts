import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import 'dotenv/config';

console.log({ POSTHOG_API_KEY: process.env.POSTHOG_API_KEY });


// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
    title: 'bVault-js',
    tagline: 'Secure Frontend Encryption Library',
    favicon: 'img/logo.svg',

    themes: ['@docusaurus/theme-mermaid'],
    plugins: [
        [
            "posthog-docusaurus", {
                apiKey: process.env.POSTHOG_API_KEY || "DEV",
                appUrl: "https://app.posthog.com", // optional
                enableInDevelopment: true, // optional
            },
        ],
    ],
    markdown: {
        mermaid: true,
    },

    // Future flags
    future: {
        v4: true,
    },
    onBrokenLinks: 'ignore',

    // Production URL of your site
    url: 'https://bvault-js.vercel.app',
    // Base URL (if hosted on GitHub pages, it’s usually /<projectName>/)
    baseUrl: '/',

    // GitHub pages deployment config.
    organizationName: 'kurtiz', // Your GitHub username/org
    projectName: 'bvault-js',   // Repo name

    onBrokenMarkdownLinks: 'warn',
    /*

        i18n: {
            defaultLocale: 'en',
            locales: ['en'],
        },
    */

    presets: [
        [
            'classic',
            {
                docs: {
                    sidebarPath: './sidebars.ts',
                    editUrl: 'https://github.com/kurtiz/bvault-js-docs/edit/main/',
                },
                /* blog: {
                     showReadingTime: true,
                     feedOptions: {
                         type: ['rss', 'atom'],
                         xslt: true,
                     },
                     editUrl: 'https://github.com/kurtiz/bvault-js-docs/edit/main/blog/',
                     onInlineTags: 'warn',
                     onInlineAuthors: 'warn',
                     onUntruncatedBlogPosts: 'warn',
                 },*/
                theme: {
                    customCss: './src/css/custom.css',
                },
            } satisfies Preset.Options,
        ],
    ],

    themeConfig: {
        image: 'img/social-card.png', // add a social preview image if you want
        navbar: {
            title: 'bVault-js',
            logo: {
                alt: 'bVault-js Logo',
                src: 'img/logo.svg',
            },
            items: [
                {
                    type: 'docSidebar',
                    sidebarId: 'tutorialSidebar',
                    position: 'left',
                    label: 'Docs',
                },
                // {to: '/blog', label: 'Blog', position: 'left'},
                {
                    href: 'https://github.com/kurtiz/bvault-js',
                    label: 'GitHub',
                    position: 'right',
                },
                {
                    href: 'https://www.npmjs.com/package/bvault-js',
                    label: 'npm',
                    position: 'right',
                },
            ],
        },
        footer: {
            style: 'light',
            links: [
                {
                    title: 'Docs',
                    items: [
                        {
                            label: 'Getting Started',
                            to: '/docs/introduction',
                        },
                        {
                            label: 'API Reference',
                            to: '/docs',
                        },
                    ],
                },
                {
                    title: 'Community',
                    items: [
                        {
                            label: 'Issues',
                            href: 'https://github.com/kurtiz/bvault-js/issues',
                        },
                        {
                            label: 'Discussions',
                            href: 'https://github.com/kurtiz/bvault-js/discussions',
                        },
                    ],
                },
                {
                    title: 'More',
                    items: [
                        {
                            label: 'GitHub',
                            href: 'https://github.com/kurtiz/bvault-js',
                        },
                        {
                            label: 'npm',
                            href: 'https://www.npmjs.com/package/bvault-js',
                        },
                    ],
                },
            ],
            copyright: `Copyright © ${new Date().getFullYear()} <a href="https://github.com/kurtiz" style="font-weight: bold">Aaron Will Djaba </a>. Built with Docusaurus.`,
        },
        prism: {
            theme: prismThemes.github,
            darkTheme: prismThemes.dracula,
        },
    } satisfies Preset.ThemeConfig,
};

export default config;
