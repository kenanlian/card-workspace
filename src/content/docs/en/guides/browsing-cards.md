---
title: Browsing cards
description: Scan, search, sort, group, and pin cards from folders, boxes, or linked notes.
tags: [card-workspace, guides/browsing]
workflow: [gather, organize]
---

The card stream is for scanning: read excerpts, keep scrolling, and open a promising note without losing the context around it.

## What a card shows

Every card shows a title. Markdown notes also get a readable excerpt, full-text search highlighting, and a task footer when they contain checkboxes. `.base`, `.canvas`, and `.excalidraw` / `.excalidraw.md` cards use a title and placeholder; they are searched by title only.

If a Markdown note has no previewable text near the top, the card shows **No previewable text near the top.** Control the excerpt height with **Preview lines** in [Settings](../reference/settings.md).

Scrolling is virtualized, so only the visible part of a large source is rendered.

## Hover preview and editor sync

Hover a title or excerpt while holding Obsidian’s Page Preview modifier (Ctrl or Cmd by default) to preview the note. Pin, bulk, and more-actions controls do not trigger the preview.

Click a card to open its note. Switch notes in the editor and a matching card is selected; a [linked-note source](./linked-notes.md) also follows the active note unless pinned.

## Search

The toolbar action **Toggle search** opens **Search notes** for the current folder, card box, outgoing-links source, or backlinks source. Matching text is highlighted on Markdown cards with a per-note hit count.

- An empty query shows the current source after any browse filters that apply to it.
- A non-empty query waits for the local index. Until it is ready, the panel reports that search is blocked.
- Markdown titles and bodies are indexed; frontmatter is not. Other supported card types use their title.
- Chinese search uses characters and adjacent character pairs. Pinyin is not indexed.

Search-index recovery commands are documented under [Commands and menus](../reference/commands-and-menus.md).

## Sort and group

Open **Sort & group** on the toolbar. Sort cards by edited time, created time, or filename, in ascending or descending order.

Folder and linked-note sources use the global arrangement. A [card box](./card-boxes.md) keeps its own. Grouping options are:

- **Folder**
- **Tag**
- **Task status**
- **Card box rule** — available only inside a box

Order groups by the default sequence, name, or card count, ascending or descending. Group headers show their card count and can be collapsed individually; the menu can collapse or expand all groups.

## Pins

Use **Pin note** or **Unpin note** on a card to keep it at the top. Pins do not bypass search or any browse filters that apply to the source; they only reorder cards that already match.

Folder and linked-note sources share global pins. Every card box has its own pinned list.

## Browse filters

Tag and property browse filters are available only in folder sources. Tags combine with AND, and parent tags include descendant tags. Property filters use OR inside one property and AND across properties.

Card boxes and link-based streams do not apply either browse filter. Existing folder tag or property selections stay dormant there; when applicable, Card Workspace shows a paused-filter hint, and the selections resume when you return to a folder. A card box’s own membership rules can still include tag or property clauses.
