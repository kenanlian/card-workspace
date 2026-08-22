// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// NOTE: Replace `kenanlian` below with your actual GitHub username.
// For a GitHub *project* site the URL is:
//   https://kenanlian.github.io/card-workspace-site/
// so `base` must match the repository name.
const SITE = 'https://kenanlian.github.io';
const BASE = '/card-workspace-site';

export default defineConfig({
  site: SITE,
  base: BASE,
  integrations: [
    starlight({
      title: 'Card Workspace',
      description: 'Browse your vault as cards in Obsidian’s sidebar.',
      logo: {
        light: './src/assets/logo-light.svg',
        dark: './src/assets/logo-dark.svg',
      },
      components: {
        ThemeProvider: './src/components/LightFirstThemeProvider.astro',
        PageTitle: './src/components/PageTitle.astro',
        SkipLink: './src/components/SkipLink.astro',
      },
      // Starlight emits og:title/og:description/twitter:card itself; only the
      // image needs an absolute URL, which it cannot build on its own.
      head: [
        { tag: 'meta', attrs: { property: 'og:image', content: `${SITE}${BASE}/og.png` } },
        { tag: 'meta', attrs: { property: 'og:image:width', content: '1200' } },
        { tag: 'meta', attrs: { property: 'og:image:height', content: '630' } },
        { tag: 'meta', attrs: { name: 'twitter:image', content: `${SITE}${BASE}/og.png` } },
      ],
      // Light-first graphite theme shared by the landing page and docs.
      customCss: ['./src/styles/theme.css'],
      // English is the default (root) language; Chinese lives under /zh/.
      defaultLocale: 'en',
      locales: {
        en: { label: 'English', lang: 'en' },
        zh: { label: '简体中文', lang: 'zh-CN' },
      },
      social: [
        {
          icon: 'github',
          label: 'GitHub',
          href: 'https://github.com/kenanlian/obsidian-card-workspace',
        },
      ],
      sidebar: [
        {
          label: 'Getting started',
          translations: { 'zh-CN': '开始使用' },
          items: [
            {
              label: 'Introduction',
              translations: { 'zh-CN': '简介' },
              slug: 'guides/introduction',
            },
            {
              label: 'Installation',
              translations: { 'zh-CN': '安装' },
              slug: 'guides/installation',
            },
            {
              label: 'Getting started',
              translations: { 'zh-CN': '快速开始' },
              slug: 'guides/getting-started',
            },
          ],
        },
        {
          label: 'Using Card Workspace',
          translations: { 'zh-CN': '使用指南' },
          items: [
            {
              label: 'Navigation',
              translations: { 'zh-CN': '导航' },
              slug: 'guides/navigation',
            },
            {
              label: 'Card boxes',
              translations: { 'zh-CN': '卡片盒' },
              slug: 'guides/card-boxes',
            },
            {
              label: 'Browsing cards',
              translations: { 'zh-CN': '浏览卡片' },
              slug: 'guides/browsing-cards',
            },
            {
              label: 'Writing and organizing',
              translations: { 'zh-CN': '写作与整理' },
              slug: 'guides/writing-and-organizing',
            },
          ],
        },
        {
          label: 'Reference',
          translations: { 'zh-CN': '参考' },
          items: [
            {
              label: 'Settings',
              translations: { 'zh-CN': '设置' },
              slug: 'reference/settings',
            },
            {
              label: 'Commands and menus',
              translations: { 'zh-CN': '命令与菜单' },
              slug: 'reference/commands-and-menus',
            },
            {
              label: 'Limits and privacy',
              translations: { 'zh-CN': '限制与隐私' },
              slug: 'reference/limits-and-privacy',
            },
          ],
        },
      ],
    }),
  ],
});
