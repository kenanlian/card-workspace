---
title: Limits and privacy
description: Desktop limits, supported files, link behavior, and local data handling.
tags: [card-workspace, reference/limits]
workflow: [gather]
---

Card Workspace is a **sidebar-first, desktop-only** plugin. It does not run on mobile.

## Requirements and supported files

- Obsidian **1.9.0** or later
- Opened from the ribbon or command palette in the left sidebar
- Markdown (`.md`), Bases (`.base`), Canvas (`.canvas`), and Excalidraw (`.excalidraw` and `.excalidraw.md`) cards

Markdown cards receive full previews and full-text search. Other supported kinds use a title and placeholder and are searched by title. See [Browsing cards](../guides/browsing-cards.md).

## Metadata and links

[Property filters](../guides/property-filters.md) read top-level scalar values from cached Markdown frontmatter. They do not recursively inspect nested objects or treat non-Markdown card formats as property sources.

[Linked notes](../guides/linked-notes.md) use Obsidian’s resolved link graph and include only destinations that resolve to supported card files. The source note itself is excluded; unresolved links do not become placeholder cards.

## Privacy

All processing remains local. The plugin makes no external network requests. File operations use Obsidian’s Vault and FileManager APIs; the bundled search engine stores its local index in IndexedDB. Source notes stay in their existing vault folders.

This website self-hosts its fonts, independently of the plugin.

## License and support

Card Workspace is released under the MIT License. Report issues on [GitHub Issues](https://github.com/kenanlian/obsidian-card-workspace/issues); the source is available in the [plugin repository](https://github.com/kenanlian/obsidian-card-workspace).
