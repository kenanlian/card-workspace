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
      description: 'A card-based workspace plugin for Obsidian.',
      // Zed-inspired custom theme (see src/styles/theme.css).
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
          label: 'Guides',
          translations: { 'zh-CN': '指南' },
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
              label: 'Getting Started',
              translations: { 'zh-CN': '快速开始' },
              slug: 'guides/getting-started',
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
          ],
        },
      ],
    }),
  ],
});
