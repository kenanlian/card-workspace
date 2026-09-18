---
title: Navigation
description: Use the two-column pane to move through favorites, folders, tags, properties, boxes, and links.
tags: [card-workspace, guides/navigation]
workflow: [gather]
---

Card Workspace has its own two-column pane: a navigation column next to the card stream. You do not need Obsidian’s File Explorer to move between structure, metadata, saved views, and note connections.

## Sections

The default order is:

1. **Favorites**
2. **Folders**
3. **Tags**
4. **Properties**
5. **Boxes**
6. **Links**

Right-click a section header and choose **Move section up** or **Move section down** to change the order. Each section remembers its collapsed state separately.

## Filter navigation

Type in **Filter navigation…** to match favorites, folders, tags, enabled property keys and values, card boxes, and the Outgoing links or Backlinks entries. Chinese names work. Nested matches keep their ancestors visible. Press Escape or use the clear button to empty the filter.

## Resize and collapse

Drag the divider to resize the navigation column (default 240, minimum 160, maximum 480). With the divider focused, arrow keys change the width by 8 pixels (Shift: 32); Home and End jump to the limits.

The header action **Collapse navigation** gives the cards the full panel width. When the panel is too narrow for two columns, the layout becomes a single pane and the same action swaps between navigation and cards.

## Folders and tags

Click a folder to browse its cards. Folder scope includes subfolders by default; change that from the **Folders** header or its right-click menu. Right-click **Search in folder** to select the folder and focus the in-panel search described in [Browsing cards](./browsing-cards.md).

Click a tag to filter the folder stream. Ctrl-click on Windows/Linux or Cmd-click on macOS adds or removes a tag; several tags use AND matching. Parent tags include their descendants. Tag menus can also create a note with that tag, rename it across references, or delete it after confirmation.

## Properties and links

The **Properties** section is empty until you choose the frontmatter keys worth keeping visible. While a folder source is open, expanding a key reveals its values and lets you filter the stream. Tag and property rows are unavailable in card-box and linked-note sources; existing folder filters stay dormant there and resume when you return to a folder. See [Property filters](./property-filters.md).

The **Links** section has two fixed entries: **Outgoing links** and **Backlinks**. They follow the active note unless you pin the source. See [Linked notes](./linked-notes.md).

## Favorites and boxes

You can favorite a folder, file, tag, or card box. Favorites are grouped by kind and can be reordered by dragging or with their menus. A file favorite opens the note without replacing the current card source.

[Card boxes](./card-boxes.md) are reusable topic collections with their own rules and arrangement. Opening one replaces the current source until you choose another folder, box, or linked-note direction.

## Counts and keyboard navigation

Navigation counts are off by default. Enable **Show item counts in navigation** in [Settings](../reference/settings.md). Hover tooltips still describe folder and tag counts when badges are hidden; active tag and property-filter summaries remain visible.

In the navigation tree, use arrow keys, Home, and End to move focus; Left and Right collapse or expand; Enter activates; Space additively toggles a tag or property value; Shift+F10 or the Menu key opens the context menu.
