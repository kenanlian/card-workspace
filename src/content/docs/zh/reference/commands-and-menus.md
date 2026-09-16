---
title: 命令与菜单
description: Card Workspace 的命令面板、ribbon、工具栏和右键操作。
tags: [card-workspace, reference/commands]
workflow: [gather, organize, reframe]
---

日常操作使用 ribbon、工具栏、右键菜单和拖拽。命令面板负责打开视图和恢复搜索索引，不会重复卡片导航功能。

## Ribbon 与命令面板

Ribbon 操作 **打开 Card Workspace** 会打开左侧边栏视图。

| 命令 id | 名称 |
| --- | --- |
| `open-view` | 打开 Card Workspace 视图 |
| `show-folder-card-search-index-status` | 显示 Card Workspace 本地搜索索引生命周期状态 |
| `recover-folder-card-search-index` | 恢复 Card Workspace 本地搜索索引生命周期 |
| `rebuild-folder-card-search-index` | 从笔记重建 Card Workspace 本地搜索索引 |
| `clear-reset-folder-card-search-index` | 清除并重置 Card Workspace 本地搜索索引状态 |

后四项是本地索引恢复工具。普通查询使用面板内的 **搜索笔记**，详见[浏览卡片](../guides/browsing-cards.md)。

## 工具栏

工具栏会根据当前来源提供创建笔记、**排序与分组**、批量模式、卡片盒选择、标签筛选和搜索。

进入[双链来源](../guides/linked-notes.md)后，还会提供 **固定到当前笔记** / **恢复跟随当前笔记**，以及 **存为卡片盒…**。

## 导航菜单

在导航栏的分区标题或条目上右键：

- **分区** — 折叠或展开、上移和下移
- **文件夹** — 新建、重命名、创建副本、移动、复制路径、系统定位、搜索、包含子文件夹、展开或折叠、收藏与删除
- **标签** — 筛选、新建带标签的笔记、复制、同步引用后重命名或删除、展开或折叠、收藏
- **属性** — 选择可见 key、清除筛选、全部展开或折叠；隐藏 key；加入、移除或仅保留某个值筛选
- **卡片盒** — 新建、打开、配置、加入当前视角、恢复移出笔记、创建副本、重命名、收藏或删除
- **收藏** — 打开、排序、移除或清空

双链标题使用通用的折叠和分区顺序操作；两个方向条目直接激活，不提供额外右键菜单。

## 卡片与批量菜单

右键卡片可以选择打开位置；复制、移动、重命名或删除；管理收藏和卡片盒成员；Markdown 卡片还可以复制内容和编辑标签。具体工作流与删除行为见[写作与整理](../guides/writing-and-organizing.md)。

打开 **批量** 后，工具栏提供全选、清除选择、移动、添加或移除标签、加入或移出卡片盒、删除和合并。Shift+点击可连选；合并至少需要两篇 Markdown。
