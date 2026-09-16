---
title: 属性筛选
description: 选择有用的 frontmatter 属性，并按其值筛选当前卡片来源。
tags: [card-workspace, guides/navigation, features/properties]
workflow: [gather, organize]
---

导航栏中的 **属性** 分区会把少量 frontmatter key 变成可浏览的分面。它默认保持为空，直到你主动选择需要的属性，避免大型仓库变成一整面元数据列表。

## 选择可见属性

右键 **属性** 标题，选择 **选择可见属性**。在仓库级列表中搜索并启用需要的 key，然后点击 **完成**。新启用的 key 会立即展开，显示当前卡片来源中出现的值。

这套演示文档带有一个很小的 `workflow` 属性，值为 `gather`、`organize` 和 `reframe`。完成[快速开始](./getting-started.md)后，可以先用它体验筛选。

![属性导航区展开 workflow 属性，右侧显示对应的卡片流。](../../../../assets/media/property-filters.webp)

## 按值筛选

直接点击一个值，会让它成为唯一的属性筛选；如果它已经是唯一生效的值，再点一次会清空。Ctrl（Windows/Linux）或 Cmd（macOS）加点击，以及键盘 Space，可以在不替换其他条件的情况下追加或移除值。

- 同一属性内的多个值使用 **OR**：`workflow = gather OR organize`。
- 不同属性之间使用 **AND**：`workflow = gather AND status = active`。
- **未分配** 匹配没有该 key，或没有受支持值的笔记。

支持文本、有限数值、布尔值，以及包含这些标量的数组。属性只读取 Markdown 顶层 frontmatter，不会把嵌套对象展开成点号路径。非 Markdown 卡片没有属性值，因此只有选择 **未分配** 时才可能匹配。

## 计数与导航搜索

属性分面从筛选前的来源计算，因此选中一个值不会让同级值和计数消失。在[设置](../reference/settings.md)中开启导航计数，可以看到每个 key 和值对应多少张来源卡片。

**筛选导航…** 会同时匹配已启用的属性名和值。某个值命中时，它所属的属性会临时展开。

## 不同来源中的可用性

属性筛选适用于文件夹来源和[双链来源](./linked-notes.md)。进入卡片盒后它不可作为临时浏览筛选使用，因为属性条件已经参与卡片盒的成员规则。

把文件夹视角保存或加入[卡片盒](./card-boxes.md)时，当前属性条件会与文件夹和标签一起写入新规则。

右键属性标题可以清除全部属性筛选。隐藏某个属性时，它的展开状态与生效条件也会一起删除。
