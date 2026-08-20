# Execution state: V2 site design and bilingual product-docs draft

Plan: `docs/plan/v2-site-and-docs-plan.md`
Plan SHA-256: `4ac6b731fa8d6d3d79ea5867013ce6e0fb4034058ac3dca69886c13704b19199`
Started: `2026-08-20 08:06:57 +0800`
Updated: `2026-08-20 08:31:00 +0800`
Status: `completed`

## Baseline

- Commit: `608ba080cff893e13e7eb3bf71864721f60920ac`
- Relevant pre-existing changes: `?? .agents/` (user-owned; do not stage or rewrite). `?? docs/` is the plan tree created after the baseline commit; keep the plan immutable and treat the new execution-state file as expected.
- Drift decision: No material drift. Commit, `astro.config.mjs` (`site`, `base`, `locales`, `customCss`, `logo`), `src/styles/theme.css`, Starlight `0.41.4`, Astro `7.1.3`, and sibling plugin `manifest.json` version `1.0.2` match the plan. Local Node is `v24.5.0` (CI remains Node 22); not material. Landing badge uses `1.0.2` (Assumption 3).

## Work packages

| ID | Status | Executor | Changed files | Focused verification |
| --- | --- | --- | --- | --- |
| WP-01 | verified | subagent `02c4487c-855a-49ae-8e47-83117f0124fc` | `package.json`, `package-lock.json`, `src/styles/theme.css`, `src/styles/tokens.css` | V1 empty; V2 fonts listed and imported. Dark-first Graphite tokens confirmed. |
| WP-02 | verified | subagent `be47426a-08bf-40f7-b75f-e5e63e5893ca` | `src/components/landing/**`, `src/styles/landing.css`, `src/content/landing.ts`, `src/content/docs/{en,zh}/index.mdx` | V3 splash + `<Landing`; V4 CTA URLs, no `TODO[`; V5 no cwx/prefs/googleapis. |
| WP-03 | verified | subagent `30b4dd65-259a-4e66-8509-4dd059fdee77` | `astro.config.mjs` (description + sidebar only); 20 guide/reference markdown files | V6 empty on guides/reference; V7 10×2 pages + sidebar; V8 six settings keys; V9 Releases + `plugins/card-workspace/`. Site-wide V6 still hits excluded `en/index.mdx` until WP-02. |
| WP-04 | verified | main | `AGENTS.md`, `README.md` | V10: stale “100% Starlight default” / “no custom Astro” gone; both files mention `guides/card-boxes` and `src/styles/`. |
| WP-05 | verified | main | none (verification only) | V11 `npm run build` exit 0 (24 pages). V12 `dist/{en,zh}/guides/card-boxes/index.html` exist. V13 forbidden greps empty. Splash HTML has `#why` `#boxes` `#install`. |

Package status is one of `pending`, `in-progress`, `verified`, or `blocked`.

## Deviations and blockers

- WP-01: Noto SC imported as latin + chinese-simplified 400/500 (allowed failure path). Extra `@font-face` aliases map fontsource-variable faces onto C1 names `'Petrona'` / `'Archivo'`. Additive `--cw-font-ui` and interpolated `--sl-color-gray-*`. Not material.
- WP-03: Introduction avoids the forbidden literals “kanban/infinite canvas” while keeping the C4 meaning. Startup restore described without internal field names. Not material.

## Integration and final verification

- `npm run build` → exit 0; 24 pages; Starlight pagefind indexed 24 HTML files. Warning `Entry docs → 404 was not found` is Starlight’s missing 404 content entry (pre-existing pattern), not a broken internal link.
- Built routes: `dist/en/index.html`, `dist/zh/index.html`, and all 10 guide/reference slugs per locale under `dist/{en,zh}/` (Astro emits at `dist/en/…`, not `dist/card-workspace-site/en/…`; URLs still use `base` `/card-workspace-site`).
- `rg -n -i "infinite canvas|kanban|TODO\\[" src/` → empty.
- `rg -n "1348dc|2b7fff|fonts.googleapis|cwx" src/ package.json` → empty.
- Spot-check: EN/ZH splash contain section ids `why`, `nav`, `boxes`, `flow`, `scale`, `install`; `h1#_top` remains; `.cw-footer` plus hidden Starlight `footer.sl-flex`; sidebar groups Getting started / Using Card Workspace / Reference (ZH: 开始使用 / 使用指南 / 参考).

## Review gate

- User choice: `skip`
- Conformance review: Not selected
- Patch review: Not selected

## Completion

- V2 Graphite Index is on Starlight chrome; EN/ZH splash pages render the V2 landing stream; ten bilingual doc slugs plus sidebar ship; `AGENTS.md`/`README.md` match the new IA. `npm run build` exit 0. Review skipped by user.
- Residual: no product screenshots (placeholders only, per Assumption 4). Starlight splash pagination footer remains in the DOM and is CSS-hidden. Hero image slots are static placeholders. `designs/` is unchanged and not deployed. `.agents/` remains user-owned and unstaged.
