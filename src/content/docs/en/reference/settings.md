---
title: Settings
description: Card Workspace 1.4.3 settings for opening cards, previews, images, hover size, and navigation visibility.
tags: [card-workspace, reference/settings]
workflow: [organize]
---

The Card Workspace 1.4.3 settings tab is grouped into **Behavior**, **Appearance**, and **Navigation**. Open **Settings → Card Workspace** in Obsidian to adjust them. Active filters, visible properties, expanded rows, section order, folder and navigation sort order, search history, boxes, favorites, pins, and pane size are remembered where relevant. Hidden folders, hidden tags, and section visibility are managed in the Navigation group.

| Setting key | Default | Name | Group |
| --- | --- | --- | --- |
| `defaultCardOpenBehavior` | `smart` | Default card open behavior | Behavior |
| `locateLinkCardOnOpen` | `false` | Jump to link location when opening a link card | Behavior |
| `dragInsertAction` | `ask` | Card drag insert behavior | Behavior |
| `enableHeadingDragInsert` | `false` | Enable section drag insertion | Behavior |
| `newNoteTemplate` | `tags-frontmatter` | New note content | Behavior |
| `cardCornerRadius` | `rounded` | Card corner radius | Appearance |
| `previewLines` | `5` (min 0, max 8) | Preview lines | Appearance |
| `backlinkSnippetCount` | `3` | Default backlink reference snippets | Appearance |
| `searchPreviewSnippetCount` | `2` (min 1, max 5) | Maximum search hit snippets in each card preview | Appearance |
| `cardImageMode` | `right` | Card images | Appearance |
| `cardImageFit` | `cover` | Image fit | Appearance |
| `showNavItemCounts` | `false` | Show item counts in navigation | Appearance |
| `hoverPreviewWidth` | `600` (min 320, max 1600) | Card hover preview width | Appearance |
| `hoverPreviewHeight` | `400` (min 200, max 1200) | Card hover preview height | Appearance |

The interface follows Obsidian’s language: Simplified Chinese when its language begins with `zh`, otherwise English. Obsidian 1.13 or later finds these options through settings search and uses native confirmation dialogs. Obsidian 1.11.4 through 1.12 shows the same settings and uses the plugin’s compatible dialogs. See [Limits and privacy](./limits-and-privacy.md) for the version requirement.

## Default card open behavior

- **Current pane / current tab** (`smart`) — default
- **Open in new tab** (`new-tab`)
- **Open to the right** (`split-right`)
- **Open in new window** (`new-window`)

These options affect direct card clicks. Explicit destinations in the card menu are always available; see [Writing and organizing](../guides/writing-and-organizing.md).

## Jump to link location when opening a link card

Off by default. Enable it to open Markdown cards from a [linked-note source](../guides/linked-notes.md) at the link location shown in their excerpt. Backlinks jump to the reference to the source note; outgoing links with a heading or block reference jump to that target. An active search in a linked-note source takes priority and jumps to the matching text.

Folder and card-box cards are unaffected. If no usable location exists, the note opens normally.

With Remember Cursor Position enabled, an older position may appear briefly before the link location is restored. Other cursor-restoring plugins depend on their implementation. The jump may also become the position restored the next time you open that note.

## Card drag insert behavior

- **Ask every time** (`ask`) — default
- **Insert wiki link** (`wiki`)
- **Insert embed link** (`embed`)
- **Insert card content** (`content`)
- **Insert card title & content** (`title-content`)

## Enable section drag insertion

Off by default. Turn it on to choose a heading section when dropping a Markdown card. The drop uses the selected drag insert behavior, and whole-note insertion stays available. Section content includes nested headings and stops at the next heading of the same or higher level; the inserted Markdown is copied as written. See [Insert a heading section](../guides/writing-and-organizing.md#insert-a-heading-section).

## New note content

- **Start with a tags property** (`tags-frontmatter`) — default
- **Start blank** (`blank`)

## Card corner radius

- **Compact** (`compact`)
- **Softer** (`medium`)
- **Rounded** (`rounded`) — default

## Preview lines

Choose 0–8 normalized excerpt lines per Markdown card. The default is `5`. **0** hides the ordinary excerpt so the card stays compact; search hit snippets still appear. See [Browsing cards](../guides/browsing-cards.md).

## Default backlink reference snippets

Choose how many backlink contexts a card shows before you expand the rest:

- **1**, **2**, or **3** — **3** is the default
- **All** (`all`) — show every reference context

Each card can still expand or collapse the remaining contexts. See [Linked notes](../guides/linked-notes.md).

## Maximum search hit snippets in each card preview

Choose 1–5 body hit snippets per card during search. The default is `2`. Each snippet uses two display lines and the same lightweight list, task, heading, code, and link cues as an ordinary excerpt. See [Search](../guides/browsing-cards.md#search).

## Card images

- **Off** (`off`) — keep the text-only layout.
- **Right thumbnail** (`right`) — default; an 88 × 88 CSS-pixel image beside the excerpt.
- **Below title** (`inline`) — an image spanning the card body, 160 CSS pixels high, above the excerpt.

Card images were added in 1.3.4. New installations and upgrades without a saved image preference use **Right thumbnail**; an explicitly saved choice is preserved. Markdown cards use the first supported local image embedded in the note body. Notes without one keep their normal text layout. See [Card images](../guides/browsing-cards.md#card-images) for supported references and loading behavior.

## Image fit

- **Show whole image** (`contain`) — preserve the whole image; empty space may remain around it.
- **Crop to fill** (`cover`) — default; fill the image area and crop any overflow.

This preference applies to both image layouts and is hidden while **Card images** is **Off**. Changing layout or fit reuses cached thumbnails without regenerating them.

## Show item counts in navigation

Show counts beside navigation rows. Folder counts follow the include-subfolders choice, tag counts include descendants, and property counts describe the current unfiltered source. The default is off.

Navigation section order is changed from each section header’s right-click menu, not from Settings. See [Navigation](../guides/navigation.md).

## Card hover preview size

- **Card hover preview width** — 320–1600 pixels, in steps of 10. The default is `600`.
- **Card hover preview height** — 200–1200 pixels, in steps of 10. The default is `400`.

These sizes apply to page previews opened from cards and shrink to fit the window. They require Obsidian’s **Page preview** core plugin. See [Hover preview and editor sync](../guides/browsing-cards.md#hover-preview-and-editor-sync).

## Navigation visibility

The Navigation group hides entries in the navigation column. Cards, search, filters, and existing favorites stay available.

- **Show Favorites**, **Show Folders**, **Show Tags**, **Show Properties**, **Show Card boxes**, and **Show Links** — on by default. Turning one off writes that section into `hiddenNavSections`.
- **Hidden folders** and **Hidden tags** — **Manage** opens a vault-wide list. Search it, hide or restore matches, or restore everything. A child hidden by its parent asks you to restore the parent first. Entries the vault no longer contains stay listed until you restore them.

The same rules are shared by every Card Workspace view, saved across restarts, and follow folder moves, folder renames, and tag renames made inside the plugin. Right-click menus can hide a single folder, tag, or section; this group is where you restore them. See [Hide navigation entries](../guides/navigation.md#hide-navigation-entries).
