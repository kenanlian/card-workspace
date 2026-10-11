# Card Workspace — Website

Documentation and marketing site for the **Card Workspace** Obsidian plugin.
Built with [Astro](https://astro.build/) + [Starlight](https://starlight.astro.build/),
bilingual (English / 简体中文), and deployed to GitHub Pages.

## Site configuration

The site is configured for the `kenanlian/card-workspace` GitHub Pages
**project site**, served at:

```
https://kenanlian.github.io/card-workspace/
```

`base` in `astro.config.mjs` (`/card-workspace`) must always match your
repository name. If you rename the repo, update `base` accordingly.
If you move the site to another account, update `site` in `astro.config.mjs`.
Plugin repository and release links live separately in `src/content/site.ts`.

## Develop

```bash
npm install
npm run dev
```

Open the printed local URL (paths live under `/card-workspace/`).

## Build

```bash
npm run build     # output in ./dist
npm run preview   # preview the production build
```

## Deploy (GitHub Pages)

1. Use the `kenanlian/card-workspace` repository, or update the site configuration for your own repository.
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
│   │   ├── property-filters.md
│   │   ├── linked-notes.md
│   │   ├── card-boxes.md
│   │   ├── browsing-cards.md
│   │   └── writing-and-organizing.md
│   ├── updates/                     # recent updates, grouped by roughly five releases
│   │   ├── 1-0-0-to-1-0-5.md
│   │   ├── 1-1-2-to-1-1-6.md
│   │   ├── 1-1-7-to-1-2-1.md
│   │   ├── 1-2-2-to-1-2-6.md
│   │   ├── 1-2-7-to-1-3-3.md
│   │   └── 1-3-4.md
│   └── reference/
│       ├── settings.md
│       ├── commands-and-menus.md
│       └── limits-and-privacy.md
└── zh/                              # 简体中文 (mirrors the English structure)
    ├── index.mdx
    ├── guides/
    ├── reference/
    └── updates/
```

Splash landing components live in `src/components/landing/`. Graphite Index
tokens and Starlight chrome live in `src/styles/`. `designs/` contains independent
design prototypes and icon handoff assets; it is not deployed.

Navigation labels and translations live in the `sidebar` config in `astro.config.mjs`.

Documentation pages use relative Markdown links to their `.md` source files so
the same tree can be opened as an Obsidian vault. `src/remark-obsidian-links.mjs`
validates those targets and rewrites them to deployed Starlight routes during
the build.

## Updating product documentation

The shared product version is in `src/content/site.ts`. Document the tagged
plugin release, since its working tree may already contain unreleased features.
Keep both locales in sync, summarize about five published releases per update
page, and add each page to the manual sidebar with the newest group first.
The first reserved range, 1.0.0–1.0.5, contains the three actual 1.0 releases;
the 1.2.7–1.3.3 group also identifies the unpublished 1.3.1 tag separately.
The landing page and shared header currently show 1.4.3. Bulk property operations
in Writing and organizing and the menu reference were checked against the 1.4.3
tag; license copy follows the 1.4.3 release. The remaining guides, settings
reference, and update summaries were last reviewed against 1.3.4; changing
`VERSION` does not update their content. Review
the intervening tagged releases before describing all documentation as current.
Keep historical update pages as release records.

Getting started and Navigation reuse bilingual workspace screenshots that
follow the site's light or dark theme. See
[the screenshot guide](docs/screenshot-plan.md) for current placement and future
captures.

## Homepage media

Every landing section uses a localized clip: `hero`, `gather`, `images`, `links`,
`search`, `drag`, `boxes`, and `bulk`. Each has an English and Chinese H.264 MP4
and a WebP poster in `src/assets/media/clips/`. `Landing.astro` requires all pairs
at build time. Clip alt text and captions live in `src/content/landing.ts`.

Edit and render clips in the separate [`videos/`](videos/README.md) project;
its dependencies and local rendering inputs are independent of the Astro site.
The site build uses the rendered assets directly.
