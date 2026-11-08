---
title: Settings
description: Card Workspace 1.5.3 settings pages for appearance, cards and previews, navigation, opening and dragging, new notes, quick input, and icons.
tags: [card-workspace, reference/settings]
workflow: [organize]
---

Open **Settings → Card Workspace** in Obsidian. Starting with 1.5.3, the tab is a list of seven pages; select one to open it, and use **Back** to return:

1. [Interface appearance](#interface-appearance) — fonts, spacing, card styles, and colors
2. [Cards and previews](#cards-and-previews) — file types, excerpts, images, and hover previews
3. [Navigation](#navigation) — sections, item counts, and hidden entries
4. [Opening and dragging](#opening-and-dragging) — card opening, link locations, and editor insertion
5. [New notes and templates](#new-notes-and-templates) — initial content, destinations, and template storage
6. [Quick input](#quick-input) — saving rules, input fields, window, and shortcut
7. [Default icons](#default-icons) — icons for navigation entries and file cards

The interface follows Obsidian’s language: Simplified Chinese when its language begins with `zh`, otherwise English. Obsidian 1.13 or later finds these options through settings search and uses native confirmation dialogs. Obsidian 1.11.4 through 1.12 shows the same pages and uses the plugin’s compatible dialogs. See [Limits and privacy](./limits-and-privacy.md) for the version requirement.

Active filters, visible properties, expanded rows, section order, folder and navigation sort order, search history, boxes, favorites, pins, and pane size are remembered where relevant. Display preferences are stored per device; see [Device-local settings](./limits-and-privacy.md#device-local-settings). On phones and tablets, settings that only apply to desktop are hidden.

## Interface appearance

| Setting | Key | Default | Group |
| --- | --- | --- | --- |
| Font size | `uiFontSize` | `default` | Text and spacing |
| Density | `uiDensity` | `default` | Text and spacing |
| Card style | `cardStyle` | `default` | Card style |
| Card corner radius | `cardCornerRadius` | `rounded` | Card style |
| Default card background color | `cardBackgroundColor` | `theme` | Card style |

- **Font size** — **Small**, **Default**, **Large**, or **Extra large**, relative to Obsidian’s interface font size. Applies to cards, the toolbar, and navigation.
- **Density** — **Compact**, **Default**, or **Comfortable** spacing between and inside cards, and for navigation rows and the search box.
- **Card style** — **Default cards**, **Minimal outline**, **List**, **Flat**, or **Accent bar**.
- **Card corner radius** — **Compact**, **Softer**, or **Rounded**. Hidden for the List style.
- **Default card background color** — **Follow theme**, or one of eight presets (red, orange, yellow, green, cyan, blue, purple, pink) that adapt to light and dark themes. Applies to cards without their own color.

See [Appearance and icons](../guides/appearance.md).

## Cards and previews

| Setting | Key | Default | Group |
| --- | --- | --- | --- |
| Show file types | `fileVisibility` | `supported` | Displayed content |
| Preview lines | `previewLines` | `5` (min 0, max 8) | Displayed content |
| Default backlink reference snippets | `backlinkSnippetCount` | `3` | References and search |
| Maximum search hit snippets in each card preview | `searchPreviewSnippetCount` | `2` (min 1, max 5) | References and search |
| Card images | `cardImageMode` | `right` | Images |
| Image fit | `cardImageFit` | `cover` | Images |
| Card hover preview width | `hoverPreviewWidth` | `600` (min 320, max 1600) | Hover preview |
| Card hover preview height | `hoverPreviewHeight` | `400` (min 200, max 1200) | Hover preview |

### Show file types

- **Documents only** (`documents`) — Markdown, Base, Canvas, and Excalidraw
- **Common formats** (`supported`) — default; documents plus formats registered by Obsidian and installed plugins
- **All formats** (`all`) — every file in the vault; formats Obsidian cannot open use an external app

Applies to folders, card boxes, and linked-note sources. Refresh Card Workspace after changing plugins that register file types. See [File types](../guides/browsing-cards.md#file-types).

### Preview lines

Choose 0–8 normalized excerpt lines per Markdown card. The default is `5`. **0** hides the ordinary excerpt so the card stays compact; search hit snippets still appear. See [Browsing cards](../guides/browsing-cards.md).

### Default backlink reference snippets

Choose how many backlink contexts a card shows before you expand the rest:

- **1**, **2**, or **3** — **3** is the default
- **All** (`all`) — show every reference context

Each card can still expand or collapse the remaining contexts. See [Linked notes](../guides/linked-notes.md).

### Maximum search hit snippets in each card preview

Choose 1–5 body hit snippets per card during search. The default is `2`. Each snippet uses two display lines and the same lightweight list, task, heading, code, and link cues as an ordinary excerpt. See [Search](../guides/browsing-cards.md#search).

### Card images

- **Off** (`off`) — keep the text-only layout.
- **Right thumbnail** (`right`) — default; an 88 × 88 CSS-pixel image beside the excerpt.
- **Below title** (`inline`) — an image spanning the card body, 160 CSS pixels high, above the excerpt.

Markdown cards use the first supported local image embedded in the note body; image files use their own thumbnail. Notes without one keep their normal text layout. Canvas and Excalidraw diagrams are not affected by this setting. See [Card images](../guides/browsing-cards.md#card-images) for supported formats and loading behavior.

**Image fit** chooses **Crop to fill** (`cover`, default) or **Show whole image** (`contain`). It applies to both image layouts and is hidden while **Card images** is **Off**. Changing layout or fit reuses cached thumbnails without regenerating them.

### Card hover preview size

- **Card hover preview width** — 320–1600 pixels, in steps of 10. The default is `600`.
- **Card hover preview height** — 200–1200 pixels, in steps of 10. The default is `400`.

These sizes apply to page previews opened from cards and shrink to fit the window. They require Obsidian’s **Page preview** core plugin. See [Hover preview and editor sync](../guides/browsing-cards.md#hover-preview-and-editor-sync).

## Navigation

| Setting | Key | Default | Group |
| --- | --- | --- | --- |
| Show Favorites, Folders, Tags, Properties, Card boxes, Links, Templates | `hiddenNavSections` | all shown | Visible sections |
| Show item counts in navigation | `showNavItemCounts` | `false` | Navigation entries |
| Hidden folders | `hiddenFolderPaths` | none | Navigation entries |
| Hidden tags | `hiddenTagPaths` | none | Navigation entries |

This page hides entries in the navigation column only. Cards, search, filters, and existing favorites stay available.

- **Show …** — one switch per section, on by default. Turning one off writes that section into `hiddenNavSections`.
- **Show item counts in navigation** — show counts beside navigation rows. Folder counts follow the include-subfolders choice, tag counts include descendants, and property counts describe the current unfiltered source.
- **Hidden folders** and **Hidden tags** — **Manage** opens a vault-wide list. Search it, hide or restore matches, or restore everything. A child hidden by its parent asks you to restore the parent first. Entries the vault no longer contains stay listed until you restore them.

The rules are shared by every Card Workspace view, saved across restarts, and follow folder moves, folder renames, and tag renames made inside the plugin. Right-click menus can hide a single folder, tag, or section; this page is where you restore them. Section order is changed from each section header’s right-click menu. See [Hide navigation entries](../guides/navigation.md#hide-navigation-entries).

## Opening and dragging

| Setting | Key | Default | Group |
| --- | --- | --- | --- |
| Default card open behavior | `defaultCardOpenBehavior` | `smart` | Card opening |
| Jump to link location when opening a link card | `locateLinkCardOnOpen` | `false` | Card opening |
| Card drag insert behavior | `dragInsertAction` | `ask` | Drag insertion |
| Enable section drag insertion | `enableHeadingDragInsert` | `false` | Drag insertion |

### Default card open behavior

- **Current pane / current tab** (`smart`) — default
- **Open in new tab** (`new-tab`)
- **Open to the right** (`split-right`)
- **Open in new window** (`new-window`) — desktop only

These options affect direct card clicks. Explicit destinations in the card menu are always available; see [Writing and organizing](../guides/writing-and-organizing.md).

### Jump to link location when opening a link card

Off by default. Enable it to open Markdown cards from a [linked-note source](../guides/linked-notes.md) at the link location shown in their excerpt. Backlinks jump to the reference to the source note; outgoing links with a heading or block reference jump to that target. An active search in a linked-note source takes priority and jumps to the matching text.

Folder and card-box cards are unaffected. If no usable location exists, the note opens normally.

With Remember Cursor Position enabled, an older position may appear briefly before the link location is restored. Other cursor-restoring plugins depend on their implementation. The jump may also become the position restored the next time you open that note.

### Card drag insert behavior

- **Ask every time** (`ask`) — default
- **Insert wiki link** (`wiki`)
- **Insert embed link** (`embed`)
- **Insert card content** (`content`)
- **Insert card title & content** (`title-content`)

Desktop only; on phones and tablets, the card menu offers each action directly.

### Enable section drag insertion

Off by default. Turn it on to choose a heading section when dropping a Markdown card. The drop uses the selected drag insert behavior, and whole-note insertion stays available. Section content includes nested headings and stops at the next heading of the same or higher level; the inserted Markdown is copied as written. See [Insert a heading section](../guides/writing-and-organizing.md#insert-a-heading-section).

## New notes and templates

| Setting | Key | Default | Group |
| --- | --- | --- | --- |
| New note content | `newNoteTemplate` | `blank` | New notes |
| Folder for new notes in card boxes | `boxNewNoteFolderPath` | vault root | New notes |
| Template storage folder | `templateStorageFolder` | `Card Workspace Templates` | Template files |

- **New note content** — what the toolbar **New** button writes into a new note: **Start blank** (`blank`, default) or **Start with a tags property** (`tags-frontmatter`).
- **Folder for new notes in card boxes** — notes created from a card box are saved here and added to that box. Leave empty or enter `/` for the vault root.
- **Template storage folder** — holds every template file. Choose a folder and select **Apply** or press Enter to move existing templates there, keeping their filenames and content. A missing folder is created; conflicting files are never overwritten.

See [Quick input and templates](../guides/quick-input-and-templates.md).

## Quick input

| Setting | Key | Default | Group |
| --- | --- | --- | --- |
| Quick input folder | `quickInput.folderPath` | vault root | Saving and appending |
| When the title already exists | `quickInput.duplicateTitle` | `ask` | Saving and appending |
| Append position | `quickInput.insertPosition` | `end` | Saving and appending |
| Show title, Show folder selector, Show card box selector, Show add tags, Show add property | `quickInputVisibility` | all on | Input fields |
| Quick input width | `quickInputWidth` | `480` (min 320, max 1200) | Window appearance |
| Quick input height | `quickInputHeight` | `400` (min 200, max 800) | Window appearance |
| Quick input frame color | `quickInputColor` | `random` | Window appearance |
| Quick input corner radius | `quickInputCornerRadius` | `rounded` | Window appearance |
| Global quick input shortcut | `quickInputGlobalShortcut` | none | Shortcut |

- **Quick input folder** — where new notes are saved unless a draft picks another folder. Without a title, each send creates a separate note such as `quick-note 2026-10-17 14-30-05.md`.
- **When the title already exists** — **Ask each time** (`ask`, default), **Append to the existing note** (`append`), or **Create a new note with a number** (`number`). Appending adds only the draft body; the note keeps its own properties.
- **Append position** — **Start of body (after properties)** (`start`) or **End of note** (`end`, default). Hidden when same-title notes are always numbered.
- **Input fields** — five switches for new drafts. Hiding a control does not disable it; **Ctrl+;** still adds a property.
- **Width** and **height** — the size of each new draft in pixels. Resizing a draft only affects that draft.
- **Frame color** — **Random** (a different theme color for each new draft), **Accent color**, **Theme primary background**, **Theme secondary background**, or one of eight fixed colors.
- **Corner radius** — **Compact**, **Softer**, or **Rounded**.
- **Global quick input shortcut** — empty by default. Press a combination or enter an Electron accelerator such as `Control+Shift+Q`, then select **Apply**. **Clear** removes it.

Width, height, frame color, and the global shortcut are desktop only. The page is hidden where quick input is unavailable. See [Quick input](../guides/quick-input-and-templates.md#quick-input).

## Default icons

This page has two groups. **Default navigation icons** covers folders, tags, property names, property values, card boxes, backlinks, outgoing links, and templates. **Default card icons** covers Markdown, Base, Canvas, Excalidraw, image, PDF, audio, video, and other file cards.

Select a category’s button to choose a Lucide icon, an emoji, or **No icon**. The reset button beside a customized category restores its built-in icon. Icons chosen directly on an entry or card take priority over these defaults. Defaults are stored in `iconDefaults`. See [Custom icons](../guides/appearance.md#custom-icons).
