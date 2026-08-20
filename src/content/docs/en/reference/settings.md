---
title: Settings
description: Settings shown in the Card Workspace settings tab.
---

These are the settings in **Settings → Card Workspace**. Other remembered state — boxes, favorites, pins, last folder, pane collapse — is not listed here; those live on the [navigation](/card-workspace-site/en/guides/navigation/), [card boxes](/card-workspace-site/en/guides/card-boxes/), and [writing](/card-workspace-site/en/guides/writing-and-organizing/) guides.

| Setting key | Default | Name |
| --- | --- | --- |
| `defaultCardOpenBehavior` | `smart` | Default card open behavior |
| `dragInsertAction` | `ask` | Card drag insert behavior |
| `newNoteTemplate` | `tags-frontmatter` | New note content |
| `cardCornerRadius` | `rounded` | Card corner radius |
| `previewLines` | `5` (min 3, max 8) | Preview lines |
| `showNavItemCounts` | `false` | Show item counts in navigation |

## Default card open behavior

Choose what happens when you click a card directly. Right-click menu actions stay available separately.

- **Current pane / current tab** (`smart`) — default
- **Open in new tab** (`new-tab`)
- **Open to the right** (`split-right`)
- **Open in new window** (`new-window`)

## Card drag insert behavior

Choose what happens when a card is dropped into a Markdown editor.

- **Ask every time** (`ask`) — default
- **Insert wiki link** (`wiki`)
- **Insert embed link** (`embed`)
- **Insert card content** (`content`)
- **Insert card title & content** (`title-content`)

## New note content

Choose what the toolbar’s create-note action writes into a new note: an empty tags property, or nothing at all.

- **Start with a tags property** (`tags-frontmatter`) — default
- **Start blank** (`blank`)

## Card corner radius

Adjust how square or rounded each card border feels in the panel.

- **Compact** (`compact`)
- **Softer** (`medium`)
- **Rounded** (`rounded`) — default

## Preview lines

Choose how many normalized summary lines each card preview can show (3–8). Default is `5`.

## Show item counts in navigation

Show how many cards each folder and tag contributes in the navigation pane. Folder counts follow the include-subfolders toggle, and tag counts include child tags. Off by default (`false`).
