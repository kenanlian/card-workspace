---
title: Browsing cards
description: Read contextual excerpts and local image previews, check tasks, search, sort, group, and pin cards.
tags: [card-workspace, guides/browsing]
workflow: [gather, organize]
---

The card stream is for scanning: read excerpts, keep scrolling, and open a promising note without losing the context around it.

## What a card shows

Every card shows a title. Markdown notes also get a readable excerpt, full-text search highlighting, and task progress when they contain checkboxes. `.base`, `.canvas`, and `.excalidraw` / `.excalidraw.md` cards use a title and placeholder; they are searched by title only.

Excerpts preserve light cues for headings, code, link text, list markers, and task checkboxes. They are a summary rather than a full Markdown reading view. Wikilink and Markdown link text is styled distinctly; clicking the card still opens that card’s note. Task checkboxes show their state; open the note to edit tasks.

Cards containing tasks show **completed / total** in the footer, such as `2/5`. Notes without tasks have no task footer. Completed and open tasks use aligned checkboxes in the excerpt.

If a Markdown note has no previewable text near the top, the card shows **No previewable text near the top.** Control the excerpt height with **Preview lines** in [Settings](../reference/settings.md).

Scrolling is virtualized, and excerpts load on demand. Content fills in progressively when you switch folders or first open a large source.

## Card images

From 1.3.4, Markdown cards can show the first supported local image embedded in the note body. **Right thumbnail** and **Crop to fill** are the defaults. Open **Settings → Card Workspace → Card images** to switch to **Below title** or **Off**; choose **Image fit → Show whole image** to see the image without cropping. The [Settings reference](../reference/settings.md#card-images) lists the layouts and dimensions.

Use a body embed such as `![[Attachments/photo.jpg]]` or `![Photo](../Attachments/photo.jpg)`. The attachment can be elsewhere in the vault; it need not be in the folder you are browsing. Images work on Markdown cards in folders, card boxes, and linked-note sources. Clicking an image opens its card’s note.

- Supported formats are local, static PNG, JPEG (`.jpg` / `.jpeg`), WebP, and BMP.
- Missing references and unsupported file extensions are skipped when choosing the first image. Remote URLs, frontmatter cover fields, HTML images, and embedded notes are not image sources. SVG, AVIF, GIF, and animated PNG/WebP are not displayed.
- If the selected image exceeds the limits or fails to load, the plugin does not try another attachment from the same note. Notes without a resolvable supported reference keep their normal text layout.

Only visible rows and one neighboring row on either side request thumbnails. First-time generation waits for visible text to load, so a large image may appear later than its excerpt. Once a supported reference and eligible file size are known, the card reserves the image area before loading; later validation or loading failures keep an unavailable placeholder of the same size. Loaded images fade in over 240 ms, or appear immediately with reduced motion enabled. Multiple columns remain aligned by rows while each card keeps its own height.

Thumbnails are cached locally and reused across restarts. Changing image layout, fit, preview lines, or the search query does not regenerate them. See [Image limits and local caching](../reference/limits-and-privacy.md#image-limits-and-local-caching) for size limits and unsupported-environment behavior.

## Hover preview and editor sync

Hover a title or excerpt while holding Obsidian’s Page Preview modifier (Ctrl or Cmd by default) to preview the note. Pin, bulk, and more-actions controls do not trigger the preview.

Click a card to open its note. Switch notes in the editor and a matching card is selected; a [linked-note source](./linked-notes.md) also follows the active note unless pinned.

## Search

The toolbar action **Toggle search** opens **Search notes** for the current folder, card box, outgoing-links source, or backlinks source. Matching text is highlighted on Markdown cards with a per-note hit count.

When the body contains a match, the excerpt starts near the first matching location instead of showing only the beginning of the note. A title-only match or an unavailable body location falls back to the ordinary excerpt. Clearing the query restores the source’s preview; see [Linked notes](./linked-notes.md) for link-context previews.

- An empty query shows the current source after any browse filters that apply to it.
- A non-empty query waits for the local index. Until it is ready, the panel reports that search is blocked.
- Markdown titles and bodies are indexed; frontmatter is not. Other supported card types use their title.
- Chinese search uses characters and adjacent character pairs, with mixed Chinese and English queries supported. Pinyin is not indexed.

The local index persists across restarts. An unchanged vault reuses it to avoid repeated rebuilds and writes; the first indexing pass still takes time. Recovery tools are documented under [Commands and menus](../reference/commands-and-menus.md).

## Sort and group

Open **Sort & group** on the toolbar. Sort cards by edited time, created time, or filename, in ascending or descending order.

Folder and linked-note sources use the global arrangement. A [card box](./card-boxes.md) keeps its own. Grouping options are:

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

Tag and property browse filters are available only in folder sources. Tags combine with AND, and parent tags include descendant tags. Property filters use OR inside one property and AND across properties.

Activating a non-empty tag filter clears the property filters; activating a non-empty property filter clears the tag filters. Ctrl/Cmd-click and Space add conditions within the same filter type. To keep reusable tag or property views, save [card-box membership rules](./card-boxes.md).

Card boxes and link-based streams do not apply either browse filter. Existing folder tag or property selections stay dormant there; when applicable, Card Workspace shows a paused-filter hint, and the selections resume when you return to a folder. A card box’s own membership rules can still include tag or property clauses.
