---
title: Limits and privacy
description: Desktop-only limits, supported files, and how Card Workspace handles your vault.
---

Card Workspace is a **sidebar-first**, **desktop-only** plugin. It is unavailable on mobile.

## Requirements

- Obsidian **1.9.0** or later (`minAppVersion`). Card support for Bases depends on that version.
- Opened from the ribbon or command palette into the **left sidebar**.

## Supported files

Cards are shown for:

- Markdown (`.md`)
- Bases (`.base`)
- Canvas (`.canvas`)
- Excalidraw (`.excalidraw` and `.excalidraw.md`)

Markdown cards get full previews and full-text search. The other kinds are title-and-placeholder cards. See [Browsing cards](/card-workspace-site/en/guides/browsing-cards/).

## Privacy

All processing stays inside your vault. The plugin does not make external network requests. File operations go through Obsidian’s local Vault and FileManager APIs. Search indexing uses the bundled `minisearch` library.

This documentation site self-hosts its fonts. That is unrelated to plugin privacy.

## License and support

Card Workspace is released under the MIT License. If you run into issues, open a ticket on [GitHub Issues](https://github.com/kenanlian/obsidian-card-workspace/issues). The plugin source is at [github.com/kenanlian/obsidian-card-workspace](https://github.com/kenanlian/obsidian-card-workspace).
