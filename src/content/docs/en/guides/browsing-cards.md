---
title: Browsing cards
description: Scan the card stream, search locally, sort, and pin notes to the top.
---

The card stream is for scanning: click a card to open it, keep scrolling, and stay in sync with the editor.

## What a card shows

Every card shows a **title** and an excerpt. Markdown notes get a full preview and full-text search index. `.base`, `.canvas`, and `.excalidraw` / `.excalidraw.md` cards show a title and a placeholder instead of a Markdown excerpt.

Scrolling is virtualized: only visible cards are rendered, so large folders stay usable.

## Two-way sync

Click a card to open its note. Switch notes in the editor and the matching card is selected.

## Search

The toolbar **Toggle search** field (**Search notes**) searches the current folder, folder-and-tag scope, or card box locally. Chinese queries are supported. Matching text is highlighted on Markdown cards, with a per-note hit count.

- An empty query shows all cards in the current scope.
- A non-empty query waits until the local index is ready. Until then the stream is empty and the panel shows **Search is currently blocked**.
- Markdown titles and bodies are indexed. Base, Canvas, and Excalidraw cards are indexed by **title only**.

Search-index recovery commands are on [Commands and menus](/card-workspace-site/en/reference/commands-and-menus/). They are not part of everyday browsing.

## Sort

Use **Sort** on the toolbar. Options:

- Edited time (newest first) / Edited time (oldest first)
- Created time (newest first) / Created time (oldest first)
- Filename (A to Z) / Filename (Z to A)

Folder browsing uses the global sort. A card box uses **that box’s** sort.

## Pins

Pin a card to keep it at the top of the stream. Relative order among pinned cards follows the stream order, not the order you pinned them. Folder pins and box pins are separate lists.

## Tag filter

**Tags** on the toolbar filters the folder stream. That filter is unavailable inside a box — see [Card boxes](/card-workspace-site/en/guides/card-boxes/).
