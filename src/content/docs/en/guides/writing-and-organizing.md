---
title: Writing and organizing
description: Open notes, drag them into the editor, create files, and use right-click and bulk actions.
---

Click, right-click, and drag cover most of the work. Settings change the default click and drop; menus stay available either way.

## Opening a card

The default click uses **Default card open behavior** (default `smart`): reuse an unpinned root editor tab if there is one, otherwise open a new tab. The other options are new tab, split to the right, and new window.

Right-click open destinations stay independent of that setting.

## Drag into a Markdown editor

Drag a card only into an open **Markdown editor**, and drop it at the position you want in the note. The default drop is **Ask every time**. You can also always insert a wiki link, an embed, the note content, or title plus content.

Allowed drop actions by card type:

- Markdown — wiki, embed, content, and title-content
- Base and canvas — wiki and embed
- Excalidraw — wiki only

If the action is not allowed, Obsidian shows: **This card type does not support that drag insertion action.**

## New notes

The toolbar **New** action (**Create note**) uses **New note content**:

- **Start with a tags property** (default) writes `---\ntags:\n---`
- **Start blank** writes an empty note

The basename is **Untitled**. Right-click a tag and choose **New note with this tag** to create a note in the current folder with that tag already in frontmatter.

Creating a note, folder, canvas, or base from the folder tree always lands in that folder’s browse scope. If a card box is open, that create action exits the box.

## Navigation menus

Right-click in the navigation pane to:

- **Create** — note, folder, canvas, or base (including at the vault root); **New note with this tag**
- **Organize** — rename, duplicate, move, copy vault or system path, show in the system explorer, **Search in folder** (selects the folder and focuses in-panel search), expand or collapse trees, include subfolders
- **Boxes** — **New card box…**, **Save current view as card box…**, configure, duplicate, rename, add the current view, restore removed notes, open or exit a box
- **Favorites** — add or remove, move up or down within the same kind, clear all favorites
- **Destructive** — delete a folder or delete a box (deleting a box does not delete notes)

Tag item menus are hidden while a box is open.

## Card menus

Right-click a card to open it in the current window, a new tab, the right split, or a new window; make a copy; move, rename, or delete; add or remove box membership; and add or remove favorites.

On Markdown cards you can also copy title, copy content (the live Markdown), copy title and content, and add or remove tags.

## Bulk actions

Turn on **Bulk** on the toolbar, then click cards to toggle them. Shift-click selects a range from the last selected card.

- Select all / Clear selection
- Move selected
- Add tag to selected / Remove tag from selected
- **Add to card box**
- **Remove from card box** (only while a box is open)
- Delete selected
- Merge selected

**Merge** is Markdown only and needs at least two notes. The merge dialog lets you set the merged title, target folder, source order, separator (a blank line between notes by default), whether to keep or trash the source notes, and a live preview.

## Delete

Deleting a card, a bulk selection, or a folder uses Obsidian’s **Files & Links** delete preference — system trash, the vault `.trash` folder, or permanent delete — rather than a separate Card Workspace recycle bin.
