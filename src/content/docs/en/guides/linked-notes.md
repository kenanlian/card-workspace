---
title: Linked notes
description: Browse link context, follow or pin a source note, and open cards at the referenced location.
tags: [card-workspace, guides/navigation, features/links]
workflow: [gather, reframe]
---

The **Links** navigation section turns Obsidian’s resolved note graph into two card sources: **Outgoing links** and **Backlinks**. It lets you move through a note’s context without leaving the card stream.

## Open a linked-note source

Open a supported note in the editor, then choose:

- **Outgoing links** — supported notes referenced by the source note
- **Backlinks** — supported notes that reference the source note

The source note itself is not included. If no supported note is active, both entries are disabled. Empty results show **No linked notes**.

Standard Markdown links and Obsidian Wikilinks both contribute to Obsidian’s resolved graph. This documentation uses relative Markdown links, so opening it as a vault provides a small working example: this page links to [Navigation](./navigation.md), while Navigation receives the backlink.

## Follow or pin the source note

Linked-note sources follow the active editor note by default while keeping their direction. Switch from one note to another and the card stream reloads its outgoing links or backlinks.

Use **Pin to this note** in the toolbar to hold the source on the current note while you open other cards. Choose **Resume following the active note** to reconnect it to the editor.

## Link context and opening location

Without a search query, Markdown link cards prefer an excerpt from the relevant reference location:

- **Backlinks** — preview from the first usable reference in that note, showing why it links to the source.
- **Outgoing links** — a resolved heading or block reference, such as `[[Note#Heading]]` or `[[Note#^block-id]]`, previews from that target. Whole-note links and unavailable locations use the opening excerpt.
- **Active search** — the matching text’s context takes priority over the link location.

Enable **Jump to link location when opening a link card** in [Settings](../reference/settings.md) to jump to the previewed location when you click a card or open it through its menu. An active search takes priority and jumps to matching text. This setting is off by default and applies only to linked-note sources; a missing location falls back to opening normally.

## Refine and arrange linked cards

Search, sorting, grouping, and pins remain available. Tag and property browse filters, along with the include-subfolders control, do not apply because the source comes from links rather than a folder. Existing folder filter selections stay paused and resume when you return to a folder.

Linked-note sources use the global sort, grouping, and pinned paths shared with folder browsing. They are temporary: Card Workspace restores the last folder, not a linked-note source, on startup.

## Save a snapshot as a card box

Choose **Save as card box…** in the toolbar to copy the currently visible linked cards into a new [card box](./card-boxes.md). An active search therefore affects what enters the snapshot; dormant browse filters do not affect it.

The saved notes are manually added members. The box is a fixed snapshot, not a live backlinks or outgoing-links rule; later graph changes do not change its membership automatically.
