---
title: 设置
description: Card Workspace 1.3.4 的九项设置，包括卡片图片、图片显示方式与双链卡片点击定位。
tags: [card-workspace, reference/settings]
workflow: [organize]
---

Card Workspace 1.3.4 的设置页包含九项偏好。在 Obsidian 中打开 **设置 → Card Workspace** 即可调整。活动筛选、可见属性、导航展开状态、分区顺序、卡片盒、收藏、置顶和面板尺寸会在适用时被记住，但不会作为独立设置显示。

| 设置键 | 默认值 | 名称 |
| --- | --- | --- |
| `defaultCardOpenBehavior` | `smart` | 卡片默认打开方式 |
| `dragInsertAction` | `ask` | 卡片拖拽插入行为 |
| `newNoteTemplate` | `tags-frontmatter` | 新建笔记内容 |
| `cardCornerRadius` | `rounded` | 卡片圆角 |
| `previewLines` | `5`（最小 3，最大 8） | 预览行数 |
| `showNavItemCounts` | `false` | 在导航栏显示条目计数 |
| `locateLinkCardOnOpen` | `false` | 双链卡片点击定位 |
| `cardImageMode` | `right` | 卡片图片 |
| `cardImageFit` | `cover` | 图片显示方式 |

界面跟随 Obsidian 语言：语言以 `zh` 开头时使用简体中文，否则使用英文。Obsidian 1.13 或更高版本的设置搜索可以检索这些选项；旧版本仍可从插件设置页调整。

## 卡片默认打开方式

- **当前窗格 / 当前标签页**（`smart`）— 默认
- **在新标签页中打开**（`new-tab`）
- **在右侧分栏打开**（`split-right`）
- **在新窗口中打开**（`new-window`）

这些选项影响直接点击卡片。卡片菜单中的明确打开位置始终可用，详见[写作与整理](../guides/writing-and-organizing.md)。

## 卡片拖拽插入行为

- **每次弹框确认**（`ask`）— 默认
- **插入 wiki link**（`wiki`）
- **插入嵌入 link**（`embed`）
- **插入卡片内容**（`content`）
- **插入卡片标题&内容**（`title-content`）

## 新建笔记内容

- **带 tags 属性**（`tags-frontmatter`）— 默认
- **完全空白**（`blank`）

## 卡片圆角

- **紧凑**（`compact`）
- **柔和**（`medium`）
- **圆角**（`rounded`）— 默认

## 预览行数

每张 Markdown 卡片可以显示 3–8 行规范化摘要，默认值为 `5`。详见[浏览卡片](../guides/browsing-cards.md)。

## 在导航栏显示条目计数

在导航条目旁显示计数。文件夹计数跟随“包含子文件夹”，标签计数包含子标签，属性计数描述当前未筛选来源。默认关闭。

导航分区顺序通过各分区标题的右键菜单调整，不在设置页中。详见[导航](../guides/navigation.md)。

## 双链卡片点击定位

默认关闭。开启后，从[双链来源](../guides/linked-notes.md)打开 Markdown 卡片时，会跳到摘要对应的链接位置：反链定位到引用来源笔记的位置，带标题或块引用的出链定位到目标位置。双链来源中有搜索查询时，优先定位到搜索命中位置。

普通文件夹与卡片盒中的卡片不受此选项影响；没有可用位置时，仍按正常方式打开笔记。

启用 Remember Cursor Position 时，可能短暂显示旧位置后再回到链接位置；其他恢复光标插件的行为取决于其实现。跳转位置也可能成为笔记下一次打开时恢复的位置。

## 卡片图片

- **关闭**（`off`）— 使用纯文字布局。
- **右侧缩略图**（`right`）— 默认；在摘要旁显示 88 × 88 CSS 像素的图片。
- **标题下方内联图片**（`inline`）— 在标题与摘要之间显示横跨卡片正文、固定高度为 160 CSS 像素的图片。

卡片图片从 1.3.4 开始提供。新安装及升级前未保存图片偏好的用户默认使用 **右侧缩略图**；已明确保存的选择会保留。Markdown 卡片使用笔记正文中第一张受支持的本地嵌入图片，没有此类图片的笔记保持普通文字布局。支持的引用与加载行为见[卡片图片](../guides/browsing-cards.md#卡片图片)。

## 图片显示方式

- **完整显示**（`contain`）— 保留整张图片，周围可能留有空白。
- **裁切铺满**（`cover`）— 默认；铺满图片区域，超出部分会被裁切。

此选项适用于两种图片布局。切换布局或显示方式会复用缓存缩略图，不会重新生成。
