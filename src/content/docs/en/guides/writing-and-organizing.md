---
title: Writing and organizing
description: Open, insert, create, rename, move, and edit notes from the card workspace.
tags: [card-workspace, guides/writing]
workflow: [organize, reframe]
---

Clicks, right-click menus, bulk mode, and drag cover most everyday work. Settings change the default click and drop behavior; explicit menu actions remain available.

## Open a card

Direct click uses **Default card open behavior**. The default reuses an unpinned root editor tab when possible and otherwise opens a new tab. Other choices are a new tab, right split, or new window; see [Settings](../reference/settings.md).

Opening cards from [Linked notes](./linked-notes.md) is a useful way to inspect context while keeping the source note pinned in Card Workspace.

## Drag into a Markdown editor

Drag a card to a precise position in an open Markdown editor. The default is **Ask every time**. Depending on card type, the menu can insert:

- Markdown — wikilink, embed, content, or title and content
- Base and Canvas — wikilink or embed
- Excalidraw — wikilink only

If a requested action is unavailable, Obsidian shows **This card type does not support that drag insertion action.**

## Create notes and files

The toolbar **Create note** action uses the configured new-note content: an empty `tags` property by default, or a blank note. The filename begins with **Untitled**.

From a folder menu you can create a note, folder, canvas, or base inside that folder. A tag menu can create a note in the current folder with the tag already applied. Creating from a folder while a card box is open switches back to that folder source.

## Navigation and card menus

Navigation menus cover creation, rename, duplicate, move, path copying, reveal in the system explorer, favorites, tree expansion, section ordering, filters, and [card-box](./card-boxes.md) actions. Renaming or deleting a tag updates or removes its references in notes, active filters, favorites, and box rules after confirmation.

Card menus can open in several destinations; duplicate, move, rename, or delete the file; manage favorites and box membership; and, for Markdown, copy content or edit tags. The complete inventory is in [Commands and menus](../reference/commands-and-menus.md).

## Bulk mode

Turn on **Bulk**, then click cards to toggle them. Shift-click selects a range from the last selected card.

- Select all or clear selection
- Move selected notes
- Add or remove tags
- Add to a card box, or remove from the open box
- Delete selected notes
- Merge selected Markdown notes

Merge needs at least two Markdown notes. Its dialog controls the title, target folder, source order, separator, whether source notes are kept, and a live preview.

## Delete behavior

Deleting a card, selection, or folder follows Obsidian’s **Files & Links** delete preference: system trash, the vault `.trash` folder, or permanent deletion. Card Workspace does not add a separate recycle bin.
