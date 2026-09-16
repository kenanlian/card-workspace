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

Values inside one property clause use OR; separate property clauses, tags, and the folder scope combine with AND. If a box has several rules, matching **any** rule is enough. The [Property filters](./property-filters.md) guide explains the value model.

As your vault changes, notes enter or leave a rule-driven box automatically. Manually added and removed notes stay explicit until you change them.

Each box also keeps its own **sort**, **grouping**, collapsed groups, and **pinned notes**, separate from folder browsing.

## Create a box from a view

Right-click in **Boxes** and choose **New card box…**, or choose **Save current view as card box…** while browsing a folder. The saved rule captures the current folder, include-subfolders choice, tags, and property filters; the dialog previews how many notes match.

To preserve linked notes instead, use the snapshot action described in [Linked notes](./linked-notes.md). That creates a box with manually added members rather than a live link rule.

## Add more to a box

- Right-click a box and choose **Add current view to this card box** to append the folder, tag, and property rule you are browsing.
- Right-click a card and choose **Add to card box**, including **New card box…**.
- In **Bulk** mode, choose **Add to card box** to add the selection. See [Writing and organizing](./writing-and-organizing.md).

## Configure and arrange a box

Right-click a box and choose **Configure card box…**. The dialog shows:

- **Rules** — names, folders, subfolder choices, tags, and property conditions
- **Sort** — the box’s card sort, independent of folder browsing
- **Manually added** — notes included directly
- **Removed notes** — exclusions that can be restored one at a time or all together

Use **Sort & group** on the toolbar to group a box by folder, tag, task status, or card-box rule. Group order can follow the default sequence, name, or card count, in either direction.

## Remove notes and delete boxes

Inside a box, right-click a card and choose **Remove from card box**. The note is excluded from this box, not deleted from the vault. Restore it from the configuration dialog or the box menu.

Deleting a box removes only the box, its rules, and its saved arrangement. Your notes stay in the vault.

## Filters and startup behavior

Browse tag and property filters are unavailable while a box is open because those conditions belong to its membership rules. Search still narrows the resulting box before pins and grouping are applied. See [Browsing cards](./browsing-cards.md).

On startup, Card Workspace restores the last folder rather than the last card box.
