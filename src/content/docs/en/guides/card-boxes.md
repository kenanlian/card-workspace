---
title: Card boxes
description: Save a topic collection with rules, hand-picked notes, its own sort, and its own pins.
---

A card box is a saved topic collection in the **Boxes** section. Use boxes when notes belong together conceptually but live in different folders — without moving files or maintaining an index note. Typical uses are research topics, long-running projects, and reading lists.

## Membership

A note is in a box when it matches at least one rule, unless it was excluded by hand. A manually added note is included whether or not it matches a rule, and **manual inclusion wins over exclusion**.

Each **rule** is:

- a folder path (`""` is the vault root)
- whether to include subfolders
- tags that all must match (AND inside a rule)

If a box has several rules, a note matches the box when it matches **any** of them (OR across rules). As the vault changes, notes that start matching a rule keep appearing; notes that stop matching drop out unless you added them by hand.

Each box also keeps its own **sort** and **pinned** notes, separate from folder browsing.

## Create a box

Right-click in **Boxes** and choose **New card box…**, or **Save current view as card box…** to store the folder-and-tag scope you are already browsing. Saving the current view also shows how many notes match before you confirm.

## Add notes to a box

- Right-click a box and choose **Add current view to this card box** to append a rule from the folder and tags you are browsing.
- Right-click a card and choose **Add to card box**, including **New card box…**.
- In **Bulk** mode, choose **Add to card box** to add the selection. See [Writing and organizing](/card-workspace/en/guides/writing-and-organizing/).

If a box has no rules yet, the configure dialog points you to **Add current view to card box**.

## Configure a box

Right-click a box and choose **Configure card box…**. The dialog has:

- **Rules** — each rule’s folder, subfolder setting, and tags; remove a rule from here
- **Sort** — that box’s sort, independent of folder browsing
- **Manually added** — notes you added by hand; remove one to drop it from the box
- **Removed notes** — notes you excluded; **Restore** one or **Restore all**

You can also **Restore N removed notes** from the box’s right-click menu when anything is excluded.

## Remove a note from a box

Inside a box, right-click a card and choose **Remove from card box**. The note is excluded from this box; it is not deleted from the vault. Restore it from the configure dialog or the box menu.

An empty box shows: **This card box is empty. Add notes from the card list or add a rule.**

## Tag filter in a box

While a box is open, the browse tag filter is skipped. The stream is search, then pins. The UI shows **Tag filter is unavailable in a box**.

On startup Card Workspace restores the last folder, not the last box. See [Getting started](/card-workspace/en/guides/getting-started/).

## Deleting a box

Deleting a box removes the box and its rules. Your notes are not deleted.
