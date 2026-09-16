---
title: Settings
description: The six options shown in the Card Workspace settings tab.
tags: [card-workspace, reference/settings]
workflow: [organize]
---

The settings tab contains six preferences. Workspace state—active filters, visible properties, expanded navigation rows, section order, boxes, favorites, pins, and pane size—is remembered where relevant but is not presented as a separate setting.

| Setting key | Default | Name |
| --- | --- | --- |
| `defaultCardOpenBehavior` | `smart` | Default card open behavior |
| `dragInsertAction` | `ask` | Card drag insert behavior |
| `newNoteTemplate` | `tags-frontmatter` | New note content |
| `cardCornerRadius` | `rounded` | Card corner radius |
| `previewLines` | `5` (min 3, max 8) | Preview lines |
| `showNavItemCounts` | `false` | Show item counts in navigation |

The interface follows Obsidian’s language: Simplified Chinese when its language begins with `zh`, otherwise English.

## Default card open behavior

- **Current pane / current tab** (`smart`) — default
- **Open in new tab** (`new-tab`)
- **Open to the right** (`split-right`)
- **Open in new window** (`new-window`)

These options affect direct card clicks. Explicit destinations in the card menu are always available; see [Writing and organizing](../guides/writing-and-organizing.md).

## Card drag insert behavior

- **Ask every time** (`ask`) — default
- **Insert wiki link** (`wiki`)
- **Insert embed link** (`embed`)
- **Insert card content** (`content`)
- **Insert card title & content** (`title-content`)

## New note content

- **Start with a tags property** (`tags-frontmatter`) — default
- **Start blank** (`blank`)

## Card corner radius

- **Compact** (`compact`)
- **Softer** (`medium`)
- **Rounded** (`rounded`) — default

## Preview lines

Choose 3–8 normalized excerpt lines per Markdown card. The default is `5`; see [Browsing cards](../guides/browsing-cards.md).

## Show item counts in navigation

Show counts beside navigation rows. Folder counts follow the include-subfolders choice, tag counts include descendants, and property counts describe the current unfiltered source. The default is off.

Navigation section order is changed from each section header’s right-click menu, not from Settings. See [Navigation](../guides/navigation.md).
