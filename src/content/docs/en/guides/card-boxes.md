---
title: Card boxes
description: Save reusable collections with folder, tag, and property rules, plus their own arrangement.
tags: [card-workspace, guides/organizing, features/card-boxes]
workflow: [organize]
---

A card box is a saved topic collection in the **Boxes** section. Use one when related notes live across folders, or when you want to preserve a useful view without moving files or maintaining an index note.

## Membership

A note belongs to a box when it matches at least one rule, unless you removed it by hand. A manually added note is included whether or not it matches a rule, and **manual inclusion wins over exclusion**.

Each rule contains:

- a folder path (`""` means the vault root)
- whether to include subfolders
- tags that all must match
- property clauses that all must match
- an optional rule name

A box can keep tag rules and property rules; existing rules may also contain both kinds of condition. Values inside one property clause use OR; separate property clauses, tags, and the folder scope combine with AND. If a box has several rules, matching **any** rule is enough. The [Property filters](./property-filters.md) guide explains the value model.

As your vault changes, notes enter or leave a rule-driven box automatically. Manually added and removed notes stay explicit until you change them.

Each box also keeps its own **sort**, **grouping**, collapsed groups, and **pinned notes**, separate from folder browsing. Saving the current folder view copies the grouping in effect at that moment.

## Create a box from a view

Right-click in **Boxes** and choose **New card box…**, or choose **Save current view as card box…** while browsing a folder. The saved rule captures the current folder, include-subfolders choice, tags, and property filters; the dialog previews how many notes match.

Tag and property browse filters replace each other, so a new rule captures the currently active filter type. Add the other view to the same box as another rule. Combined tag and property rules saved before upgrading continue to apply their original conditions.

To preserve linked notes instead, use the snapshot action described in [Linked notes](./linked-notes.md). That creates a box with manually added members rather than a live link rule.

## Add more to a box

- Right-click a box and choose **Add current view to this card box** to append the folder, tag, and property rule you are browsing.
- Right-click a card and choose **Add to card box**, including **New card box…**.
- Drag cards onto a box in the navigation column. Dragging a selected card adds the whole visible selection. See [Drag cards onto navigation](./navigation.md#drag-cards-onto-navigation).
- In **Bulk** mode, choose **Add to card box** to add the selection. See [Writing and organizing](./writing-and-organizing.md).
- In quick input, choose one or more boxes before sending. See [Quick input and templates](./quick-input-and-templates.md).

## Create notes in a box

With a box open, **New** on the toolbar creates a note and adds it to the box as a manually added member. The note is saved in **Folder for new notes in card boxes** (**Settings → Card Workspace → New notes and templates**), which defaults to the vault root. Active tag and property filters in the box are written into the new note, as they are in a folder.

## Configure and arrange a box

Right-click a box and choose **Configure card box…**. The dialog shows:

- **Rules** — inspect folders, subfolder choices, tags, and property conditions; rename or remove a rule
- **Sort** — the box’s card sort, independent of folder browsing
- **Grouping** — the dimension, property, group order, and direction saved with this box
- **Manually added** — notes included directly
- **Removed notes** — exclusions that can be restored one at a time or all together

Use **Sort & group** on the toolbar to group a box by folder, complete tag set, task status, an enabled property, or card-box rule. See [Property filters](./property-filters.md) for property grouping. Group order can follow the default sequence, name, or card count, in either direction.

## Remove notes and delete boxes

Inside a box, right-click a card and choose **Remove from card box**. The note is excluded from this box, not deleted from the vault. Restore it from the configuration dialog or the box menu.

Deleting a box removes only the box, its rules, and its saved arrangement. Your notes stay in the vault.

## Filters and startup behavior

Tag and property browse filters work inside a box the same way they do in a folder: pick tags or property values in navigation to narrow the box. They only change what you see; the box’s rules, members, and member count stay the same. **Clear filters** on the toolbar removes them without clearing the search query. Search also narrows the box before pins and grouping are applied. See [Browse filters](./browsing-cards.md#browse-filters).

On startup, Card Workspace restores the last folder rather than the last card box.
