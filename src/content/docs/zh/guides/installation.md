---
title: 安装
description: 从 Obsidian 插件市场或 GitHub Releases 安装 Card Workspace。
tags: [card-workspace, guides/getting-started]
workflow: [gather]
---

Card Workspace 可以从 Obsidian 第三方插件市场安装，也可以从 GitHub Releases 手动安装某个特定版本。

## 运行要求

- 桌面版 Obsidian；不支持移动端
- Obsidian **1.9.0** 或更高版本
- 界面跟随 Obsidian 语言（`zh*` → 简体中文，否则为英文）

## 从插件市场安装

1. 打开 Obsidian 的 **设置 → 第三方插件**。
2. 如已开启安全模式，请先关闭。
3. 点击 **浏览**，搜索 **Card Workspace**。
4. 依次点击 **安装** 和 **启用**。

插件的[市场页面](https://community.obsidian.md/plugins/card-workspace)也可以把安装操作交回 Obsidian。

## 从 GitHub Releases 安装

需要使用当前市场版本以外的版本时，采用这种方式。

1. 从 [GitHub Releases](https://github.com/kenanlian/obsidian-card-workspace/releases) 下载对应版本。
2. 解压 `main.js`、`manifest.json` 和 `styles.css`，复制到：

   `<vault>/.obsidian/plugins/card-workspace/`

3. 打开 **设置 → 第三方插件**。
4. 如有需要，关闭安全模式。
5. 在已安装插件列表中启用 **Card Workspace**。

启用后即可[打开视图并汇集第一批卡片](./getting-started.md)。
