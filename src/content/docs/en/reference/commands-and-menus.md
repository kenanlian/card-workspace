---
title: Commands and menus
description: Command palette, ribbon, toolbar, navigation header, and right-click actions in Card Workspace.
tags: [card-workspace, reference/commands]
workflow: [capture, gather, organize, reframe]
---

Everyday work uses the ribbon, toolbar, right-click menus, and drag. The command palette opens the view and quick input, and provides search-index recovery rather than duplicating card navigation.

## Ribbon and command palette

The ribbon action **Open Card Workspace** opens the view: in the left sidebar on desktop, or as a page in the main workspace on phones and tablets.

| Command id | Name |
| --- | --- |
| `open-view` | Open Card Workspace view |
| `quick-input` | Open quick input |
| `show-folder-card-search-index-status` | Show Card Workspace local search index lifecycle status |
| `recover-folder-card-search-index` | Recover Card Workspace local search index lifecycle |
| `rebuild-folder-card-search-index` | Rebuild Card Workspace local search index from notes |
| `clear-reset-folder-card-search-index` | Clear and reset Card Workspace local search index state |

**Open quick input** opens a new draft each time; it is unavailable where quick input is not supported. A global shortcut that works from other apps can be set in [Settings](./settings.md#quick-input). The final four commands are recovery tools for the local index. Normal queries use **Search notes** in the panel; see [Browsing cards](../guides/browsing-cards.md).

## Toolbar

The toolbar exposes **New**, **Sort & group**, bulk mode, active filter counts with **Clear filters**, and search according to the active source.

Inside a [linked-note source](../guides/linked-notes.md), it also provides **Pin to this note** / **Resume following the active note** and **Save as card box…**. On phones, the current source and its filters appear in Obsidian’s page header instead.

## Navigation header

From left to right, the navigation header offers **Expand all** / **Collapse all**, the search icon that shows **Filter navigation…**, and the paper-plane button that opens [quick input](../guides/quick-input-and-templates.md#quick-input). **Collapse navigation** gives the cards the full panel width.

## Navigation menus

Right-click a section header or row in the navigation pane. On touch screens, use the row’s menu button or long-press it.

- **Sections** — collapse or expand, move up, move down, or hide the section
- **Folders** — create notes, folders, canvases, Excalidraw files, or bases; rename, duplicate, move, copy paths, reveal, search, include subfolders, sort child folders, reveal the active note’s folder, expand or collapse trees, change the icon, favorite, hide, or delete
- **Tags** — filter, create a tagged note, copy, rename or delete with reference updates, sort the section or its subtags, expand or collapse, change the icon, favorite, or hide
- **Properties** — choose visible keys, clear filters, sort names or values, expand or collapse all; hide a key; add, remove, or isolate a value filter; change the icon
- **Boxes** — create, open, configure (including grouping), add the current view, restore removed notes, duplicate, rename, change the icon, favorite, or delete
- **Templates** — create a template; for a template, edit the file, rename it, change its note folder, date and time formats, or insert position, change the icon, or delete it
- **Favorites** — open, reorder, change the icon, remove, or clear

The Links header uses the shared collapse and section-order actions; its two direction rows activate directly.

## Card and bulk menus

Right-click a card, or use its menu button on touch screens, to choose an open destination; duplicate, move, rename, or delete it; manage favorites and card-box membership; change its **Background color** or icon; or, for Markdown, copy content, add or remove tags, and add or remove properties. Markdown files inside the template storage folder also offer **Set as template**. On phones and tablets, the card menu adds insert and copy actions for the note you were editing; see [Phones and tablets](../guides/mobile.md#insert-and-copy-card-content). See [Writing and organizing](../guides/writing-and-organizing.md) for the workflow and delete behavior.

With **Bulk** on, the toolbar offers select all, clear selection, move, bulk tag operations, bulk property operations, add to or remove from a box, background color, delete, and merge. Bulk property operations set or remove properties across Markdown notes; see [Writing and organizing](../guides/writing-and-organizing.md#bulk-property-operations). Shift-click selects a range; merge requires at least two Markdown notes. Dragging a selected card onto a navigation entry applies to the whole selection.
