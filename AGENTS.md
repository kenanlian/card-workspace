# Repository Guidelines

## Project Overview

`card-workspace-site` is the documentation/marketing website for **Card Workspace**, a card-based workspace plugin for Obsidian. It is a bilingual (English + Simplified Chinese) static site built with **Astro** and the **Starlight** docs theme, deployed as a **GitHub Pages project site** at `https://kenanlian.github.io/card-workspace-site/`.

## Architecture & Data Flow

```
astro.config.mjs (Starlight: locales, sidebar, social, site/base)
        ↓
src/content.config.ts (single `docs` collection, Starlight schema)
        ↓
src/content/docs/{en,zh}/**/*.{md,mdx}   ← authored content
        ↓
astro build (base = /card-workspace-site) → dist/
        ↓
GitHub Actions (withastro/action) → GitHub Pages
```

- Content lives in a single Starlight `docs` collection; there is no custom loader or schema.
- The sidebar is **manually defined** in `astro.config.mjs` and is decoupled from the filesystem — adding a doc requires both a content file *and* a sidebar entry.
- `src/pages/index.astro` is a meta-refresh redirect from the site root to `/en/`.
- `designs/` holds self-contained HTML design artifacts (baoyu-design skill). It is **not** part of the Astro build or GitHub Pages deploy; promote approved work into `src/` when shipping.

## Key Directories

- `src/content/docs/en/` — English docs (default locale).
- `src/content/docs/zh/` — Chinese docs (`zh-CN`). Mirrors the `en/` structure.
- `src/content/docs/{locale}/guides/` — guide pages (`introduction`, `installation`, `getting-started`).
- `src/content/docs/{locale}/reference/` — reference pages (`settings`).
- `src/assets/` — images referenced by content (e.g. `logo.svg`).
- `src/pages/` — the root redirect (`index.astro`).
- `public/` — static assets served as-is (`favicon.svg`).
- `designs/` — design prototypes and design systems (one folder per project). Not served by Astro.
- `dist/` — build output (git-ignored).

## Development Commands

Package manager is **npm** (`package-lock.json`, lockfileVersion 3).

```bash
npm install          # install dependencies
npm run dev          # start dev server (astro dev)
npm run build        # production build → ./dist
npm run preview      # preview the production build
```

Local URLs are served under the `/card-workspace-site/` base path (e.g. `http://localhost:4321/card-workspace-site/en/`).

There is no lint or test script configured.

## Code Conventions & Common Patterns

- **File naming**: kebab-case for doc files (`getting-started.md`); lowercase for locale (`en`, `zh`) and section (`guides`, `reference`) folders; landing page is `index.mdx` per locale.
- **Frontmatter**: every page has `title` + `description` (Starlight-required). Landing pages (`index.mdx`) use `template: splash` with a `hero` block (tagline, image, action buttons with `icon`/`variant`).
- **Components**: no custom Astro/React/Vue components. `index.mdx` files import built-in Starlight components (`Card`, `CardGrid`) from `@astrojs/starlight/components`. Guide/reference pages are plain `.md`.
- **Internal links**: use absolute paths including the base prefix, e.g. `/card-workspace-site/en/guides/introduction`.
- **i18n**: sidebar labels carry `translations: { 'zh-CN': '...' }`; keep `en/` and `zh/` structures in sync when adding pages.
- **Styling**: 100% Starlight default theme — no `src/styles/`, no Tailwind, no `customCss`.
- **Designs**: one project per `designs/<slug>/` folder; keep deliverables self-contained (HTML/JSX/CSS/assets together). Regular projects have `_d_meta.json`; design systems have `_ds_manifest.json` at the folder root. Preview via HTTP (`python3 -m http.server 4311 --directory designs`), not `file://`. Do not scatter design files in the repo root or under `src/`.

## Important Files

- `astro.config.mjs` — Starlight config: `site`, `base`, locales, sidebar, social links. Edit here to change navigation.
- `src/content.config.ts` — declares the `docs` collection using `docsLoader()` + `docsSchema()`.
- `src/pages/index.astro` — root → `/en/` redirect.
- `tsconfig.json` — extends `astro/tsconfigs/strict`.
- `.github/workflows/deploy.yml` — build + deploy pipeline.
- `README.md` — human-facing setup and deploy notes.

## Runtime/Tooling Preferences

- **Runtime**: Node **22** (Astro 7 requires `^20.19.0 || >=22.12.0`; CI uses Node 22). No `.nvmrc` is committed.
- **Package manager**: npm. Do not introduce yarn/pnpm lockfiles.
- **Key versions**: `astro@^7.1.3`, `@astrojs/starlight@^0.41.4`, `sharp@^0.35.3`.

## Testing & QA

- No automated test framework is configured.
- Validate changes with `npm run build` (Starlight/Astro fail the build on broken content, invalid frontmatter, or broken internal links) and spot-check via `npm run dev` / `npm run preview`.

## Deployment

- CI: `.github/workflows/deploy.yml` triggers on push to `main` (and manual `workflow_dispatch`).
- Build uses `withastro/action@v3`; deploy uses `actions/deploy-pages@v4` to the `github-pages` environment.
- Target URL: `https://kenanlian.github.io/card-workspace-site/`. The `base` in `astro.config.mjs` must match the repository name.
- **Pre-deploy note**: the placeholder username `kenanlian` in `astro.config.mjs` and docs links should be replaced with the actual GitHub username before a real deployment.
