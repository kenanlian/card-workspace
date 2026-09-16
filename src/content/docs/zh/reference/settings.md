---
title: 设置
description: Card Workspace 设置页中显示的六项选项。
tags: [card-workspace, reference/settings]
workflow: [organize]
---

设置页包含六项偏好。活动筛选、可见属性、导航展开状态、分区顺序、卡片盒、收藏、置顶和面板尺寸会在适用时被记住，但不会作为独立设置显示。

| 设置键 | 默认值 | 名称 |
| --- | --- | --- |
| `defaultCardOpenBehavior` | `smart` | 卡片默认打开方式 |
| `dragInsertAction` | `ask` | 卡片拖拽插入行为 |
| `newNoteTemplate` | `tags-frontmatter` | 新建笔记内容 |
| `cardCornerRadius` | `rounded` | 卡片圆角 |
| `previewLines` | `5`（最小 3，最大 8） | 预览行数 |
| `showNavItemCounts` | `false` | 在导航栏显示条目计数 |

界面跟随 Obsidian 语言：语言以 `zh` 开头时使用简体中文，否则使用英文。

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
