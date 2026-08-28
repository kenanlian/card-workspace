---
title: Navigation
description: Use Card Workspace’s two-column pane to switch folders, tags, boxes, and favorites.
---

Card Workspace has its own two-column pane: a navigation column next to the card stream. You do not need Obsidian’s File Explorer to switch folders, tags, boxes, or favorites.

## Section order

The default order is:

1. **Favorites**
2. **Folders**
3. **Tags**
4. **Boxes**

Change that order in [Settings](/card-workspace/en/reference/settings/) under **Navigation section order**. Collapse state is remembered separately and is not affected.

## Filter navigation

Type in **Filter navigation…** to match folders, tags, boxes, and favorites by name. Chinese names work. Nested matches keep their ancestors visible. Press Escape or the clear button to empty the filter. If nothing matches, the pane shows **No navigation items found**.

## Resize and collapse

Drag the divider to resize the **navigation column** (default 240, minimum 160, maximum 480). That width is the nav column, not the cards. With the divider focused, arrow keys change the width by 8 pixels (Shift: 32 pixels); Home and End jump to the minimum and maximum.

The header toggle **Collapse navigation** hides the nav column so the cards use the full panel width. When the panel is too narrow for two columns — shell width less than the nav column width plus 304 — the layout becomes a single pane. The same toggle then swaps between navigation and cards (**Back to cards**).

## Folders

Click a folder to browse its cards. Folder scope can include subfolders (on by default). Toggle that from the **Folders** section header or that section’s right-click menu. The option is disabled while you are inside a card box.

Right-click **Search in folder** selects that folder and focuses the in-panel **Search notes** field. It does not open Obsidian’s core Search. See [Browsing cards](/card-workspace/en/guides/browsing-cards/).

## Tags

Tags come from frontmatter and inline `#tags` through Obsidian’s tag index. Click a tag to select it. Click the only selected tag again to clear the filter. Hold Ctrl (Windows/Linux) or Cmd (macOS) and click — or press Space on a focused tag — to add or remove extra tags.

Several selected tags are combined with **AND**: a note must have every selected tag. A parent tag also matches notes tagged with its descendants — for example `#project` includes `#project/alpha`.

Right-click **New note with this tag** to create a note in the current folder with that tag already applied. See [Writing and organizing](/card-workspace/en/guides/writing-and-organizing/).

## Favorites

You can favorite a folder, file, tag, or box. Favorites are grouped by kind and can be reordered within the same kind.

Clicking a favorite:

- **Folder** — browse that folder
- **Tag** — browse the vault root with that one tag selected
- **Box** — open that card box
- **File** — open the note without changing the current folder or box

Missing items show **(missing)**. An empty section reads **No favorites yet — right-click an item to add one**.

## Counts, collapse, and keyboard

Item counts in the navigation pane are off by default. Turn them on in [Settings](/card-workspace/en/reference/settings/) with **Show item counts in navigation**. Hovering a row still shows a count tooltip (files and child folders or subtags) even when the badges are hidden.

Collapse a section from its header or **Collapse section**. Right-click a section for **Expand all folders** / **Collapse all folders**, or the matching tag-tree actions.

On the tree: Up, Down, Home, and End move the focus; Right and Left expand or collapse; Enter activates; Space additive-selects a tag; Shift+F10 or the context-menu key opens the menu.
