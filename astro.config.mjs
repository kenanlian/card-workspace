// @ts-check
import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import starlight from '@astrojs/starlight';
import remarkObsidianLinks from './src/remark-obsidian-links.mjs';

// NOTE: Replace `kenanlian` below with your actual GitHub username.
// For a GitHub *project* site the URL is:
//   https://kenanlian.github.io/card-workspace/
// so `base` must match the repository name.
const SITE = 'https://kenanlian.github.io';
const BASE = '/card-workspace';

export default defineConfig({
  site: SITE,
  base: BASE,
  markdown: {
    processor: unified({
      remarkPlugins: [[remarkObsidianLinks, { base: BASE }]],
    }),
  },
  integrations: [
    starlight({
      title: 'Card Workspace',
      description: 'Gather, organize, and reframe your Obsidian notes as a contextual card stream beside the editor.',
      // The docs header is the landing page's header. `Header` renders the
      // shared row — brand, version pill, and one row of tools — which replaces
      // Starlight's site title, social icons, and theme/language pickers, so
      // `MobileMenuFooter` has nothing left to repeat at the foot of the drawer.
      components: {
        Head: './src/components/Head.astro',
        Header: './src/components/Header.astro',
        MobileMenuFooter: './src/components/MobileMenuFooter.astro',
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
              label: 'Property filters',
              translations: { 'zh-CN': '属性筛选' },
              slug: 'guides/property-filters',
            },
            {
              label: 'Linked notes',
              translations: { 'zh-CN': '双链导航' },
              slug: 'guides/linked-notes',
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
        {
          label: 'Recent updates',
          translations: { 'zh-CN': '最近更新' },
          items: [
            { label: '1.3.4', slug: 'updates/1-3-4' },
            { label: '1.2.7–1.3.3', slug: 'updates/1-2-7-to-1-3-3' },
            { label: '1.2.2–1.2.6', slug: 'updates/1-2-2-to-1-2-6' },
            { label: '1.1.7–1.2.1', slug: 'updates/1-1-7-to-1-2-1' },
            { label: '1.1.2–1.1.6', slug: 'updates/1-1-2-to-1-1-6' },
            { label: '1.0.0–1.0.5', slug: 'updates/1-0-0-to-1-0-5' },
          ],
        },
      ],
    }),
  ],
});
