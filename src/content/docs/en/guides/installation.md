---
title: Installation
description: Install Card Workspace from Community Plugins or a GitHub release.
tags: [card-workspace, guides/getting-started]
workflow: [gather]
---

Card Workspace can be installed from Obsidian’s Community Plugins directory. You can also install a specific version manually from GitHub Releases.

## Requirements

- Desktop Obsidian; mobile is not supported
- Obsidian **1.11.4** or later. Obsidian 1.13 or later uses settings search and native confirmation dialogs; 1.11.4–1.12 uses the same settings with compatible dialogs. Earlier Obsidian versions stay on Card Workspace 1.3.4
- The interface follows Obsidian’s language (`zh*` → Simplified Chinese, otherwise English)

## Install from Community Plugins

1. Open **Settings → Community plugins** in Obsidian.
2. Turn off Restricted mode if it is enabled.
3. Select **Browse** and search for **Card Workspace**.
4. Select **Install**, then **Enable**.

The plugin’s [directory page](https://community.obsidian.md/plugins/card-workspace) can also hand installation back to Obsidian.

## Install from GitHub Releases

Use this route when you need a version other than the current Community Plugins release.

1. Download the release from [GitHub Releases](https://github.com/kenanlian/obsidian-card-workspace/releases).
2. Extract `main.js`, `manifest.json`, and `styles.css` into:

   `<vault>/.obsidian/plugins/card-workspace/`

3. Open **Settings → Community plugins**.
4. Turn off Restricted mode if needed.
5. Enable **Card Workspace** in the installed plugins list.

After enabling the plugin, [open the view and gather your first cards](./getting-started.md).
