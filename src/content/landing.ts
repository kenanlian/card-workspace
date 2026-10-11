import {
  COMMUNITY_PLUGIN,
  RELEASES,
  REPO,
  VERSION,
  docsHref as docs,
  homeHref,
  repoLabel,
  versionTitle,
  type Locale,
} from './site';

export type { Locale };

export interface FooterLink {
  label: string;
  href: string;
}

export interface LandingDetail {
  title: string;
  body: string;
}

export interface LandingCopy {
  version: string;
  versionTitle: string;
  versionHref: string;
  themeLabel: string;
  languageMenuLabel: string;
  languageHref: string;
  docsLabel: string;
  docsHref: string;
  repoLabel: string;
  repoHref: string;
  clipPlayLabel: string;
  clipPauseLabel: string;
  hero: {
    eyebrow: string;
    headline: string[];
    headlineCompact: string[];
    lede: string;
    primaryCta: string;
    primaryHref: string;
    secondaryCta: string;
    secondaryHref: string;
    meta: string;
    mediaAlt: string;
    caption: string;
  };
  images: {
    kicker: string;
    title: string;
    body: string;
    labels: string[];
    mediaAlt: string;
    caption: string;
  };
  boxes: {
    kicker: string;
    title: string;
    body: string;
    support: string;
    mediaAlt: string;
    caption: string;
  };
  gather: {
    kicker: string;
    title: string;
    body: string;
    labels: string[];
    mediaAlt: string;
    caption: string;
  };
  drag: {
    kicker: string;
    title: string;
    body: string;
    actions: string[];
    mediaAlt: string;
    mediaCaption: string;
  };
  search: {
    kicker: string;
    title: string;
    body: string;
    labels: string[];
    mediaAlt: string;
    caption: string;
  };
  links: {
    kicker: string;
    title: string;
    body: string;
    labels: string[];
    mediaAlt: string;
    caption: string;
  };
  bulk: {
    kicker: string;
    title: string;
    body: string;
    selectionModes: string[];
    actions: string[];
    mediaAlt: string;
    caption: string;
  };
  details: {
    kicker: string;
    title: string;
    body: string;
    items: LandingDetail[];
  };
  cta: {
    title: string;
    body: string;
    primaryCta: string;
    primaryHref: string;
    secondaryCta: string;
    secondaryHref: string;
  };
  footer: {
    tagline: string;
    links: FooterLink[];
    legal: string;
  };
}

export const landing: Record<Locale, LandingCopy> = {
  en: {
    version: VERSION,
    versionTitle: versionTitle.en,
    versionHref: RELEASES,
    themeLabel: 'Switch color theme',
    languageMenuLabel: 'Choose language',
    languageHref: homeHref('zh'),
    docsLabel: 'Docs',
    docsHref: docs('en', 'guides/introduction'),
    repoLabel: repoLabel.en,
    repoHref: REPO,
    clipPlayLabel: 'Play this clip',
    clipPauseLabel: 'Pause this clip',
    hero: {
      eyebrow: `Obsidian desktop plugin · ${VERSION}`,
      headline: ['Gather. Organize.', 'Reframe — into', 'understanding.'],
      headlineCompact: ['Gather.', 'Organize.', 'Reframe — into', 'understanding.'],
      lede:
        'Card Workspace brings folders, tags, properties, backlinks, outgoing links, and card boxes into a readable card stream beside your editor. Gather context, shape a working view, and bring what matters into the note you’re writing.',
      primaryCta: 'Install from Community Plugins',
      primaryHref: COMMUNITY_PLUGIN,
      secondaryCta: 'Read the docs',
      secondaryHref: docs('en', 'guides/introduction'),
      meta: 'Obsidian 1.11.4+ · Desktop only · Runs locally',
      mediaAlt:
        'Demo: Card Workspace beside the editor in Obsidian. The card stream shows the whole vault with photo thumbnails; clicking the neuroscience tag narrows it to 4 notes, clicking the Deep work card opens that note, and following a link inside it moves the selected card to The cost of task switching.',
      caption: 'Click a tag to narrow the stream and a card to open it; the selection follows the note you’re reading.',
    },
    images: {
      kicker: 'Recognize',
      title: 'Spot a note by its picture.',
      body:
        'Markdown cards show the first local image embedded in the note, so recipes, trips, and references are recognizable at a glance. Keep it as a right-side thumbnail, show it full width below the title, crop it to fill or show the whole image, or turn images off.',
      labels: ['Right thumbnail', 'Below title', 'Crop or show whole', 'Local images only'],
      mediaAlt:
        'Demo: cards with right-side photo thumbnails; in the Card Workspace settings, Card images is switched to Below title, and the scrolling stream shows each photo full width under its title.',
      caption: 'Switch between a right thumbnail and a full-width image in settings; the stream re-lays out at once.',
    },
    boxes: {
      kicker: 'Organize',
      title: 'Turn a useful view into a reusable workspace.',
      body:
        'Save the current folder, tag, or property view as a card box, and matching notes keep appearing as the vault changes. Add or remove individual notes, then give each box its own sort, grouping, and pins. The source files stay where they are.',
      support:
        'Use a box for research topics, long-running projects, reading lists, or a snapshot of linked notes.',
      mediaAlt:
        'Demo: with the neuroscience tag selected, the view is saved as a card box named Focus research; the dialog shows how many notes match, the new box appears in the navigation, and its cards are grouped by folder from the Sort & group menu.',
      caption: 'A box keeps its rules, and its own grouping and sort, separate from every other view.',
    },
    gather: {
      kicker: 'Gather',
      title: 'Start with the structure your vault already has.',
      body:
        'Choose a folder, include its subfolders when useful, then narrow the card stream with tags or frontmatter properties. Switching filter types replaces the previous selection, keeping the active view easy to follow. Drag folders to move or reorder them, and arrange tags and properties in the order you think in.',
      labels: ['Folder scope', 'Include subfolders', 'Tags or properties', 'Drag to reorder'],
      mediaAlt:
        'Demo: selecting the Reading folder fills the card stream; the neuroscience tag narrows it, the status value done replaces the tag filter, and the Research folder is dragged to the top of the folder list.',
      caption: 'A folder, then a tag or a property value; each count shows what is left.',
    },
    drag: {
      kicker: 'Reframe',
      title: 'Bring useful context into the note you’re writing.',
      body:
        'Drag a Markdown card into the editor and drop it at the cursor. Insert a wikilink, an embed, the note body, or its title and body—choosing each time or setting a default. Turn on heading drag to bring in a single section instead of the whole note.',
      actions: ['Wikilink', 'Embed', 'Content', 'Title + content'],
      mediaAlt:
        'Demo: the Conditions for flow card is dragged into the Further reading list of the note being written; the drop menu offers wiki link, embed, content, or title and content, and choosing wiki link inserts the link at the cursor.',
      mediaCaption: 'Drop a card at the cursor, then choose wikilink, embed, content, or title + content.',
    },
    search: {
      kicker: 'Search locally',
      title: 'Find the passage, not just the filename.',
      body:
        'Search the current folder, card box, outgoing links, or backlinks with a local full-text index. Each card shows short excerpts around its hits with the matches highlighted, plus a hit count; click an excerpt to open the note at that passage. Recent queries stay in the search history, and vault content never leaves your device.',
      labels: ['Current source only', 'Hit excerpts', 'Click to jump', 'Search history', 'Local index'],
      mediaAlt:
        'Demo: searching “interruption” in the card sidebar finds 9 notes with highlighted excerpts and per-note hit counts; clicking an excerpt opens the note at that passage.',
      caption: 'Highlighted excerpts show why each note matched; click one to jump straight to the passage.',
    },
    links: {
      kicker: 'Keep context',
      title: 'Read the link graph beside the note that gives it meaning.',
      body:
        'Open the backlinks or outgoing links of the active note. Cards are ordered by how often they reference it, and each backlink shows the passages that cite it; click one to open the citing note at that line. Let the source follow the editor, or pin it while you look around.',
      labels: ['Backlinks + outgoing links', 'Sorted by references', 'Citing passages', 'Click to jump', 'Pin source'],
      mediaAlt:
        'Demo: with Deep work open, Backlinks lists the notes that cite it, most-referenced first, each with its citing paragraphs; the source is pinned, and clicking a passage in an interview note opens that note at the cited sentence.',
      caption: 'See how a note is cited, not just where; one click opens the citing passage.',
    },
    bulk: {
      kicker: 'Act in bulk',
      title: 'Organize a set of notes as deliberately as one.',
      body:
        'In bulk mode, click to select individual cards, Shift-click to select a range, or select the whole view. Then move notes, add or remove tags, set or remove properties across Markdown notes, change card-box membership, merge Markdown notes after checking a live preview, or delete the selection.',
      selectionModes: ['Click to select', 'Shift-select a range', 'Select all'],
      actions: ['Move', 'Add / remove tags', 'Set / remove properties', 'Add / remove from box', 'Merge with preview', 'Delete'],
      mediaAlt:
        'Demo: in the Journal folder, bulk mode is turned on; clicking the first card and Shift-clicking the third selects 3 notes; Merge selected opens a dialog with the title October journal and a preview of the merged note, and the new note appears at the top of the stream.',
      caption: 'Check the merged note in the preview before it is written; the source notes stay unless you choose to trash them.',
    },
    details: {
      kicker: 'Built for daily use',
      title: 'The small controls that keep a workspace moving.',
      body:
        'Card Workspace stays compact, predictable, and close to Obsidian’s own file model.',
      items: [
        { title: 'Arrange the stream', body: 'Sort, group by folder, tags, tasks, or properties, and pin the notes you need within each group.' },
        { title: 'Return quickly', body: 'Favorite folders, files, tags, and card boxes, and reveal the active note’s folder in the navigation.' },
        { title: 'Tidy the navigation', body: 'Hide the sections and items you don’t use, and keep tags safe: renames and deletes update notes, filters, favorites, and card-box rules.' },
        { title: 'Preview or open your way', body: 'Hover-preview a note, or open it in the current tab, a new tab, a split, or a window.' },
        { title: 'Stay responsive at scale', body: 'Virtualized card rendering keeps large vault sources practical to scan.' },
        { title: 'Keep the vault private', body: 'Search, indexing, and file operations stay local; notes remain in their existing folders.' },
      ],
    },
    cta: {
      title: 'Turn scattered notes into a working understanding.',
      body:
        'Browse by structure, filter by meaning, follow connections, and keep the result beside the note you are writing.',
      primaryCta: 'Install from Community Plugins',
      primaryHref: COMMUNITY_PLUGIN,
      secondaryCta: 'Read the docs',
      secondaryHref: docs('en', 'guides/introduction'),
    },
    footer: {
      tagline: 'Context gathered. Ideas reframed. Notes still yours.',
      links: [
        { label: 'Documentation', href: docs('en', 'guides/introduction') },
        { label: 'Installation', href: docs('en', 'guides/installation') },
        { label: 'GitHub', href: REPO },
        { label: 'Releases', href: RELEASES },
      ],
      legal: `GPL-3.0-only · Card Workspace ${VERSION}`,
    },
  },
  zh: {
    version: VERSION,
    versionTitle: versionTitle.zh,
    versionHref: RELEASES,
    themeLabel: '切换颜色主题',
    languageMenuLabel: '选择语言',
    languageHref: homeHref('en'),
    docsLabel: '文档',
    docsHref: docs('zh', 'guides/introduction'),
    repoLabel: repoLabel.zh,
    repoHref: REPO,
    clipPlayLabel: '播放这段录屏',
    clipPauseLabel: '暂停这段录屏',
    hero: {
      eyebrow: `Obsidian 桌面端插件 · ${VERSION}`,
      headline: ['汇集，整理，重构——', '理解'],
      headlineCompact: ['汇集，整理，', '重构——', '理解'],
      lede:
        'Card Workspace 把文件夹、标签、属性、出链、反链与卡片盒汇集成编辑器旁一条可读的卡片流。找到上下文，整理成视角，再把有用的内容带回正在写的笔记。',
      primaryCta: '从 Obsidian 插件市场安装',
      primaryHref: COMMUNITY_PLUGIN,
      secondaryCta: '查看文档',
      secondaryHref: docs('zh', 'guides/introduction'),
      meta: 'Obsidian 1.11.4+ · 仅桌面端 · 本地运行',
      mediaAlt:
        '演示：Obsidian 中的 Card Workspace 与编辑器并排。卡片流显示整个仓库，带图片的笔记显示缩略图；点击“神经科学”标签后收窄为 4 篇笔记，点击“深度工作”卡片打开这篇笔记，再点击笔记里的链接，选中的卡片随之移到“任务切换的代价”。',
      caption: '点标签收窄卡片流，点卡片打开笔记；选中状态跟随正在阅读的笔记。',
    },
    images: {
      kicker: '识别',
      title: '看图就能认出笔记。',
      body:
        'Markdown 卡片会显示笔记中嵌入的第一张本地图片，菜谱、旅行和资料一眼就能认出。可以放在右侧做缩略图，也可以在标题下方整幅显示；支持裁切铺满或完整显示，也可以关闭图片。',
      labels: ['右侧缩略图', '标题下方内联', '裁切或完整显示', '仅本地图片'],
      mediaAlt: '演示：卡片右侧显示照片缩略图；在 Card Workspace 设置中把“卡片图片”切换为“标题下方内联图片”，滚动卡片流，每张照片整幅显示在标题下方。',
      caption: '在设置中切换右侧缩略图与内联图片，卡片流立即重新排版。',
    },
    boxes: {
      kicker: '整理',
      title: '把有用的视角，整理成可复用的工作区。',
      body:
        '把当前的文件夹、标签或属性视角保存成卡片盒，它会持续收集符合规则的笔记。也可以手动加入或移出单篇笔记，并为每个盒子保留独立的排序、分组和置顶。源文件仍留在原处。',
      support: '适合研究主题、长期项目、阅读清单，也适合保存一组双链笔记的快照。',
      mediaAlt: '演示：选中“神经科学”标签后，把当前视角保存为名为“专注研究”的卡片盒；对话框显示匹配的笔记数，新盒子出现在导航中，再从“排序与分组”菜单按文件夹分组。',
      caption: '每个盒子保留自己的规则，以及独立的分组和排序。',
    },
    gather: {
      kicker: '汇集',
      title: '从仓库已有的结构出发，汇集需要的内容。',
      body:
        '选择一个文件夹，按需包含子文件夹，再用标签或 frontmatter 属性收窄卡片流。切换筛选类型会替换上一种条件，让当前视角更容易理解。文件夹可以拖动移动或调整顺序，标签和属性也能按你的思路排列。',
      labels: ['文件夹范围', '包含子文件夹', '标签或属性', '拖动排序'],
      mediaAlt: '演示：选择“读书笔记”文件夹，卡片流随之更新；“神经科学”标签进一步收窄，属性值“状态：已完成”替换标签筛选，最后把“研究”文件夹拖到文件夹列表顶部。',
      caption: '先选文件夹，再选标签或属性值；每一步的数量都清楚可见。',
    },
    drag: {
      kicker: '重构',
      title: '把有用的上下文，带回正在写的笔记。',
      body:
        '把 Markdown 卡片拖进编辑器，在光标处松手。可以插入 wikilink、嵌入、正文或“标题 + 正文”，既可每次选择，也可设置默认。开启标题拖拽后，还能只带入其中一个章节。',
      actions: ['Wikilink', '嵌入', '正文', '标题 + 正文'],
      mediaAlt:
        '演示：把“心流的条件”卡片拖进正在写的笔记的“延伸阅读”列表，松手后弹出菜单，可以插入 wiki link、嵌入、正文或标题与正文；选择 wiki link 后，链接插入光标处。',
      mediaCaption: '把卡片拖到光标处，松手后选择 wikilink、嵌入、正文或标题 + 正文。',
    },
    search: {
      kicker: '本地搜索',
      title: '找到正文里的那句话，而不只是文件名。',
      body:
        '在当前文件夹、卡片盒、出链或反链中使用本地全文搜索。它针对连续中文文本做了专门优化，也支持中英文混合查询。每张卡片显示命中处的短片段并高亮命中词，附带命中数；点击片段即可打开笔记并定位到原文。最近的查询保存在搜索历史中，仓库内容全程不离开本机。',
      labels: ['连续中文检索', '中英文混合查询', '命中片段', '点击定位', '搜索历史'],
      mediaAlt: '演示：在卡片侧栏搜索“打断”，找到 9 篇笔记，摘要高亮命中并显示每篇命中数；点击摘要片段即打开笔记并定位到原文。',
      caption: '高亮片段说明每篇为何命中；点击片段，直达原文位置。',
    },
    links: {
      kicker: '保留语境',
      title: '在赋予连接意义的笔记旁，读懂双链。',
      body:
        '打开当前笔记的反链或出链。卡片按引用次数排序，每条反链都会显示引用它的段落；点击段落，直接打开引用处所在的那一行。来源可以跟随编辑器，也可以固定下来，再去查看其他笔记。',
      labels: ['反链 + 出链', '按引用次数排序', '引用段落', '点击定位', '固定来源'],
      mediaAlt: '演示：打开“深度工作”后切换到反链，引用它的笔记按引用次数排列，并显示引用段落；固定来源后，点击一篇访谈笔记中的段落，打开那篇笔记并定位到引用的句子。',
      caption: '不只看到谁引用了它，还能看到怎么引用；点击即可打开引用原文。',
    },
    bulk: {
      kicker: '批量整理',
      title: '像整理一篇笔记那样，稳妥地整理一组。',
      body:
        '进入批量模式后，点击选择单张卡片，Shift+点击连续选择，或全选当前视角。随后可移动笔记、添加或移除标签、统一设置或移除 Markdown 笔记的属性、加入或移出卡片盒、在实时预览中确认后合并 Markdown 笔记，或删除所选内容。',
      selectionModes: ['点击选择', 'Shift 连选', '全选'],
      actions: ['移动', '添加 / 移除标签', '设置 / 移除属性', '加入 / 移出卡片盒', '预览后合并', '删除'],
      mediaAlt: '演示：在“日志”文件夹中进入批量模式，点击第一张卡片、Shift+点击第三张，选中 3 篇笔记；点击“合并所选”打开对话框，标题填写“十月日志”并预览合并结果，新笔记出现在卡片流顶部。',
      caption: '写入前先在预览中检查合并结果；除非选择移入废纸篓，源笔记都会保留。',
    },
    details: {
      kicker: '日常使用',
      title: '让工作区持续顺手的细节。',
      body: 'Card Workspace 保持紧凑、可预测，也始终贴近 Obsidian 原有的文件模型。',
      items: [
        { title: '整理卡片流', body: '按文件夹、标签、任务或属性分组，折叠分组，并在组内置顶需要的笔记。' },
        { title: '快速返回', body: '收藏文件夹、文件、标签和卡片盒，也能在导航中定位当前笔记所在的文件夹。' },
        { title: '整理导航', body: '隐藏用不到的分区和条目；重命名或删除标签时会同步更新笔记、筛选、收藏与卡片盒规则。' },
        { title: '按习惯预览或打开', body: '悬停预览笔记，也可在当前标签页、新标签页、分栏或新窗口中打开。' },
        { title: '大仓库依然流畅', body: '卡片流采用虚拟化渲染，大型来源也能保持实用的浏览体验。' },
        { title: '内容留在本地', body: '搜索、索引与文件操作都在本地完成；笔记仍留在原有文件夹。' },
      ],
    },
    cta: {
      title: '让分散的笔记，形成可用的理解。',
      body: '按结构浏览，按意义筛选，沿连接发现，并把结果始终放在正在写的笔记旁边。',
      primaryCta: '从 Obsidian 插件市场安装',
      primaryHref: COMMUNITY_PLUGIN,
      secondaryCta: '查看文档',
      secondaryHref: docs('zh', 'guides/introduction'),
    },
    footer: {
      tagline: '汇集上下文，重构想法，笔记仍属于你。',
      links: [
        { label: '使用文档', href: docs('zh', 'guides/introduction') },
        { label: '安装说明', href: docs('zh', 'guides/installation') },
        { label: 'GitHub', href: REPO },
        { label: '版本发布', href: RELEASES },
      ],
      legal: `GPL-3.0-only 许可证 · Card Workspace ${VERSION}`,
    },
  },
};

export function getLanding(locale: Locale): LandingCopy {
  return landing[locale];
}
