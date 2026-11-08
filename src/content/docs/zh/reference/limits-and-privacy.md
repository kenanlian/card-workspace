---
title: 限制与隐私
description: 平台要求、受支持文件、双链行为与本地数据处理方式。
tags: [card-workspace, reference/limits]
workflow: [gather]
---

Card Workspace 可在桌面端、Android 和 iOS/iPadOS 上运行。桌面端在左侧边栏打开；手机和平板上则作为主工作区中的页面打开。

## 运行要求与受支持文件

- Obsidian **1.11.4** 或更高版本。Obsidian 1.13 及更高版本使用设置搜索和原生确认弹窗；1.11.4–1.12 使用相同设置和兼容弹窗。更早的 Obsidian 会保留 Card Workspace 1.3.4，也就是这些版本能运行的最后一版
- 从 ribbon 或命令面板打开
- 桌面端快速输入需要在 **设置 → 外观 → 窗口框架样式** 中选择 **Obsidian 框架** 或 **隐藏框架**，然后完全重启 Obsidian。在 Linux 上按能力检测运行，不保证 Wayland 下的窗口置顶或全局快捷键可用
- **显示文件类型** 决定哪些文件成为卡片：仅文档、常规格式（默认）或全部格式

Markdown 卡片有完整预览和全文搜索。Canvas 和 Excalidraw 显示图形预览，图片显示缩略图，Base、PDF、音频、视频和其他文件显示标题与文件类型。除 Markdown 外，其他文件都只按标题搜索。详见[浏览卡片](../guides/browsing-cards.md#卡片显示什么)。

## 元数据与双链

[属性筛选](../guides/property-filters.md)从缓存的 Markdown 顶层 frontmatter 中读取标量，不会递归检查嵌套对象，也不会把非 Markdown 卡片格式当作属性来源。

[双链导航](../guides/linked-notes.md)使用 Obsidian 已解析的链接图谱，并且只包含文件类型处于显示范围内的目标。来源笔记本身会被排除；未解析链接不会变成占位卡片。

## 图形限制

Canvas 文件和 Excalidraw SVG 导出的大小上限各为 **512 KiB**。Canvas 预览最多绘制 **200 个节点**和 **400 条连线**。图形预览只保存在内存中，不会写入磁盘。Canvas 预览从不加载引用的文件或网页链接；Excalidraw 绘图本身从不读取，只读取其 SVG 导出。

## 图片限制与本地缓存

[卡片图片](../guides/browsing-cards.md#卡片图片)使用 Markdown 正文引用的本地附件，以及作为卡片显示的图片文件。原图上限为 **50,000,000 字节**和 **50,000,000 像素**；SVG 源文件上限为 512 KiB，并会在绘制前清理。缩略图保持比例、不放大小图，最长边为 **1024 像素**。

桌面端插件在内存中最多保留 **64 张缩略图／16 MiB**，独立、按仓库隔离的 IndexedDB 缓存最多保留 **2000 张／256 MiB**。手机和平板使用更小的缓存额度，原图大小上限也更低。命中缓存时不重读原图。持久化存储失败时仍可使用受限的内存缓存；缩略图 Worker 不可用时只显示已有缓存，不会回退到直接显示原图。

## 设备本地设置

显示与工作区偏好按设备分别保存：排序与分组、卡片样式、圆角、字体大小、紧凑程度、预览行数、图片布局、导航分区顺序与可见性、可见属性、悬浮预览尺寸、快速输入窗口尺寸、颜色和全局快捷键，以及上次打开的文件夹和面板布局。卡片盒、收藏、置顶、模板、图标、背景颜色、隐藏的文件夹和标签、手动排序和搜索历史保存在仓库的插件数据中，并随仓库同步。详见[手机与平板](../guides/mobile.md#各设备独立的设置)。

## 隐私

所有处理都留在本机。插件不会发起外部网络请求，emoji 选择器的目录也随插件内置。文件操作使用 Obsidian 的 Vault 和 FileManager API；随插件提供的搜索引擎把本地索引存入 IndexedDB。源笔记仍留在原来的仓库文件夹。图标和背景颜色保存在插件设置中，从不写入笔记的 frontmatter。

本站点自托管字体，这与插件隐私相互独立。

## 许可证与支持

Card Workspace 从 [1.4.3](https://github.com/kenanlian/obsidian-card-workspace/releases/tag/1.4.3) 起使用 GPL-3.0-only；此前已发布的 1.4.2 及更早版本保留原有 MIT License。遇到问题可前往 [GitHub Issues](https://github.com/kenanlian/obsidian-card-workspace/issues)，源码位于[插件仓库](https://github.com/kenanlian/obsidian-card-workspace)。
