# Card Workspace 文档截图安排

详细功能截图暂缓拍摄，文档中的 14 处空白截图占位及旧属性筛选图已移除。下方的 7 个场景保留为后续拍摄参考，当前页面不再预留空白位置。

## 当前采用的截图

已拍摄中英文各一组浅色 / 深色工作区全景，资源位于 `src/assets/media/navigation-favorites-{en,zh}{,-dark}.webp`。WebP 使用质量 90，保留原始分辨率；JPG 原图保留用于后续处理。虽然文件名含 favorites，画面没有收藏混排，因此按工作区全景使用，说明文字不描述收藏示例。

| 页面（中英文同步） | 放置位置 | 用途 |
| --- | --- | --- |
| `guides/getting-started.md` | “打开视图”步骤之后；`screenshot-workspace-overview` | 展示导航、卡片流与编辑器的关系，以及选中卡片对应的已打开笔记。 |
| `guides/navigation.md` | “分区”说明之后；`screenshot-navigation-overview` | 展示导航分区与卡片流，当前来源为库根目录。 |

两个页面复用对应语言的同一组资源，浅色 / 深色截图随网站主题切换。其他功能页暂时使用文字说明。

## 原 1.3.3 计划的拍摄约定

以下约定和场景来自原 1.3.3 截图计划，保留供后续参考；恢复拍摄时应按届时的插件版本调整。当前采用的全景已包含卡片图片预览。

- 使用插件 **1.3.3**，保持同一主题、字体与缩放比例。优先使用简洁的演示仓库，避免真实的私人笔记、路径和账号信息。
- 界面文字与目标语言对应；中文与英文可复用相同演示数据和构图，各拍一版。
- 推荐 16:10 构图、宽度约 1440–1920 像素，导出 WebP。卡片局部特写可以按内容裁切，以正文和按钮文字清晰为先。
- 除导航全景和双链定位外，尽量只保留展示功能必需的工作区；不需要把整个桌面或所有 Obsidian 面板拍进去。
- 本清单不包含未发布的卡片图片预览功能：插件工作目录中 `8eb7567`、`fe663b6` 的变更位于 1.3.3 标签之后。

## 暂缓拍摄的 7 个场景

所有页面路径均相对于 `src/content/docs/`，下表中的 ID 为未来添加截图时的建议锚点，当前并无对应占位。推荐新增功能截图放到 `src/assets/media/docs/`；下表用 `-zh.webp` 示范中文文件名，英文用 `-en.webp`。当前工作区全景不能代替第 1 项收藏混排场景。

| 编号 | 页面与建议锚点 ID | 推荐文件名 | 画面需要展示什么 |
| --- | --- | --- | --- |
| 1 | `zh/guides/navigation.md`、`en/guides/navigation.md`；`screenshot-navigation-favorites` | `navigation-favorites-zh.webp` | 导航与卡片流的双栏全景。展开收藏，让文件夹、单篇笔记、标签和卡片盒按工作顺序交错排列，突出“不同类型可以混排”。显示当前文件夹与约 3–5 张卡片。 |
| 2 | `zh/guides/browsing-cards.md`、`en/guides/browsing-cards.md`；`screenshot-card-preview` | `card-preview-zh.webp` | 2–3 张 Markdown 卡片的近景。准备可见的 Wikilink / Markdown 链接、无序或有序列表，以及已完成与未完成任务。确保任务复选框在摘要中清晰对齐，底部至少一张卡片显示 `2/5` 一类完成数。 |
| 3 | `zh/guides/browsing-cards.md`、`en/guides/browsing-cards.md`；`screenshot-search-context` | `search-context-zh.webp` | 搜索框中的关键词、2–3 张结果卡片、正文高亮与每篇命中次数。把关键词放在笔记较靠后的正文中，让摘要明显从匹配段落开始，避免标题也包含关键词。可在编辑器中同时显示对应正文作为参照。 |
| 4 | `zh/guides/property-filters.md`、`en/guides/property-filters.md`；`screenshot-property-grouping` | `property-grouping-zh.webp` | 先启用 `status` 属性，显示按属性分组的卡片流，例如 `draft`、`review` 和“未赋值”。组标题应显示属性名、值与数量。滚动到一个较长组的中部，让当前组标题停留在顶部；保证还能看到另一个组标题。无需打开会遮住卡片的菜单。 |
| 5 | `zh/guides/card-boxes.md`、`en/guides/card-boxes.md`；`screenshot-card-box-rules` | `card-box-rules-zh.webp` | “配置卡片盒”对话框与后方卡片流。先分别保存一个标签视角和一个属性视角到同一盒子，让两条规则分别展示文件夹 + 标签、文件夹 + 属性。再各准备一篇手动加入及已移出的笔记，使“动态规则 + 手动成员”可理解。保持规则和成员数量少，让主要内容能在对话框内同时出现。 |
| 6 | `zh/guides/linked-notes.md`、`en/guides/linked-notes.md`；`screenshot-linked-context` | `linked-context-zh.webp` | 打开来源笔记的反链，并固定来源。先开启“双链卡片点击定位”，再打开一张反链卡片。截图同时显示固定来源提示、卡片中引用来源的段落，以及编辑器内同一段引用和光标位置。来源提示和被打开笔记标题应不同，体现固定后不会切走。 |
| 7 | `zh/guides/writing-and-organizing.md`、`en/guides/writing-and-organizing.md`；`screenshot-bulk-merge` | `bulk-merge-zh.webp` | 选中至少两篇 Markdown 笔记后打开合并对话框。显示目标标题 / 文件夹、可调整的来源顺序、分隔符、保留源笔记选项及实时预览，后方尽量保留批量选择数量。准备第一篇包含 frontmatter 的笔记，让预览顶部能体现只保留第一篇元数据。 |

## 后续添加截图

1. 将截图放入 `src/assets/media/docs/`，按语言命名。
2. 在对应功能说明之后添加 `<figure class="cw-doc-shot">`，使用表中的建议 ID。
3. 在 figure 内用标准 Markdown 图片引用资源，并添加与实际画面相符的 `<figcaption>`。例如在中文导航页的收藏说明之后：

```md
<figure class="cw-doc-shot" id="screenshot-navigation-favorites">

![文件夹、笔记、标签与卡片盒在同一收藏列表中混排。](../../../../assets/media/docs/navigation-favorites-zh.webp)

<figcaption>文件夹、笔记、标签与卡片盒收藏在同一列表中混排，导航栏紧邻卡片流。</figcaption>
</figure>
```

Markdown 图片前后留空行，让 Astro 处理本地资源。功能页继续使用 `.md`，无需导入组件。截图说明应随实际画面调整，避免描述画面中没有展示的操作。替换后运行 `npm run build`，通过预览确认清晰度、深浅主题下的边界和手机阅读宽度。

同一场景有深浅两版时，参考当前导航页，将两张 Markdown 图片分别放在 `cw-doc-shot__light` 与 `cw-doc-shot__dark` 容器内，主题样式会只显示对应的一版。

## 原 1.3.3 计划依据

- [1.3.3 发布记录](https://github.com/kenanlian/obsidian-card-workspace/releases/tag/1.3.3)与本地插件仓库的 `1.3.3` 标签（`60724ac`）。
- 本地 `src/settings.ts`、`src/CardWorkspaceSettingTab.ts` 和 `src/i18n/settingTab.ts`：七项设置与双链点击定位的默认值。
- 本地 `src/view/card-grouping.ts`、`src/view/property-grouping.ts`：完整标签 / 属性值集合分组、组内置顶。
- 本地 `src/view/context-preview.ts`、`src/view/link-card-location.ts`、`src/view/controllers/HydrationController.ts`：搜索与双链上下文、回退规则。
- 本地 `src/view/actions/tag-actions.ts`、`src/view/actions/property-actions.ts`：标签与属性浏览筛选的切换。

以上源码均按 `git show 1.3.3:<path>` 核对，不以含未发布功能的工作目录作为 1.3.3 的功能范围。
