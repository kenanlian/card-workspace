# Repository Guidelines

## Project Overview

`card-workspace-site` is the documentation/marketing website for **Card Workspace**, an Obsidian plugin that browses the vault as cards in the left sidebar. It is a bilingual (English + Simplified Chinese) static site built with **Astro** and the **Starlight** docs theme, deployed as a **GitHub Pages project site** at `https://kenanlian.github.io/card-workspace-site/`.

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
- Splash pages import a custom `Landing` Astro tree from `src/components/landing/`. V2 Graphite tokens live in `src/styles/` and are loaded via Starlight `customCss`.
- `designs/` holds self-contained HTML design artifacts (baoyu-design skill). It is **not** part of the Astro build or GitHub Pages deploy; promote approved work into `src/` when shipping.

## Key Directories

- `src/content/docs/en/` — English docs (default locale).
- `src/content/docs/zh/` — Chinese docs (`zh-CN`). Mirrors the `en/` structure.
- `src/content/docs/{locale}/guides/` — guide pages (`introduction`, `installation`, `getting-started`, `navigation`, `card-boxes`, `browsing-cards`, `writing-and-organizing`). Distinctive feature docs live at `guides/card-boxes`.
- `src/content/docs/{locale}/reference/` — reference pages (`settings`, `commands-and-menus`, `limits-and-privacy`).
- `src/components/landing/` — custom Astro landing components used only by the locale splash pages.
- `src/styles/` — V2 Graphite Index tokens (`tokens.css`) and Starlight chrome (`theme.css`); landing CSS is imported from the Landing component.
- `src/assets/` — images referenced by content (e.g. `logo-light.svg`, `logo-dark.svg`).
- `src/pages/` — the root redirect (`index.astro`).
- `public/` — static assets served as-is (`favicon.svg`, `og.png`).
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
- **Frontmatter**: every page has `title` + `description` (Starlight-required). Landing pages (`index.mdx`) use `template: splash` and omit the `hero` block; the body imports `<Landing locale="en" />` or `<Landing locale="zh" />`.
- **Components**: custom Astro components under `src/components/landing/` for the splash only. Guide/reference pages are plain `.md` and do not import components.
- **Internal links**: use absolute paths including the base prefix and a trailing slash, e.g. `/card-workspace-site/en/guides/introduction/`.
- **i18n**: sidebar labels carry `translations: { 'zh-CN': '...' }`; keep `en/` and `zh/` structures in sync when adding pages.
- **Styling**: V2 Graphite Index tokens in `src/styles/`; Starlight `customCss` loads `./src/styles/theme.css` (which imports `tokens.css`). No Tailwind. Landing-scoped CSS is imported from the Landing component, not a second Starlight `customCss` entry.
- **Designs**: one project per `designs/<slug>/` folder; keep deliverables self-contained (HTML/JSX/CSS/assets together). Regular projects have `_d_meta.json`; design systems have `_ds_manifest.json` at the folder root. Preview via HTTP (`python3 -m http.server 4311 --directory designs`), not `file://`. Do not scatter design files in the repo root or under `src/`. `designs/` is still not deployed.

## Important Files

- `astro.config.mjs` — Starlight config: `site`, `base`, locales, sidebar, social links, `customCss`. Edit here to change navigation.
- `src/styles/theme.css` / `src/styles/tokens.css` — Graphite Index theme for docs chrome.
- `src/components/landing/` — V2 splash composition imported by `index.mdx`.
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
