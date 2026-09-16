---
title: Commands and menus
description: Command palette, ribbon, toolbar, and right-click actions in Card Workspace.
tags: [card-workspace, reference/commands]
workflow: [gather, organize, reframe]
---

Everyday work uses the ribbon, toolbar, right-click menus, and drag. The command palette opens the view and provides search-index recovery rather than duplicating card navigation.

## Ribbon and command palette

The ribbon action **Open Card Workspace** opens the left-sidebar view.

| Command id | Name |
| --- | --- |
| `open-view` | Open Card Workspace view |
| `show-folder-card-search-index-status` | Show Card Workspace local search index lifecycle status |
| `recover-folder-card-search-index` | Recover Card Workspace local search index lifecycle |
| `rebuild-folder-card-search-index` | Rebuild Card Workspace local search index from notes |
| `clear-reset-folder-card-search-index` | Clear and reset Card Workspace local search index state |

The final four are recovery tools for the local index. Normal queries use **Search notes** in the panel; see [Browsing cards](../guides/browsing-cards.md).

## Toolbar

The toolbar exposes create note, **Sort & group**, bulk mode, card-box selection, tag filter, and search according to the active source.

Inside a [linked-note source](../guides/linked-notes.md), it also provides **Pin to this note** / **Resume following the active note** and **Save as card box…**.

## Navigation menus

Right-click a section header or row in the navigation pane.

- **Sections** — collapse or expand, move up, and move down
- **Folders** — create files, rename, duplicate, move, copy paths, reveal, search, include subfolders, expand or collapse trees, favorite, or delete
- **Tags** — filter, create a tagged note, copy, rename or delete with reference updates, expand or collapse, and favorite
- **Properties** — choose visible keys, clear filters, expand or collapse all; hide a key; add, remove, or isolate a value filter
- **Boxes** — create, open, configure, add the current view, restore removed notes, duplicate, rename, favorite, or delete
- **Favorites** — open, reorder, remove, or clear

The Links header uses the shared collapse and section-order actions; its two direction rows activate directly.

## Card and bulk menus

Right-click a card to choose an open destination; duplicate, move, rename, or delete it; manage favorites and card-box membership; or, for Markdown, copy content and edit tags. See [Writing and organizing](../guides/writing-and-organizing.md) for the workflow and delete behavior.

With **Bulk** on, the toolbar offers select all, clear selection, move, add or remove tags, add to or remove from a box, delete, and merge. Shift-click selects a range; merge requires at least two Markdown notes.
