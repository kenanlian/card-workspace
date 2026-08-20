# Card Workspace — Website

Documentation and marketing site for the **Card Workspace** Obsidian plugin.
Built with [Astro](https://astro.build/) + [Starlight](https://starlight.astro.build/),
bilingual (English / 简体中文), and deployed to GitHub Pages.

## Before you deploy

Replace `kenanlian` in these files with your real GitHub username:

- `astro.config.mjs` — `site`, `social` link
- `src/content/docs/**` — GitHub links and any absolute in-page links

The site is configured as a **project site**, served at:

```
https://kenanlian.github.io/card-workspace-site/
```

`base` in `astro.config.mjs` (`/card-workspace-site`) must always match your
repository name. If you rename the repo, update `base` accordingly.

## Develop

```bash
npm install
npm run dev
```

Open the printed local URL (paths live under `/card-workspace-site/`).

## Build

```bash
npm run build     # output in ./dist
npm run preview   # preview the production build
```

## Deploy (GitHub Pages)

1. Push this project to a GitHub repo named `card-workspace-site`.
2. In the repo: **Settings → Pages → Build and deployment → Source = GitHub Actions**.
3. Push to `main`. The workflow in `.github/workflows/deploy.yml` builds and publishes automatically.

## Content structure

```
src/content/docs/
├── en/                              # English
│   ├── index.mdx                    # splash; imports <Landing locale="en" />
│   ├── guides/
│   │   ├── introduction.md
│   │   ├── installation.md
│   │   ├── getting-started.md
│   │   ├── navigation.md
│   │   ├── card-boxes.md
│   │   ├── browsing-cards.md
│   │   └── writing-and-organizing.md
│   └── reference/
│       ├── settings.md
│       ├── commands-and-menus.md
│       └── limits-and-privacy.md
└── zh/                              # 简体中文 (mirrors the English structure)
    ├── index.mdx
    ├── guides/
    └── reference/
```

Splash landing components live in `src/components/landing/`. V2 Graphite Index tokens and Starlight chrome live in `src/styles/`. Guide pages include `guides/card-boxes`. `designs/` is a prototype tree and is not deployed.

Navigation labels and translations live in the `sidebar` config in `astro.config.mjs`.
