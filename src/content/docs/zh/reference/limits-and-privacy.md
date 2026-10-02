---
title: 限制与隐私
description: 桌面端限制、受支持文件、双链行为与本地数据处理方式。
tags: [card-workspace, reference/limits]
workflow: [gather]
---

Card Workspace 是一款 **侧边栏优先、仅桌面端** 的插件，不支持移动端。

## 运行要求与受支持文件

- Obsidian **1.9.0** 或更高版本
- 从 ribbon 或命令面板在左侧边栏打开
- Markdown（`.md`）、Bases（`.base`）、Canvas（`.canvas`）以及 Excalidraw（`.excalidraw` 和 `.excalidraw.md`）卡片

Markdown 卡片有完整预览和全文搜索；其他受支持类型显示标题与占位说明，并且只按标题搜索。详见[浏览卡片](../guides/browsing-cards.md)。

## 元数据与双链

[属性筛选](../guides/property-filters.md)从缓存的 Markdown 顶层 frontmatter 中读取标量，不会递归检查嵌套对象，也不会把非 Markdown 卡片格式当作属性来源。

[双链导航](../guides/linked-notes.md)使用 Obsidian 已解析的链接图谱，并且只包含能够解析为受支持卡片文件的目标。来源笔记本身会被排除；未解析链接不会变成占位卡片。

## 图片限制与本地缓存

[卡片图片](../guides/browsing-cards.md#卡片图片)使用 Markdown 正文引用的本地附件；图片附件不会变成独立卡片，也不进入搜索索引。原图上限为 **50,000,000 字节**和 **50,000,000 像素**。缩略图保持比例、不放大小图，最长边为 **1024 像素**。

插件在内存中最多保留 **64 张缩略图／16 MiB**，独立、按仓库隔离的 IndexedDB 缓存最多保留 **2000 张／256 MiB**。命中缓存时不重读原图。持久化存储失败时仍可使用受限的内存缓存；缩略图 Worker 不可用时只显示已有缓存，不会回退到直接显示原图。

## 隐私

所有处理都留在本机。插件不会发起外部网络请求。文件操作使用 Obsidian 的 Vault 和 FileManager API；随插件提供的搜索引擎把本地索引存入 IndexedDB。源笔记仍留在原来的仓库文件夹。

本站点自托管字体，这与插件隐私相互独立。

## 许可证与支持

Card Workspace 使用 MIT License。遇到问题可前往 [GitHub Issues](https://github.com/kenanlian/obsidian-card-workspace/issues)，源码位于[插件仓库](https://github.com/kenanlian/obsidian-card-workspace)。
