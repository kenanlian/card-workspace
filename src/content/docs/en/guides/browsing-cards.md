---
title: Browsing cards
description: Read contextual excerpts, image and diagram previews, check tasks, search, sort, group, and pin cards.
tags: [card-workspace, guides/browsing]
workflow: [gather, organize]
---

The card stream is for scanning: read excerpts, keep scrolling, and open a promising note without losing the context around it.

## What a card shows

Every card shows a title. Markdown notes also get a readable excerpt, full-text search highlighting, and task progress when they contain checkboxes. Other file types depend on the kind of file:

| File | Card content |
| --- | --- |
| Markdown (`.md`) | Excerpt, task progress, optional image, full-text search |
| Canvas (`.canvas`) | A small diagram of nodes, connections, and labels |
| Excalidraw (`.excalidraw`, `.excalidraw.md`) | The SVG exported beside the drawing |
| Base (`.base`) | Title and placeholder |
| Images | A thumbnail that follows the **Card images** setting |
| PDF, audio, video, and other files | A type icon and the file extension; no preview or player |

Everything except Markdown is searched by title only. Which file types appear at all is controlled by **Show file types**; see [File types](#file-types).

Excerpts preserve light cues for headings, code, link text, list markers, and task checkboxes. They are a summary rather than a full Markdown reading view. Wikilink and Markdown link text is styled distinctly; clicking the card still opens that card’s note. Task checkboxes show their state; open the note to edit tasks.

Cards containing tasks show **completed / total** in the footer, such as `2/5`. Notes without tasks have no task footer. Completed and open tasks use aligned checkboxes in the excerpt.

If a Markdown note has no previewable text near the top, the card shows **No previewable text near the top.** Control the excerpt height with **Preview lines** in [Settings](../reference/settings.md): 0–8 lines, default 5. **0** hides the ordinary excerpt; a search with body hits still shows its snippets.

Scrolling is virtualized, and excerpts load on demand. Content fills in progressively when you switch folders or first open a large source.

Card style, background color, title icons, font size, and spacing are covered in [Appearance and icons](./appearance.md).

## File types

**Show file types** in **Settings → Card Workspace → Cards and previews** decides which files become cards in folders, card boxes, and linked-note sources:

- **Documents only** — Markdown, Base, Canvas, and Excalidraw
- **Common formats** — default; documents plus the formats registered by Obsidian and installed plugins, such as images, PDF, audio, and video
- **All formats** — every file the vault exposes, including unknown extensions and files without an extension

Refresh Card Workspace after enabling or disabling a plugin that registers file types. Changing the setting hides or reveals cards without removing favorites, pins, or manual card-box members. Files Obsidian can open, open inside Obsidian; other formats open in the system’s default application. The setting does not change Obsidian’s own file list, and hidden folders are never scanned.

## Diagram previews

Canvas cards draw text, file, link, and group nodes and their connections from the canvas file. Referenced files and web links are not loaded.

Excalidraw cards show an SVG exported next to the drawing: `Drawing.svg` or `Drawing.excalidraw.svg`. If neither exists, turn on SVG auto-export in the Excalidraw plugin, then edit and save the drawing once, or export an SVG by hand. Turning on auto-export alone does not create exports for existing drawings. The drawing’s background is removed in the preview so it matches the card.

Diagrams always appear below the title at full size, independently of the card image settings. Canvas files and SVG exports larger than 512 KiB show a message instead, and a canvas preview draws at most 200 nodes and 400 connections.

## Card images

Markdown cards can show the first supported local image embedded in the note body, and image files show their own thumbnail. **Right thumbnail** and **Crop to fill** are the defaults. Open **Settings → Card Workspace → Cards and previews** to switch **Card images** to **Below title** or **Off**; choose **Image fit → Show whole image** to see the image without cropping. The [Settings reference](../reference/settings.md#card-images) lists the layouts and dimensions.

Use a body embed such as `![[Attachments/photo.jpg]]` or `![Photo](../Attachments/photo.jpg)`. The attachment can be elsewhere in the vault; it need not be in the folder you are browsing. Images work on cards in folders, card boxes, and linked-note sources. Clicking an image opens its card’s file.

- Supported formats are local AVIF, BMP, GIF, JPEG (`.jpg` / `.jpeg`), PNG, SVG, and WebP. Animated images show their first frame.
- Missing references and unsupported file extensions are skipped when choosing the first image. Remote URLs, frontmatter cover fields, HTML images, and embedded notes are not image sources.
- If the selected image exceeds the limits or fails to load, the plugin does not try another attachment from the same note. Notes without a resolvable supported reference keep their normal text layout.

Only visible rows and one neighboring row on either side request thumbnails. First-time generation waits for visible text to load, so a large image may appear later than its excerpt. Once a supported reference and eligible file size are known, the card reserves the image area before loading; later validation or loading failures keep an unavailable placeholder of the same size. Loaded images fade in over 240 ms the first time they appear, or appear immediately with reduced motion enabled. A later refresh does not replay that fade, and editing the note keeps the thumbnail while its image reference stays the same. Multiple columns remain aligned by rows while each card keeps its own height.

Thumbnails are cached locally and reused across restarts. Changing image layout, fit, preview lines, or the search query does not regenerate them. See [Image limits and local caching](../reference/limits-and-privacy.md#image-limits-and-local-caching) for size limits and unsupported-environment behavior.

## Hover preview and editor sync

Hover a title or excerpt while holding Obsidian’s Page Preview modifier (Ctrl or Cmd by default) to preview the note. Pin, bulk, and more-actions controls do not trigger the preview. With the **Page preview** core plugin enabled, **Card hover preview width** and **Card hover preview height** in [Settings](../reference/settings.md#card-hover-preview-size) default to 600 × 400 pixels and shrink to fit the window.

Click a card to open its note. Switch notes in the editor and a matching card is selected; a [linked-note source](./linked-notes.md) also follows the active note unless pinned.

## Search

The toolbar action **Toggle search** opens **Search notes** for the current folder, card box, outgoing-links source, or backlinks source. Matching text is highlighted on Markdown cards, and each card keeps its hit count.

Body hits appear as separate snippets in source order, using the same lightweight list, task, heading, code, and link cues as an ordinary excerpt. Each snippet occupies two lines. [Settings](../reference/settings.md#maximum-search-hit-snippets-in-each-card-preview) chooses how many snippets a card shows: 1–5, default 2. Overlapping contexts are merged, and a short hit line continues into the following prose. Click a snippet, or press Enter or Space while it is focused, to open that hit in the note’s current editing or reading mode.

A title-only match highlights the title and keeps the opening excerpt. Clearing the query restores the source’s preview; see [Linked notes](./linked-notes.md) for link-context previews.

**Search history** remembers the 30 most recent queries across card views. While you type, it offers up to six matching entries. Delete one entry, or choose **Clear history**. Closing search or clearing the query stores the current text first. Suggestions stay hidden when nothing in the history matches.

- An empty query shows the current source after any browse filters that apply to it.
- A non-empty query waits for the local index. Until it is ready, the panel reports that search is blocked.
- Markdown titles and bodies are indexed; frontmatter is not. Every other file type is matched by title only, and its contents are never read for indexing.
- Chinese search uses characters and adjacent character pairs, with mixed Chinese and English queries supported. Pinyin is not indexed.

The local index persists across restarts. An unchanged vault reuses it to avoid repeated rebuilds and writes; the first indexing pass still takes time. Recovery tools are documented under [Commands and menus](../reference/commands-and-menus.md).

## Sort and group

Open **Sort & group** on the toolbar. Folder cards sort by edited time, created time, or filename, in ascending or descending order. Outgoing links and backlinks add **Reference count** and each remember their own sort; both default to reference count, highest first. See [Linked notes](./linked-notes.md).

Folder sources share one global grouping. A [card box](./card-boxes.md) keeps its own sort and grouping. Grouping options are:

- **Folder** — group by the note’s parent folder.
- **Tag** — group by the complete tag set, rather than the first tag. `#research` and `#research #draft` form different groups; the order of tags within the same set does not matter.
- **Task status** — **Incomplete tasks**, **All tasks complete**, and **No tasks**.
- **Property** — group by an enabled frontmatter property; see [Property filters](./property-filters.md) for the steps.
- **Card box rule** — available only inside a box. A note matching several rules belongs to the first matching rule; manually added notes that match no rule enter **Manually added**.

Order groups by the default sequence, name, or card count, ascending or descending. Headers show the grouping dimension, values, and count, and can be collapsed individually; the menu can collapse or expand all groups. While scrolling through a long group, its header stays at the top of the card stream until that group leaves the viewport.

## Pins

Use **Pin note** or **Unpin note** on a card to prioritize it in the current arrangement. Pins do not bypass search or any browse filters that apply to the source; they only reorder cards that already match. With grouping enabled, pinned notes stay in their group and appear first within it.

Folder and linked-note sources share global pins. Every card box has its own pinned list.

## Browse filters

Tag and property browse filters narrow folder and card-box sources. Tags combine with AND, and parent tags include descendant tags. Property filters use OR inside one property and AND across properties.

Activating a non-empty tag filter clears the property filters; activating a non-empty property filter clears the tag filters. Ctrl/Cmd-click and Space add conditions within the same filter type. The toolbar shows how many filters are active and offers **Clear filters**, which keeps the search query. To keep reusable tag or property views, save [card-box membership rules](./card-boxes.md).

Conditions stay in place when you switch between folders and boxes. In a card box they only narrow what you see; the box’s rules, members, and member count do not change. Link-based streams do not apply either browse filter: the selections stay dormant, Card Workspace shows a paused-filter hint, and they resume when you return to a folder or box.
