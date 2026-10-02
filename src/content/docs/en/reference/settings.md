---
title: Settings
description: The nine Card Workspace 1.3.4 settings, including card images, image fit, and link-location jumps.
tags: [card-workspace, reference/settings]
workflow: [organize]
---

The Card Workspace 1.3.4 settings tab contains nine preferences. Open **Settings → Card Workspace** in Obsidian to adjust them. Workspace state—active filters, visible properties, expanded navigation rows, section order, boxes, favorites, pins, and pane size—is remembered where relevant but is not presented as a separate setting.

| Setting key | Default | Name |
| --- | --- | --- |
| `defaultCardOpenBehavior` | `smart` | Default card open behavior |
| `dragInsertAction` | `ask` | Card drag insert behavior |
| `newNoteTemplate` | `tags-frontmatter` | New note content |
| `cardCornerRadius` | `rounded` | Card corner radius |
| `previewLines` | `5` (min 3, max 8) | Preview lines |
| `showNavItemCounts` | `false` | Show item counts in navigation |
| `locateLinkCardOnOpen` | `false` | Jump to link location when opening a link card |
| `cardImageMode` | `right` | Card images |
| `cardImageFit` | `cover` | Image fit |

The interface follows Obsidian’s language: Simplified Chinese when its language begins with `zh`, otherwise English. Obsidian 1.13 or later can find these options through settings search; older versions use the plugin’s settings tab.

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

## Jump to link location when opening a link card

Off by default. Enable it to open Markdown cards from a [linked-note source](../guides/linked-notes.md) at the link location shown in their excerpt. Backlinks jump to the reference to the source note; outgoing links with a heading or block reference jump to that target. An active search in a linked-note source takes priority and jumps to the matching text.

Folder and card-box cards are unaffected. If no usable location exists, the note opens normally.

With Remember Cursor Position enabled, an older position may appear briefly before the link location is restored. Other cursor-restoring plugins depend on their implementation. The jump may also become the position restored the next time you open that note.

## Card images

- **Off** (`off`) — keep the text-only layout.
- **Right thumbnail** (`right`) — default; an 88 × 88 CSS-pixel image beside the excerpt.
- **Below title** (`inline`) — an image spanning the card body, 160 CSS pixels high, above the excerpt.

Card images were added in 1.3.4. New installations and upgrades without a saved image preference use **Right thumbnail**; an explicitly saved choice is preserved. Markdown cards use the first supported local image embedded in the note body. Notes without one keep their normal text layout. See [Card images](../guides/browsing-cards.md#card-images) for supported references and loading behavior.

## Image fit

- **Show whole image** (`contain`) — preserve the whole image; empty space may remain around it.
- **Crop to fill** (`cover`) — default; fill the image area and crop any overflow.

This preference applies to both image layouts. Changing layout or fit reuses cached thumbnails without regenerating them.
