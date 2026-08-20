---
title: 限制与隐私
description: 仅桌面端的限制、受支持的文件，以及 Card Workspace 如何处理你的库。
---

Card Workspace 是 **侧边栏优先**、**仅桌面端** 的插件。移动端不可用。

## 运行要求

- Obsidian **1.9.0** 或更高版本（`minAppVersion`）。卡片对 Bases 的支持依赖该版本。
- 从 ribbon 或命令面板在 **左侧边栏** 打开。

## 受支持的文件

会显示为卡片的文件包括：

- Markdown（`.md`）
- Bases（`.base`）
- Canvas（`.canvas`）
- Excalidraw（`.excalidraw` 和 `.excalidraw.md`）

Markdown 卡片有完整预览和全文搜索。其他类型是标题加占位说明的卡片。详见 [浏览卡片](/card-workspace-site/zh/guides/browsing-cards/)。

## 隐私

所有处理都在你的本地库内完成。该插件不会发起外部网络请求。文件操作通过 Obsidian 本地的 Vault 和 FileManager API 完成。搜索索引使用随插件捆绑的 `minisearch` 库。

本站点自托管字体。这与插件隐私无关。

## 许可证与支持

Card Workspace 采用 MIT License 发布。如果遇到问题，请前往 [GitHub Issues](https://github.com/kenanlian/obsidian-card-workspace/issues) 提交 issue。插件源码位于 [github.com/kenanlian/obsidian-card-workspace](https://github.com/kenanlian/obsidian-card-workspace)。
