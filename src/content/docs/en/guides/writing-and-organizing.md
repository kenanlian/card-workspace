---
title: Writing and organizing
description: Open, insert, and organize notes from the card workspace, and set or remove Markdown properties in bulk.
tags: [card-workspace, guides/writing]
workflow: [organize, reframe]
---

Clicks, right-click menus, bulk mode, and drag cover most everyday work. Settings change the default click and drop behavior; explicit menu actions remain available.

## Open a card

Direct click uses **Default card open behavior**. The default reuses an unpinned root editor tab when possible and otherwise opens a new tab. Other choices are a new tab, right split, or new window; see [Settings](../reference/settings.md).

Opening cards from [Linked notes](./linked-notes.md) is a useful way to inspect context while keeping the source note pinned in Card Workspace. With **Jump to link location when opening a link card** enabled, opening the card also jumps to its reference or search-match location; see [Settings](../reference/settings.md).

## Drag into a Markdown editor

Drag a card to a precise position in an open Markdown editor. The default is **Ask every time**. Depending on card type, the menu can insert:

- Markdown — wikilink, embed, content, or title and content
- Base and Canvas — wikilink or embed
- Excalidraw — wikilink only

If a requested action is unavailable, Obsidian shows **This card type does not support that drag insertion action.**

## Insert a heading section

**Enable section drag insertion** in [Settings](../reference/settings.md#enable-section-drag-insertion) is off by default. Turn it on, then drop a Markdown card to choose a heading section or the whole note. The section actions are **Insert section link**, **Insert section content**, and **Insert section heading & content**. They follow the selected drag insert behavior.

Section content includes nested headings and stops at the next heading of the same or higher level. The inserted text is the original Markdown. If heading metadata is still loading, drop the card again. When Obsidian cannot link to one heading, insert its content instead.

## Create notes and files

The toolbar **Create note** action uses the configured new-note content: an empty `tags` property by default, or a blank note. The filename begins with **Untitled**.

From a folder menu you can create a note, folder, canvas, or base inside that folder. A tag menu can create a note in the current folder with the tag already applied. Creating from a folder while a card box is open switches back to that folder source.

## Navigation and card menus

Navigation menus cover creation, rename, duplicate, move, path copying, reveal in the system explorer, favorites, tree expansion, section ordering, filters, and [card-box](./card-boxes.md) actions. Renaming or deleting a tag updates or removes its references in notes, active filters, favorites, and box rules after confirmation.

Card menus can open in several destinations; duplicate, move, rename, or delete the file; manage favorites and box membership; and, for Markdown, copy content or open **Add/remove tags...** and **Add/remove properties...**. Those two actions use the same dialogs as bulk mode, applied to that one note. The complete inventory is in [Commands and menus](../reference/commands-and-menus.md).

Copying Markdown content omits the leading frontmatter and gives you the body. Duplicating the file preserves its original contents.

## Bulk mode

Turn on **Bulk**, then click cards to toggle them. Shift-click selects a range from the last selected card.

- Select all or clear selection
- Move selected notes
- Add or remove tags
- Set or remove properties across Markdown notes
- Add to a card box, or remove from the open box
- Delete selected notes
- Merge selected Markdown notes

Merge needs at least two Markdown notes. Its dialog controls the title, target folder, source order, and a live preview. The separator defaults to **Blank line**, and can also be a **Horizontal rule** or a **Line break**. **Trash source notes after merge** is off, so the source notes stay in the vault until you turn it on; trashing then follows Obsidian’s delete preference. Only the first source note’s frontmatter is preserved at the top of the merged note; the other source frontmatter blocks are omitted.

### Bulk tag operations

Select Markdown notes in bulk mode, then click **Bulk tag operations** in the toolbar. The dialog shows how many notes it will affect. Add tags and remove tags in one operation. Removing a parent tag also removes its child tags, and removals run before additions. **Apply** reports modified, unchanged, and failed counts. If any notes fail, applying again retries only those notes. A single card’s **Add/remove tags...** action opens this same dialog for that note.

### Bulk property operations

Select Markdown notes in bulk mode, then click **Bulk property operations** in the toolbar. The dialog shows how many notes it will affect. You can set several properties and remove other properties in one operation.

- **Set properties**: enter a name, type, and value to create a property or overwrite its existing value across the selection. For example, set `status` to `review` for a group of notes.
- **Types and values**: choose text, list, number, checkbox, date, or date & time. List items support text or numbers; setting a list replaces its existing contents.
- **Suggestions**: search existing property names and values, or enter new ones. The removal picker lists properties present in the selection and how many selected notes contain each one.
- **Results**: click **Apply** to see modified, unchanged, and failed counts. If any notes fail, applying again retries only those notes.

Operations edit Markdown frontmatter while preserving the body and other properties. A property cannot be set and removed in the same operation. A single card’s **Add/remove properties...** action opens this same dialog for that note. Use **Bulk tag operations** for tags.

## Delete behavior

Deleting a card, selection, or folder follows Obsidian’s **Files & Links** delete preference: system trash, the vault `.trash` folder, or permanent deletion. Card Workspace does not add a separate recycle bin.
