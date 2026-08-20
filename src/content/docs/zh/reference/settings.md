---
title: 设置
description: Card Workspace 设置页中实际显示的选项。
---

以下是 **设置 → Card Workspace** 中显示的选项。其他会记住的状态 — 卡片盒、收藏、置顶、上次文件夹、面板折叠 — 不列在这里；它们分别在 [导航](/card-workspace-site/zh/guides/navigation/)、[卡片盒](/card-workspace-site/zh/guides/card-boxes/) 和 [写作与整理](/card-workspace-site/zh/guides/writing-and-organizing/) 中说明。

| 设置键 | 默认值 | 名称 |
| --- | --- | --- |
| `defaultCardOpenBehavior` | `smart` | 卡片默认打开方式 |
| `dragInsertAction` | `ask` | 卡片拖拽插入行为 |
| `newNoteTemplate` | `tags-frontmatter` | 新建笔记内容 |
| `cardCornerRadius` | `rounded` | 卡片圆角 |
| `previewLines` | `5`（最小 3，最大 8） | 预览行数 |
| `showNavItemCounts` | `false` | 在导航栏显示条目计数 |

## 卡片默认打开方式

选择直接点击卡片时的行为。右键菜单操作仍可单独使用。

- **当前窗格 / 当前标签页**（`smart`）— 默认
- **在新标签页中打开**（`new-tab`）
- **在右侧分栏打开**（`split-right`）
- **在新窗口中打开**（`new-window`）

## 卡片拖拽插入行为

选择将卡片拖入 Markdown 编辑器时的处理方式。

- **每次弹框确认**（`ask`）— 默认
- **插入 wiki link**（`wiki`）
- **插入嵌入 link**（`embed`）
- **插入卡片内容**（`content`）
- **插入卡片标题&内容**（`title-content`）

## 新建笔记内容

选择工具栏“创建笔记”生成的笔记内容：带一个空的 tags 属性，或完全空白。

- **带 tags 属性**（`tags-frontmatter`）— 默认
- **完全空白**（`blank`）

## 卡片圆角

调整面板中每张卡片边框的方正或圆润程度。

- **紧凑**（`compact`）
- **柔和**（`medium`）
- **圆角**（`rounded`）— 默认

## 预览行数

选择每张卡片预览可显示的规范化摘要行数（3–8）。默认值为 `5`。

## 在导航栏显示条目计数

在导航栏中显示每个文件夹和标签包含的卡片数量。文件夹计数会跟随“包含子文件夹”开关变化，标签计数包含其子标签。默认关闭（`false`）。
