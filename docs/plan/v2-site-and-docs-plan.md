# V2 site design and bilingual product-docs draft

### Context

The live Card Workspace site still uses a Zed-era Starlight restyle and placeholder docs that describe an infinite canvas / kanban. The approved visual and marketing source is the V2 “Graphite Index” landing in `designs/card-workspace-landing/`. This plan converts the shipped Astro/Starlight site to that design language, ports the V2 landing into `src/`, and replaces the docs with a bilingual (en / zh-CN) first draft arranged by user tasks. `designs/` stays a prototype tree and is not deployed.

### Baseline

- Repository root: `/home/kenan/Secret-Projects/card-workspace-site`
- Current commit: `608ba080cff893e13e7eb3bf71864721f60920ac` (`feat: add brand mark, favicon, and social image`)
- Dirty / untracked at plan time: `?? .agents/` (user-owned; do not stage or rewrite)
- Runtime: Node 22; npm; `astro@^7.1.3`; `@astrojs/starlight@^0.41.4` (resolved `0.41.4`); `sharp@^0.35.3`
- Site: `https://kenanlian.github.io`; `base`: `/card-workspace-site`; default locale `en` prefixed at `/en/`; `zh` at `/zh/` with `lang: zh-CN`
- Product source (sibling, read-only): `/home/kenan/Secret-Projects/obsidian-card-workspace` at plugin version `1.0.2` (`manifest.json`: `id: card-workspace`, `minAppVersion: 1.9.0`, `isDesktopOnly: true`)
- Drift anchors: `astro.config.mjs` (`site`, `base`, `locales`, `sidebar`, `customCss`, `logo`); `src/styles/theme.css`; `src/content/docs/{en,zh}/**`; `package.json` font packages. Landing version badge follows sibling `manifest.json.version` at execution time (Assumption 3).

### Requirements & behavioral contracts

**R1.** Ship the V2 Graphite Index visual language on every live page (docs chrome and landing), replacing the current Zed palette (IBM Plex Serif + Inter + `#1348dc` / `#2b7fff`).

**R2.** Replace both locale splash pages with a V2 landing composition and copy, using Starlight i18n/theme chrome rather than the prototype’s Tweaks panel.

**R3.** Replace placeholder product docs with the 10-page bilingual IA below, factually aligned with the plugin.

**R4.** Update repo conventions (`AGENTS.md`, `README.md`) so they match the shipped site.

**R5.** `npm run build` succeeds; Starlight link checking passes; no remaining canvas/kanban/fake-settings claims in `src/`.

#### Visual language (C1)

V2 token source: `designs/card-workspace-landing/tokens-v2.css`.

| Role | V2 value (must ship) |
| --- | --- |
| Display font | `'Petrona', 'Noto Serif SC', ui-serif, Georgia, serif` |
| Body font | `'Archivo', 'Noto Sans SC', ui-sans-serif, system-ui, sans-serif` |
| Mono / UI chrome | `'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, monospace` |
| Radii | `--cw-radius-sm: 4px`; `--cw-radius-md: 7px`; `--cw-radius-lg: 11px`; `--cw-radius-card: 14px` |
| Light accent | `oklch(0.42 0.042 252)` |
| Dark accent | `oklch(0.79 0.055 250)` |
| Light canvas | `oklch(0.971 0.002 250)` |
| Dark canvas | `oklch(0.172 0.005 258)` |

Fonts are self-hosted via fontsource (no Google Fonts CDN). Confirmed packages: `@fontsource-variable/petrona@5.3.0`, `@fontsource-variable/archivo@5.3.0`, `@fontsource/noto-serif-sc@5.3.0`, `@fontsource/noto-sans-sc@5.3.0`; keep `@fontsource/ibm-plex-mono`. Remove `@fontsource-variable/inter` and `@fontsource/ibm-plex-serif`.

Starlight theme-attribute convention is **dark on `:root`, light on `:root[data-theme='light']`** (current `src/styles/theme.css`). Do not copy V2’s light-on-`:root` / `[data-theme='dark']` selector polarity onto Starlight chrome. Map V2 **values** into Starlight’s existing selectors:

- `:root` (and `[data-theme='dark']` if needed for landing scoped CSS) ← V2 dark tokens
- `:root[data-theme='light']` ← V2 light tokens

`--sl-font` ← Archivo stack; headings in markdown and docs chrome use Petrona; nav/buttons/labels use IBM Plex Mono. Map `--sl-color-accent*` and gray scale to the Graphite oklch values so Starlight header, sidebar, links, buttons, cards, code, and tables read as V2, not Zed blue.

Landing-scoped CSS must **not** copy `components-v2.css` global `html` / `body` / `*` resets. Scope grain, ambient, card stream, and deal-in animation to `.cw-page`. Replace V2’s `[data-lang='zh']` with `html[lang='zh-CN']` or `:lang(zh-CN)` (Starlight sets `lang`, not `data-lang`). Keep `prefers-reduced-motion` behavior from `components-v2.css`.

Do not port: Tweaks chrome (`.cwx`), `localStorage` theme/lang store `cw-landing-v2-prefs`, URL `?theme=&lang=` review params, ImageSlot file-drop UI, Google Fonts `@import`, or a second theme/language toggle. Starlight `ThemeSelect` and `LanguageSelect` remain the only theme/locale controls.

#### Landing (C2)

Keep locale routes as Starlight splash pages:

- `src/content/docs/en/index.mdx`
- `src/content/docs/zh/index.mdx`

Each uses `template: splash`, keeps Starlight-required `title` + `description` (`title` remains `Card Workspace`), and **omits** the `hero` frontmatter block (V2 hero is not Starlight’s title/tagline/image layout). Body imports one Astro tree, e.g. `<Landing locale="en" />` / `<Landing locale="zh" />`.

Starlight `Page.astro` (0.41.4) renders `PageTitle` (`h1#_top`) whenever `hero` is absent. That title must not appear as a second visible headline. In `landing.css`, when `.page:has(.cw-page)`, visually hide the first `.content-panel` (the PageTitle panel) with an sr-only treatment so `#_top` remains in the DOM for SkipLink. Do not `display: none` that `h1`.

No Starlight `components` overrides. Starlight `Header` stays (logo light/dark already in `astro.config.mjs`). V2 in-page nav, version badge, section stream, BoxViz, and footer render **inside** `Landing`, below the site header. Starlight’s splash `Footer` (pagination / last updated) will still render under the landing; hide it with `.page:has(.cw-page) footer` (the Starlight page footer, not `.cw-footer`) so only the V2 footer shows.

Port structure and copy from `designs/card-workspace-landing/page-v2.jsx`, `primitives-v2.jsx`, and `content-v2.jsx` into Astro + a typed content module (no React, no `window.CONTENT`). Required section order and ids: hero `#top`, `#why`, `#nav`, `#boxes`, `#flow`, `#scale` (privacy `06` rides in the scale media column), `#install`, then footer.

Copy edits vs `content-v2.jsx` (everything else in that file’s `en` / `zh` trees is the source of truth):

| Element | Ship |
| --- | --- |
| Version | `v1.0.2` / titles already in content-v2 |
| Primary CTA (“Get Card Workspace” / “获取 Card Workspace”) | `https://github.com/kenanlian/obsidian-card-workspace/releases` |
| Secondary hero CTA (“Read the docs” / “查看文档”) | `/card-workspace-site/{locale}/guides/getting-started/` |
| Install secondary CTA | `https://github.com/kenanlian/obsidian-card-workspace` |
| `sections.install.note` | Remove the `TODO[…]` string. Replace with a visible limitation, not a placeholder: EN `Desktop only. Install from GitHub Releases. Not listed in Community plugins.` ZH `仅桌面端。从 GitHub Releases 安装。尚未上架社区插件市场。` |
| Footer Docs links | Real paths, not `#install`. EN: Introduction → `/card-workspace-site/en/guides/introduction/`; Installation → `.../guides/installation/`; Getting started → `.../guides/getting-started/`; Settings → `.../reference/settings/`. ZH mirrors under `/zh/`. |
| Footer Project links | GitHub repo; Releases; Issues (`.../issues`); License (`.../blob/main/LICENSE` or repo root — if LICENSE URL 404s, link the repo). |
| `Btn` keyboard hint `↵` | Omit |
| Hero screenshot | There is no `card-workspace-hero.jpg` in `designs/card-workspace-landing/assets/` and no screenshot files in the sibling plugin checkout. Render the V2 `Shot` frame as a non-interactive placeholder using `hero.shotCaption`. Do not invent a product screenshot. |
| Image slots (`why`, `nav`, `flow`) | Static placeholders using each section’s `slot` text. No file input. |

BoxViz and RulesPanel: port the prototype markup/CSS. RulesPanel op labels stay English (`scope` / `or` / `except`) on both locales, matching V2.

#### Documentation IA (C3)

Sidebar is manual in `astro.config.mjs`. English labels + `translations: { 'zh-CN': '…' }`. Folder slugs:

```
guides/introduction
guides/installation
guides/getting-started
guides/navigation
guides/card-boxes
guides/browsing-cards
guides/writing-and-organizing
reference/settings
reference/commands-and-menus
reference/limits-and-privacy
```

Sidebar groups, in order:

1. `Getting started` / `开始使用` — introduction, installation, getting-started
2. `Using Card Workspace` / `使用指南` — navigation, card-boxes, browsing-cards, writing-and-organizing
3. `Reference` / `参考` — settings, commands-and-menus, limits-and-privacy

Rewrite existing files in place; add the six new slugs in both `en/` and `zh/`. Keep `en/` and `zh/` structures identical. Frontmatter: `title` + `description` required. Guide/reference pages remain `.md` (no MDX unless a page must import a component; none should).

Internal links: absolute paths including base and trailing slash, e.g. `/card-workspace-site/en/guides/introduction/`.

Provenance rule: every product claim traces to plugin `README.md` / `README.zh-CN.md`, `manifest.json`, `src/i18n/**`, `src/settings.ts`, `src/CardWorkspaceSettingTab.ts`, or the typed models cited below. Unverifiable claims are omitted, not marked TODO in the shipped site.

**Forbidden strings in `src/`** (case-insensitive search must be clean after implementation): `infinite canvas`, `kanban`, `对齐网格`, `默认看板文件夹`, `卡片宽度`, `snap to grid`. Do not describe Community plugins as an available install channel. Do not claim mobile support or a mobile timeline.

Do not document plugin development, release tagging, or architecture internals (MiniSearch/IndexedDB mechanics, controller names). Search-index **user** commands belong on the commands page.

**Required literals (EN / ZH)** when naming UI:

- Command `open-view`: `Open Card Workspace view` / `打开 Card Workspace 视图`
- Ribbon tooltip: `Open Card Workspace` / `打开 Card Workspace`
- Search commands: `Show Card Workspace local search index lifecycle status` / `显示 Card Workspace 本地搜索索引生命周期状态`; `Recover Card Workspace local search index lifecycle` / `恢复 Card Workspace 本地搜索索引生命周期`; `Rebuild Card Workspace local search index from notes` / `从笔记重建 Card Workspace 本地搜索索引`; `Clear and reset Card Workspace local search index state` / `清除并重置 Card Workspace 本地搜索索引状态`
- Nav sections, **on-screen order**: `Favorites` / `收藏`; `Folders` / `文件夹`; `Tags` / `标签`; `Boxes` / `卡片盒` (`NavigationPane.svelte`)
- Box create: `New card box…` / `新建卡片盒…`; `Save current view as card box…` / `将当前视图存为卡片盒…`

#### Per-page content contracts (C4)

Each page: short opening that states the job, then the facts below. Prose may vary; facts may not.

**guides/introduction** — What it is / is not. Card Workspace is a **left-sidebar** Obsidian plugin that shows notes as a card stream (title + Markdown-stripped excerpt). It is not Obsidian Canvas and not a kanban/infinite canvas. Scope is a folder (optional subfolders), a tag filter, or a card box. Click a card to open the note; the card selection follows the active editor note. Notes remain Markdown (and other supported files) in the vault. Next: installation, getting started. Desktop only; Obsidian ≥ 1.9.0.

**guides/installation** — Manual GitHub Releases only (current README). Steps: download latest release; copy `main.js`, `manifest.json`, `styles.css` into `<vault>/.obsidian/plugins/card-workspace/`; Settings → Community plugins; disable Restricted/Safe mode if needed; enable **Card Workspace**. Do not include a “browse Community plugins and search Card Workspace” path. Requirements: desktop, Obsidian 1.9.0+. Link to getting started.

**guides/getting-started** — (1) Ribbon or command `Open Card Workspace view` opens the panel in the **left sidebar**. (2) Pick a folder, tag, or box in the plugin’s own navigation pane. (3) Browse cards; click to open. (4) Right-click for more actions; drag a card into an open Markdown editor to insert. Session note: startup restores **folder** scope (`lastFolderPath`, vault root when `""`) and does not restore the last card box (`activeBoxId` forced null on startup — `obsidian-card-workspace/AGENTS.md` Current Project Status). Point to navigation, card boxes, and writing-and-organizing.

**guides/navigation** — Own two-column pane. Section order is **Favorites → Folders → Tags → Boxes**. Drag divider to resize (`navPaneWidth` default 240, min 160, max 480 — this is the **nav column**, not card width). Header toggle collapses the nav column (`Collapse navigation` / `折叠导航栏`). When shell width `< navPaneWidth + 304` (`CARD_PANE_MIN_WIDTH`), layout is single-pane and the toggle swaps navigation vs cards (`Back to cards` / `返回卡片`; `NavLayoutController.getLayoutMode`). Folder scope can include subfolders (default `includeSubfolders: true`; disabled in box mode). Tags read frontmatter and inline tags via Obsidian `getAllTags`; click selects one tag (second click on the only tag clears); Ctrl/Cmd adds. Favorites: folder / file / tag / box, grouped by kind, reorderable within kind. Item counts are off by default (`showNavItemCounts: false`); described further in settings. Do not claim a first-class “open in the main editor” action; `activateView()` uses the left leaf (`getLeftLeaf`).

**guides/card-boxes** — Distinctive feature. A box is a saved topic collection in **Boxes**. Membership = rule hits ∪ `manualPaths` − `excludedPaths`; `manualPaths ∩ excludedPaths = ∅` (`CardBoxDefinition` in `src/view/types.ts`). A rule is folder path (`""` = vault root) + `includeSubfolders` + tags (AND within a rule). Rules in a box combine with **OR**. Each box has its own `sort` and `pinnedPaths`. Create via right-click in Boxes or save current folder+tag view. Deleting a box does not delete notes (confirm copy in `src/i18n/box.ts`). **Box scope skips the browse tag filter**; pipeline is search → pin only (`stepsForScope` in `src/view/pipeline.ts`). UI string: `Tag filter is unavailable in a box` / `卡片盒模式下不可使用标签筛选`.

**guides/browsing-cards** — Card shows title + excerpt; Markdown has full preview/index; `base` / `canvas` / `excalidraw` are title/placeholder (`CardFileKind` in `src/view/file-kind.ts`). Virtualized scrolling. Two-way sync. Local full-text search over current folder/box cards; empty query shows all; non-empty query is blocked until the local index is ready (zero cards + `Search is currently blocked` / `搜索当前不可用`). Non-markdown files are indexed by **title only**. Sort: Edited/Created newest/oldest; Filename A–Z / Z–A (folder browse uses global `sort`; box uses that box’s sort). Pins stay at top; **relative order among pinned follows stream order, not pin-list order**; folder vs box pin lists are separate. Do not document the 10 000-path search cap (code-only). Toolbar labels from `src/i18n/toolbar.ts`.

**guides/writing-and-organizing** — Default click-open: `smart` reuses an unpinned root editor leaf, else new tab; options new-tab / split-right / new-window (`defaultCardOpenBehavior`). Right-click open destinations stay independent of that setting. Drag into a **Markdown editor** only (`EditorDropController`): `ask` (default) / wiki / embed / content / title-content. Allowed actions by card kind: markdown → all four; base and canvas → wiki + embed; excalidraw → wiki only. Unsupported drop: `This card type does not support that drag insertion action.` New note from toolbar: `tags-frontmatter` (default, writes `---\ntags:\n---`) or `blank`; basename `Untitled` / `未命名`. Right-click nav: create note/folder/canvas/base, rename, duplicate, move, delete, copy vault/system path, reveal in system explorer, search in folder, favorites, box commands. Card menu: open destinations, copy title/content (live Markdown), tags, move/rename/delete, add/remove box membership (`CardMenuAction`). Bulk: move, add/remove tag, delete, merge (`toolbar.bulkActionLabels`). Merge is **Markdown only**, ≥2 notes. Tag item menus are hidden in box mode.

**reference/settings** — Document **only** settings rendered in `CardWorkspaceSettingTab.display()`:

| Setting key | Default | EN name | ZH name |
| --- | --- | --- | --- |
| `defaultCardOpenBehavior` | `smart` | Default card open behavior | 卡片默认打开方式 |
| `dragInsertAction` | `ask` | Card drag insert behavior | 卡片拖拽插入行为 |
| `newNoteTemplate` | `tags-frontmatter` | New note content | 新建笔记内容 |
| `cardCornerRadius` | `rounded` | Card corner radius | 卡片圆角 |
| `previewLines` | `5` (min 3, max 8) | Preview lines | 预览行数 |
| `showNavItemCounts` | `false` | Show item counts in navigation | 在导航栏显示条目计数 |

Option labels: `getDefaultCardOpenBehaviorOptions` / `getDragInsertActionOptions` / `getNewNoteTemplateOptions` / `getCardCornerRadiusOptions` in plugin `src/i18n/index.ts`. Descriptions: `src/i18n/settingTab.ts`. Do **not** list persisted-but-hidden state (`boxes`, `favorites`, `pinnedPaths`, `lastFolderPath`, pane collapse, etc.) as settings-tab rows; those are explained on guide pages.

**reference/commands-and-menus** — Five palette commands (ids `open-view`, `show-folder-card-search-index-status`, `recover-folder-card-search-index`, `rebuild-folder-card-search-index`, `clear-reset-folder-card-search-index`) with exact names above. State that everyday actions live on ribbon + right-click + drag, not the palette. Summarize nav vs card vs bulk menus by grouping (create / organize / box / favorites / destructive); do not invent items absent from `src/view/nav-context-menu.ts` and `src/view/menus/card-context-menu.ts`. Search-index commands are recovery tools, not browsing.

**reference/limits-and-privacy** — Desktop only (`isDesktopOnly`). Obsidian ≥ 1.9.0 (Bases card support). Sidebar-first. Supported files: `.md` markdown; `.base`; `.canvas`; `.excalidraw` / `.excalidraw.md`. Plugin does not make external network requests; file ops via Vault/FileManager; search uses bundled `minisearch` (README Privacy). Site self-hosts fonts; that is unrelated to plugin privacy. MIT license; issues at the GitHub repo.

#### Site config and conventions (C5)

- Keep `src/pages/index.astro` root → `/en/` redirect.
- Keep existing `logo.light` / `logo.dark`, `public/favicon.svg`, `public/og.png`, and `head` og/twitter image tags unless a file is broken.
- `astro.config.mjs` `description` must stop saying a generic “card-based workspace” that could be read as a board. Use: `Browse your vault as cards in Obsidian’s sidebar.`
- Custom Astro components **are allowed** under `src/components/landing/` for the splash only.
- `designs/` is not part of `astro build`. Do not edit prototype HTML to “ship” V2.
- Plugin repo is not modified.

### Work-package DAG

```
WP-01 (theme tokens/fonts)
   ├── WP-02 (landing port) [needs C1 tokens + font faces]
   ├── WP-03 (docs + sidebar) [no CSS dependency; serial with WP-01 only because both must not collide on astro.config — WP-03 is the only astro.config editor]
   └── WP-04 (AGENTS/README)
         └── WP-05 (integration / build) [after WP-01..04]
```

- **Serial:** WP-05 after WP-01, WP-02, WP-03, WP-04. WP-02 after WP-01 (token names and font imports must exist).
- **Parallel-safe:** WP-03 ∥ WP-04 ∥ (WP-01 then WP-02). WP-03 must not edit `src/styles/**`, `package.json`, or landing files. WP-01 must not edit `astro.config.mjs` (already lists `customCss: ['./src/styles/theme.css']`; put `@import './tokens.css'` inside `theme.css`). WP-02 must not edit `astro.config.mjs`; landing CSS is imported from the Landing component.
- WP-03 is the **only** package that edits `astro.config.mjs` (sidebar + `description`).

### Work packages

#### WP-01 — V2 tokens on Starlight chrome

- **Goal and contracts:** Docs chrome uses Graphite Index type, color, and radius. Delivers R1, C1.
- **Dependencies and scheduling:** None. Parallel-safe with WP-03 and WP-04. Delegation: `preferred`.
- **Authority and ownership:** `package.json`, `package-lock.json`, `src/styles/theme.css`, new `src/styles/tokens.css`. Excluded: content files, `astro.config.mjs`, `designs/`, landing components. Must not introduce a second theme toggle or Google Fonts.
- **Grounded implementation:** Extract V2 custom properties from `designs/card-workspace-landing/tokens-v2.css` into `src/styles/tokens.css`, remapped to Starlight dark-first selectors (C1). Rewrite `src/styles/theme.css`: replace Inter/Plex Serif imports with Petrona/Archivo/Noto SC/Plex Mono fontsource CSS; keep chrome rules (header blur, sidebar current-page pill, buttons, tables) but bind them to new tokens; delete Zed `#1348dc` / `#2b7fff` and 2px/4px radii. Import `tokens.css` first from `theme.css`.
- **Failure behavior:** If a Noto SC fontsource CSS import is too large for practicality, import only weights 400+500 (not the full family dump) — still self-hosted. Do not fall back to Google CDN.
- **Focused verification:**
  - **V1:** `rg -n "1348dc|2b7fff|IBM Plex Serif|Inter Variable" src/styles package.json` is empty (except lockfile hashes if any; `package.json` must not list inter/plex-serif).
  - **V2:** `package.json` lists the four new font packages and `ibm-plex-mono`; `src/styles/theme.css` imports them.
- **Handoff:** `--cw-*` and `--sl-*` tokens available; body/heading/mono stacks live.

#### WP-02 — V2 landing in Starlight splash

- **Goal and contracts:** EN and ZH splash pages match V2 composition and C2 copy/CTA rules. Delivers R2, C2.
- **Dependencies and scheduling:** WP-01. Parallel-safe with WP-03, WP-04 after WP-01. Delegation: `preferred`.
- **Authority and ownership:** `src/components/landing/**`, `src/styles/landing.css`, `src/content/docs/en/index.mdx`, `src/content/docs/zh/index.mdx`, optional `src/content/landing.ts` (or equivalent) for bilingual strings. Excluded: `astro.config.mjs`, guide/reference markdown, `designs/` edits, Starlight Header/Footer overrides.
- **Grounded implementation:** Convert `page-v2.jsx` / `primitives-v2.jsx` to Astro (SectionCard, Tiles, RulesPanel, BoxViz, Shot-as-placeholder, Label, VersionBadge, Btn). CSS: copy landing structure from `components-v2.css` + page-level tokens already in `tokens.css`; strip global resets and `.cwx`. Deal-in: small script observing `.cw-deal`, same as `app-v2.jsx` IntersectionObserver, disabled when `prefers-reduced-motion: reduce`. Splash MDX: `template: splash`, no `hero`, import `<Landing locale>`. Brand marks: reuse `src/assets/logo-light.svg` and `logo-dark.svg` (prototype `assets/logo.svg` is the light mark).
- **Failure behavior:** Missing hero image → placeholder, not a broken `<img>`. Footer GitHub LICENSE 404 → link repo root.
- **Focused verification:**
  - **V3:** `en/index.mdx` and `zh/index.mdx` have `template: splash`, no `hero:` key, and render `<Landing`.
  - **V4:** Landing content module contains the four CTA URLs in C2 and does not contain `TODO[`.
  - **V5:** `rg "cwx|cw-landing-v2-prefs|fonts.googleapis" src/` is empty.
- **Handoff:** Locale splash routes render the V2 stream.

#### WP-03 — Bilingual docs IA

- **Goal and contracts:** Ten pages × two locales + sidebar. Delivers R3, C3, C4, C5 (`description` + sidebar).
- **Dependencies and scheduling:** None on WP-01/02 (markdown-only plus `astro.config.mjs`). Parallel-safe with WP-01/02/04 on all files except `astro.config.mjs` (exclusive to this package). Delegation: `preferred`.
- **Authority and ownership:** `astro.config.mjs` (`sidebar` array and top-level `description` only; do not change `site`, `base`, `locales`, `logo`, `head`, `customCss`, `social`); `src/content/docs/en/guides/**`, `src/content/docs/en/reference/**`, `src/content/docs/zh/guides/**`, `src/content/docs/zh/reference/**`. Excluded: `index.mdx`, `src/styles/**`, `src/components/**`.
- **Grounded implementation:** Replace placeholder body in introduction, installation, getting-started, settings. Add navigation, card-boxes, browsing-cards, writing-and-organizing, commands-and-menus, limits-and-privacy. Sidebar items use the slugs and group labels in C3. Page bodies follow C4. Setting names/options copied from plugin i18n, not invented. Installation must not include Community-plugin browse steps.
- **Failure behavior:** If an i18n string is missing in one language, do not silently use English in the ZH page; the plugin files contain both.
- **Focused verification:**
  - **V6:** `rg -n -i "infinite canvas|kanban|对齐网格|默认看板文件夹|snap to grid" src/content/docs` is empty.
  - **V7:** Each of the 10 slugs exists as both `en/...md` and `zh/...md` with `title` and `description` frontmatter; sidebar lists exactly those 10 slugs in the C3 order.
  - **V8:** Settings page table has exactly the six keys in C4 and includes `smart` / `ask` / `rounded` / `5` defaults.
  - **V9:** Installation pages mention `plugins/card-workspace/` and GitHub Releases, and do not tell the user to search Community plugins for the plugin name as an install method.
- **Handoff:** Docs tree and sidebar ready for build.

#### WP-04 — Convention docs

- **Goal and contracts:** `AGENTS.md` and `README.md` describe V2 theme, custom landing components, and the new sidebar IA. Delivers R4, C5.
- **Dependencies and scheduling:** None. Parallel-safe with WP-01..03. Delegation: `allowed`.
- **Authority and ownership:** `AGENTS.md`, `README.md`. Excluded: all `src/**` except as cited.
- **Grounded implementation:** Delete stale claims: “100% Starlight default theme — no `src/styles/` / no `customCss`” and “no custom Astro components”. Record: V2 Graphite tokens in `src/styles/`; landing components in `src/components/landing/`; splash `index.mdx` imports `Landing`; docs folders as in C3; `designs/` still not deployed. README “Content structure” tree matches shipped files.
- **Failure behavior:** None beyond leaving a stale sentence that V10 catches.
- **Focused verification:**
  - **V10:** `rg -n "100% Starlight default|no custom Astro" AGENTS.md README.md` is empty; both files mention `guides/card-boxes` (or “card boxes”) and `src/styles/`.
- **Handoff:** Human/agent conventions match the implementation.

#### WP-05 — Integration and build

- **Goal and contracts:** Combined site builds, routes exist, forbidden claims gone site-wide in `src/`. Delivers R5.
- **Dependencies and scheduling:** WP-01..04. Delegation: `main-required`.
- **Authority and ownership:** No feature edits except fixes for integration failures in files already owned by WP-01..04. May run `npm install` if WP-01 changed lockfile and it was not installed.
- **Grounded implementation:** `npm run build` at repo root. Confirm `dist/card-workspace-site/en/index.html`, `zh/index.html`, and each guide/reference path exist. Grep `src/` for forbidden claims. Spot-check splash HTML contains V2 section ids `why`, `boxes`, `install` and docs sidebar labels.
- **Failure behavior:** Broken internal links fail the Starlight build — fix the link in the owning content file. Font import errors — fix WP-01 imports, do not CDN.
- **Focused verification:**
  - **V11:** `npm run build` exits 0.
  - **V12:** Built files include `en/guides/card-boxes/index.html` and `zh/guides/card-boxes/index.html` (or Starlight’s equivalent slug output under `dist/`).
  - **V13:** `rg -n -i "infinite canvas|kanban|TODO\\[" src/` is empty.
- **Handoff:** Shippable `dist/`.

### Integration & verification

| ID | Contracts | WP | V |
| --- | --- | --- | --- |
| R1 | C1 | WP-01, WP-05 | V1, V2, V11 |
| R2 | C2 | WP-02, WP-05 | V3, V4, V5, V11 |
| R3 | C3, C4 | WP-03, WP-05 | V6–V9, V11, V12 |
| R4 | C5 | WP-04 | V10 |
| R5 | all | WP-05 | V11–V13 |

Commands (repo root `/home/kenan/Secret-Projects/card-workspace-site`):

```bash
npm install
npm run build
rg -n -i "infinite canvas|kanban|对齐网格|默认看板文件夹|snap to grid|TODO\\[" src/
rg -n "1348dc|2b7fff|fonts.googleapis|cwx" src/ package.json
```

Expected: build exit 0; greps empty (except intentional GitHub URLs). Manual: `npm run dev`, open `/card-workspace-site/en/` and `/card-workspace-site/zh/`, toggle Starlight theme and language, follow Getting started, open Settings and Card boxes.

### Assumptions & contingencies

1. **V2 landing status in `_d_meta.json` is `needs-review`.** User instruction to convert the live site to V2 is treated as approval to promote. Do not wait on a designs/ status flip.
2. **Install channel** remains GitHub Releases (plugin README). If the plugin is later listed in Community plugins, change only installation + landing install note; do not add that path in this execution.
3. **Plugin version** is `1.0.2`. If sibling `manifest.json` differs at execution, set the landing badge to that version string; do not invent changelog notes.
4. **No product screenshots** in either repo checkout. Placeholders ship. Dropping a real image into `src/assets/` later is out of scope unless the file already exists at execution; do not generate fake UI screenshots.
5. **`.agents/` untracked** remains user-owned.
6. **Username `kenanlian`** stays as currently configured.
7. **Fontsource Noto SC** packages exist at 5.3.0. If install fails, pin the latest 5.x of the same package names; still no CDN.
