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
  lang: Locale;
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
  };
  boxes: {
    kicker: string;
    title: string;
    body: string;
    support: string;
    conceptLabel: string;
    conceptTitle: string;
    ruleOne: string;
    ruleOneProperty: string;
    ruleTwo: string;
    ruleTwoProperty: string;
    and: string;
    or: string;
    manual: string;
    manualNote: string;
    excluded: string;
    excludedNote: string;
    boxState: string;
    precedence: string;
  };
  gather: {
    kicker: string;
    title: string;
    body: string;
    labels: string[];
    conceptLabel: string;
    conceptTitle: string;
    folderLabel: string;
    folder: string;
    scope: string;
    tagLabel: string;
    tag: string;
    propertyLabel: string;
    property: string;
    resultCount: string;
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
    conceptLabel: string;
    localLabel: string;
    queryLabel: string;
    query: string;
    resultOneTitle: string;
    resultOneBefore: string;
    resultOneHit: string;
    resultOneAfter: string;
    resultOneCount: string;
    resultTwoTitle: string;
    resultTwoBefore: string;
    resultTwoHit: string;
    resultTwoAfter: string;
    resultTwoCount: string;
    mediaAlt: string;
    caption: string;
  };
  links: {
    kicker: string;
    title: string;
    body: string;
    labels: string[];
    conceptLabel: string;
    sourceLabel: string;
    source: string;
    following: string;
    pinned: string;
    outgoing: string;
    backlinks: string;
    resultOne: string;
    resultOneMeta: string;
    resultTwo: string;
    resultTwoMeta: string;
    searchLabel: string;
    saveLabel: string;
    mediaAlt: string;
    caption: string;
  };
  bulk: {
    kicker: string;
    title: string;
    body: string;
    selectionModes: string[];
    actions: string[];
    conceptLabel: string;
    selectedLabel: string;
    selectedCount: string;
    selectionOne: string;
    selectionTwo: string;
    mergeTitle: string;
    mergeFromLabel: string;
    mergeFrom: string;
    mergeToLabel: string;
    mergeTo: string;
    previewLabel: string;
    previewLines: string[];
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
    lang: 'en',
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
      meta: 'Obsidian 1.9+ · Desktop only · Runs locally',
      mediaAlt:
        'Card Workspace in Obsidian: folders, tags, properties, card boxes, and links sit beside a stream of excerpt-rich note cards, with the selected card open in the editor.',
    },
    boxes: {
      kicker: 'Organize',
      title: 'Turn a useful view into a reusable workspace.',
      body:
        'Save a folder, tag, and property view as a card box, and matching notes keep appearing as the vault changes. Add or remove individual notes, then give each box its own sort, grouping, and pins. The source files stay where they are.',
      support:
        'Use a box for research topics, long-running projects, reading lists, or a snapshot of linked notes.',
      conceptLabel: 'Rule model · accurate example',
      conceptTitle: 'Field research',
      ruleOne: 'Projects/Research',
      ruleOneProperty: 'status = active',
      ruleTwo: 'Sources/Interviews',
      ruleTwoProperty: 'type = source',
      and: 'AND',
      or: 'OR',
      manual: 'Manually added',
      manualNote: 'synthesis-map.md',
      excluded: 'Excluded',
      excludedNote: 'meeting-scratch.md',
      boxState: 'Grouped by rule · Modified ↓ · 2 pinned',
      precedence: 'Manual inclusion wins over exclusion.',
    },
    gather: {
      kicker: 'Gather',
      title: 'Start with the structure your vault already has.',
      body:
        'Choose a folder, include its subfolders when useful, then narrow the card stream with tags and frontmatter properties. You keep the structure you know while the view becomes precise enough for the work at hand.',
      labels: ['Folder scope', 'Include subfolders', 'Multiple tags together', 'Frontmatter properties'],
      conceptLabel: 'Live folder view',
      conceptTitle: 'Research notes',
      folderLabel: 'Folder',
      folder: 'Projects / Research',
      scope: 'Including subfolders',
      tagLabel: 'Tags',
      tag: '#method + #fieldwork',
      propertyLabel: 'Property',
      property: 'status = active',
      resultCount: '24 matching notes',
      mediaAlt:
        'Screen recording: moving from the vault root into a folder, selecting nested tags, and narrowing the card stream with a workflow property.',
      caption: 'Folder, tag, and property filters shape one readable stream.',
    },
    drag: {
      kicker: 'Reframe',
      title: 'Bring useful context into the note you’re writing.',
      body:
        'Open a connected note beside your work, or drop a Markdown card at a precise editor position. Insert a wikilink, an embed, the note body, or its title and body—choosing each time or setting a default.',
      actions: ['Wikilink', 'Embed', 'Content', 'Title + content'],
      mediaAlt:
        'Screen recording: a card is dragged from the card stream to the editor cursor, and the drop menu offers insert wiki link, insert embed link, insert card content, and insert card title and content.',
      mediaCaption: 'Drop a card at the cursor, then choose wikilink, embed, content, or title + content.',
    },
    search: {
      kicker: 'Search locally',
      title: 'Find the passage, not just the filename.',
      body:
        'Search the current folder, card box, outgoing links, or backlinks with a local full-text index. Matching text is highlighted inside Markdown excerpts, and each card shows its hit count without sending vault content anywhere.',
      labels: ['Current source only', 'Full-text excerpts', 'Hit highlighting + counts', 'Local index'],
      conceptLabel: 'Search in this view',
      localLabel: 'Local index',
      queryLabel: 'Query',
      query: 'field notes',
      resultOneTitle: 'Interview synthesis.md',
      resultOneBefore: 'The ',
      resultOneHit: 'field notes',
      resultOneAfter: ' reveal where the working model breaks down…',
      resultOneCount: '4 hits',
      resultTwoTitle: 'Research protocol.md',
      resultTwoBefore: 'Compare the original ',
      resultTwoHit: 'field notes',
      resultTwoAfter: ' with the interview synthesis…',
      resultTwoCount: '2 hits',
      mediaAlt:
        'Screen recording: opening search in the current card view and typing a query to highlight matching text across note excerpts.',
      caption: 'Highlighted matches and per-note counts keep the search result scannable.',
    },
    links: {
      kicker: 'Keep context',
      title: 'Read the link graph beside the note that gives it meaning.',
      body:
        'Switch between outgoing links and backlinks around the active note. Let the source follow the editor, pin it while you inspect other notes, search the linked set locally, or save the visible cards as a fixed card-box snapshot.',
      labels: ['Outgoing links + backlinks', 'Follow active note', 'Pin source', 'Local search', 'Save snapshot'],
      conceptLabel: 'Linked-note source',
      sourceLabel: 'Source note',
      source: 'Synthesis map.md',
      following: 'Following editor',
      pinned: 'Pin source',
      outgoing: 'Outgoing · 12',
      backlinks: 'Backlinks · 8',
      resultOne: 'Interview synthesis.md',
      resultOneMeta: 'Outgoing link · 3 search hits',
      resultTwo: 'Research index.md',
      resultTwoMeta: 'Outgoing link · modified today',
      searchLabel: 'Search linked notes',
      saveLabel: 'Save snapshot',
      mediaAlt:
        'Screen recording: following outgoing links from the active note, opening linked cards, then switching the link context while the editor stays visible.',
      caption: 'Link direction and source-note controls stay explicit; the saved box is a snapshot.',
    },
    bulk: {
      kicker: 'Act in bulk',
      title: 'Organize a set of notes as deliberately as one.',
      body:
        'Click to select individual cards, Shift-click a range, or select the whole view. Then move notes, add or remove tags, change card-box membership, merge Markdown notes with a live preview, or delete the selection.',
      selectionModes: ['Click to select', 'Shift-select a range', 'Select all'],
      actions: ['Move', 'Add / remove tags', 'Add / remove from box', 'Merge with preview', 'Delete'],
      conceptLabel: 'Bulk mode',
      selectedLabel: 'Selected',
      selectedCount: '6 notes',
      selectionOne: 'Interview synthesis.md',
      selectionTwo: 'Field observations.md',
      mergeTitle: 'Merge notes',
      mergeFromLabel: 'From',
      mergeFrom: '6 Markdown sources',
      mergeToLabel: 'To',
      mergeTo: 'Research synthesis.md',
      previewLabel: 'Live preview',
      previewLines: ['# Research synthesis', '## Interview synthesis', 'Shared themes and open questions…'],
      mediaAlt:
        'Screen recording: entering bulk mode, selecting several cards, merging the selected Markdown notes, and reviewing the merged result in the card stream.',
      caption: 'Selection stays visible while the live preview makes the merge easy to inspect.',
    },
    details: {
      kicker: 'Built for daily use',
      title: 'The small controls that keep a workspace moving.',
      body:
        'Card Workspace stays compact, predictable, and close to Obsidian’s own file model.',
      items: [
        { title: 'Arrange the stream', body: 'Sort, group, collapse groups, and pin the notes you need at the top.' },
        { title: 'Return quickly', body: 'Favorite folders, files, tags, and card boxes, then move through them from one navigation pane.' },
        { title: 'Maintain tags safely', body: 'Rename or delete tags with confirmation, updating notes, active filters, favorites, and card-box rules.' },
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
      legal: `MIT licensed · Card Workspace ${VERSION}`,
    },
  },
  zh: {
    lang: 'zh',
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
      meta: 'Obsidian 1.9+ · 仅桌面端 · 本地运行',
      mediaAlt:
        'Obsidian 中的 Card Workspace：文件夹、标签、属性、卡片盒与双链导航紧挨着带摘要的笔记卡片流，选中卡片对应的笔记正在编辑器中打开。',
    },
    boxes: {
      kicker: '整理',
      title: '把有用的视角，整理成可复用的工作区。',
      body:
        '把当前的文件夹、标签和属性视角保存成卡片盒，它会持续收集符合规则的笔记。也可以手动加入或移出单篇笔记，并为每个盒子保留独立的排序、分组和置顶。源文件仍留在原处。',
      support: '适合研究主题、长期项目、阅读清单，也适合保存一组双链笔记的快照。',
      conceptLabel: '规则模型 · 准确示例',
      conceptTitle: '田野研究',
      ruleOne: 'Projects/Research',
      ruleOneProperty: 'status = active',
      ruleTwo: 'Sources/Interviews',
      ruleTwoProperty: 'type = source',
      and: '且',
      or: '或',
      manual: '手动加入',
      manualNote: 'synthesis-map.md',
      excluded: '排除',
      excludedNote: 'meeting-scratch.md',
      boxState: '按规则分组 · 修改时间 ↓ · 2 张置顶',
      precedence: '手动加入优先于排除。',
    },
    gather: {
      kicker: '汇集',
      title: '从仓库已有的结构出发，汇集需要的内容。',
      body:
        '选择一个文件夹，按需包含子文件夹，再用标签与 frontmatter 属性收窄卡片流。熟悉的仓库结构没有改变，眼前的视角却足够精准。',
      labels: ['文件夹范围', '包含子文件夹', '多标签组合', 'Frontmatter 属性'],
      conceptLabel: '实时文件夹视角',
      conceptTitle: '研究笔记',
      folderLabel: '文件夹',
      folder: 'Projects / Research',
      scope: '包含子文件夹',
      tagLabel: '标签',
      tag: '#method + #fieldwork',
      propertyLabel: '属性',
      property: 'status = active',
      resultCount: '匹配 24 篇笔记',
      mediaAlt: '录屏：从仓库根目录进入文件夹，选择嵌套标签，再用 workflow 属性收窄卡片流。',
      caption: '用文件夹、标签和属性筛选，整理出一条可读的卡片流。',
    },
    drag: {
      kicker: '重构',
      title: '把有用的上下文，带回正在写的笔记。',
      body:
        '在编辑器旁打开关联笔记，或把 Markdown 卡片拖到正文中的具体位置。松手后可以插入 wikilink、嵌入、正文或“标题 + 正文”，既可每次选择，也可设置默认。',
      actions: ['Wikilink', '嵌入', '正文', '标题 + 正文'],
      mediaAlt:
        '录屏：把一张卡片从卡片流拖到编辑器光标处，松手后弹出菜单，可以选择插入 wikilink、插入嵌入链接、插入卡片正文，或插入卡片标题与正文。',
      mediaCaption: '把卡片拖到光标处，松手后选择 wikilink、嵌入、正文或标题 + 正文。',
    },
    search: {
      kicker: '本地搜索',
      title: '找到正文里的那句话，而不只是文件名。',
      body:
        '在当前文件夹、卡片盒、出链或反链中使用本地全文搜索。它针对连续中文文本做了专门优化，也支持中英文混合查询；Markdown 摘要会高亮命中内容并显示每篇笔记的命中数，全程无需上传仓库内容。',
      labels: ['连续中文检索', '中英文混合查询', '命中高亮与计数', '本地索引'],
      conceptLabel: '在当前视角中搜索',
      localLabel: '本地索引',
      queryLabel: '查询',
      query: '研究记录',
      resultOneTitle: '访谈综合.md',
      resultOneBefore: '这组',
      resultOneHit: '研究记录',
      resultOneAfter: '显示 API 模型仍有缺口……',
      resultOneCount: '命中 4 处',
      resultTwoTitle: '研究方案.md',
      resultTwoBefore: '逐项对照',
      resultTwoHit: '研究记录',
      resultTwoAfter: '与原始观察……',
      resultTwoCount: '命中 2 处',
      mediaAlt: '录屏：在当前卡片视角中打开搜索并输入查询，在多篇笔记摘要中高亮匹配正文。',
      caption: '高亮正文命中并显示每篇计数，让搜索结果一眼可扫。',
    },
    links: {
      kicker: '保留语境',
      title: '在赋予连接意义的笔记旁，读懂双链。',
      body:
        '围绕当前笔记切换出链与反链。可以跟随编辑器，也可以固定来源后继续查看其他笔记；还可在关联笔记中本地搜索，或把当前可见结果保存为固定的卡片盒快照。',
      labels: ['出链 + 反链', '跟随当前笔记', '固定来源', '本地搜索', '保存快照'],
      conceptLabel: '双链来源',
      sourceLabel: '来源笔记',
      source: '综合地图.md',
      following: '跟随编辑器',
      pinned: '固定来源',
      outgoing: '出链 · 12',
      backlinks: '反链 · 8',
      resultOne: '访谈综合.md',
      resultOneMeta: '出链 · 搜索命中 3 处',
      resultTwo: '研究索引.md',
      resultTwoMeta: '出链 · 今天修改',
      searchLabel: '搜索关联笔记',
      saveLabel: '保存快照',
      mediaAlt: '录屏：从当前笔记查看出链，打开关联卡片，再切换双链上下文，同时保持编辑器可见。',
      caption: '连接方向和来源控制清晰可见；保存得到的是固定快照。',
    },
    bulk: {
      kicker: '批量整理',
      title: '像整理一篇笔记那样，稳妥地整理一组。',
      body:
        '点击选择单张卡片，Shift+点击连续选择，或全选当前视角。随后可移动笔记、添加或移除标签、加入或移出卡片盒、通过实时预览合并 Markdown 笔记，或删除所选内容。',
      selectionModes: ['点击选择', 'Shift 连选', '全选'],
      actions: ['移动', '添加 / 移除标签', '加入 / 移出卡片盒', '预览后合并', '删除'],
      conceptLabel: '批量模式',
      selectedLabel: '已选择',
      selectedCount: '6 篇笔记',
      selectionOne: '访谈综合.md',
      selectionTwo: '田野观察.md',
      mergeTitle: '合并笔记',
      mergeFromLabel: '来源',
      mergeFrom: '6 篇 Markdown 来源',
      mergeToLabel: '目标',
      mergeTo: '研究综合.md',
      previewLabel: '实时预览',
      previewLines: ['# 研究综合', '## 访谈综合', '共同主题与待解问题……'],
      mediaAlt: '录屏：进入批量模式，选择多张卡片，合并所选 Markdown 笔记，并在卡片流中检查合并结果。',
      caption: '选择范围始终可见，实时预览让合并前的结果清楚可查。',
    },
    details: {
      kicker: '日常使用',
      title: '让工作区持续顺手的细节。',
      body: 'Card Workspace 保持紧凑、可预测，也始终贴近 Obsidian 原有的文件模型。',
      items: [
        { title: '整理卡片流', body: '排序、分组、折叠分组，并把需要的笔记置顶。' },
        { title: '快速返回', body: '收藏文件夹、文件、标签和卡片盒，再从同一导航栏往返。' },
        { title: '安全维护标签', body: '确认后重命名或删除标签，并同步更新笔记、活动筛选、收藏与卡片盒规则。' },
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
      legal: `MIT 许可证 · Card Workspace ${VERSION}`,
    },
  },
};

export function getLanding(locale: Locale): LandingCopy {
  return landing[locale];
}
