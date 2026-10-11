# Homepage clips

The landing page's feature clips, rendered from Card Workspace's real Svelte
components rather than screen recordings. Each clip mounts the pinned plugin
release inside a captured Obsidian window, replays a timed scene against a demo
vault, and draws a cursor and short callouts on top with GSAP. Output goes to
`../src/assets/media/clips/`, which `Landing.astro` picks up by name.

| Clip | Shows |
| --- | --- |
| `hero` | Tag narrows the stream, a card opens its note, a link moves the selection |
| `gather` | Folder, tag, property value, then a folder dragged to the top |
| `images` | Right thumbnails switched to images below the title in settings |
| `links` | Backlinks by reference count, pinned source, jump to a citing passage |
| `search` | Query, highlighted excerpts and hit counts, jump to a hit |
| `drag` | A card dropped at the editor cursor and inserted as a wiki link |
| `boxes` | A tag view saved as a card box, then grouped by folder |
| `bulk` | Shift-click range selection merged through the preview dialog |

Every clip has a `zh` and an `en` version: light theme, 4:3, 60 fps, silent,
under 15 s, and looping (the tail cross-fades into the head).

## Setup

These inputs are git-ignored and have to exist locally:

- `theme/`: the captured Obsidian window (`workspace.html`, `obsidian.css`,
  `meta.json`, fonts). Obsidian's CSS and the fonts are not redistributable;
  copy `theme-zh/` from the `card-workspace-promo` project.
- `plugin-snapshots/<version>/`: run `npm run snapshot:plugin`, which exports
  the release named in `scripts/plugin-css.mjs` from the plugin checkout at
  `../../obsidian-card-workspace` (override with `PLUGIN_REPO`).

Then:

```bash
npm install
node scripts/build-vault.mjs   # data/vault.{zh,en}.json from data/vault-source.mjs
npm run dev                    # http://127.0.0.1:5180/clip.html?id=search&lang=en
```

## Working on a clip

Each clip is `src/clips/<id>/main.ts`: a `Director` scene (timed steps that click,
type, scroll, and drag through the panel's own handlers) plus a GSAP timeline
for the cursor and callouts. Shared pieces live in `src/stage/` (window shell,
demo hosts, editor and reading views) and `src/clip/` (frame, beats, helpers).
`src/shims/obsidian.ts` stands in for the `obsidian` module at runtime.

With the dev server running:

```bash
npm run check                                       # tsc
node scripts/frames.mjs <clip> <lang> 0.5,2,4       # tiled stills → renders/
SCALE=1 node scripts/frames.mjs <clip> <lang> 3     # full-size frame
POSTER=3.6 npm run render -- <clip> zh en           # MP4 + WebP poster
```

The poster defaults to a third of the way in; pick a frame that reads on its
own, since it is what reduced-motion visitors see.
