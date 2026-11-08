---
title: Limits and privacy
description: Platform requirements, supported files, link behavior, and local data handling.
tags: [card-workspace, reference/limits]
workflow: [gather]
---

Card Workspace runs on desktop, Android, and iOS/iPadOS. On desktop it opens in the left sidebar; on phones and tablets it opens as a page in the main workspace.

## Requirements and supported files

- Obsidian **1.11.4** or later. Obsidian 1.13 or later uses settings search and native confirmation dialogs; 1.11.4–1.12 uses the same settings with compatible dialogs. Earlier Obsidian versions keep Card Workspace 1.3.4, the last release they can run
- Opened from the ribbon or command palette
- Desktop quick input needs **Obsidian frame** or **Hidden** under **Settings → Appearance → Window frame style**, followed by a full restart. On Linux it runs by capability detection, without a guarantee for Wayland pinning or global shortcuts
- **Show file types** chooses which files become cards: documents only, common formats (default), or all formats

Markdown cards receive full previews and full-text search. Canvas and Excalidraw show diagram previews, images show thumbnails, and Base, PDF, audio, video, and other files show a title and file type. Everything except Markdown is searched by title only. See [Browsing cards](../guides/browsing-cards.md#what-a-card-shows).

## Metadata and links

[Property filters](../guides/property-filters.md) read top-level scalar values from cached Markdown frontmatter. They do not recursively inspect nested objects or treat non-Markdown card formats as property sources.

[Linked notes](../guides/linked-notes.md) use Obsidian’s resolved link graph and include only destinations whose file type is shown. The source note itself is excluded; unresolved links do not become placeholder cards.

## Diagram limits

Canvas files and Excalidraw SVG exports are limited to **512 KiB** each. A canvas preview draws at most **200 nodes** and **400 connections**. Diagram previews are kept in memory only and are not written to disk. Canvas previews never load referenced files or web links, and Excalidraw drawings themselves are never read; only their SVG export is.

## Image limits and local caching

[Card images](../guides/browsing-cards.md#card-images) use local attachments referenced in Markdown bodies and image files shown as cards. Originals are limited to **50,000,000 bytes** and **50,000,000 pixels**; SVG sources are limited to 512 KiB and are cleaned before they are drawn. The thumbnail preserves aspect ratio, does not enlarge small originals, and has a maximum edge of **1024 pixels**.

On desktop the plugin keeps at most **64 thumbnails / 16 MiB** in memory and **2000 thumbnails / 256 MiB** in a separate, per-vault IndexedDB cache. Phones and tablets use smaller budgets, with lower size limits for original images. Matching cached thumbnails avoid rereading the original attachment. If persistent storage fails, bounded memory caching remains available. If the thumbnail Worker is unavailable, only existing cached thumbnails can be displayed; the plugin does not fall back to displaying the original image.

## Device-local settings

Display and workspace preferences are stored per device: sort and grouping, card style, corner radius, font size, density, preview lines, image layout, navigation section order and visibility, visible properties, hover preview size, quick input window size, color, and global shortcut, plus the last folder and pane layout. Card boxes, favorites, pins, templates, icons, background colors, hidden folders and tags, manual sort orders, and search history stay in the vault’s plugin data and sync with it. See [Phones and tablets](../guides/mobile.md#settings-on-each-device).

## Privacy

All processing remains local. The plugin makes no external network requests, and the emoji picker’s catalogue is bundled with the plugin. File operations use Obsidian’s Vault and FileManager APIs; the bundled search engine stores its local index in IndexedDB. Source notes stay in their existing vault folders. Icons and background colors are stored in plugin settings and never written into note frontmatter.

This website self-hosts its fonts, independently of the plugin.

## License and support

Card Workspace uses GPL-3.0-only starting with [1.4.3](https://github.com/kenanlian/obsidian-card-workspace/releases/tag/1.4.3). Previously published releases through 1.4.2 retain their original MIT License. Report issues on [GitHub Issues](https://github.com/kenanlian/obsidian-card-workspace/issues); the source is available in the [plugin repository](https://github.com/kenanlian/obsidian-card-workspace).
