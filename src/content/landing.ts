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
  browse: {
    kicker: string;
    title: string;
    body: string;
    labels: string[];
    mediaAlt: string;
    mediaCaption: string;
  };
  drag: {
    kicker: string;
    title: string;
    body: string;
    actions: string[];
    mediaAlt: string;
    mediaCaption: string;
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
    browse: {
      kicker: 'Gather',
      title: 'Gather the context around a note.',
      body:
        'Move through folders and tags, narrow a source by property, or follow the active note through its outgoing links and backlinks. Excerpt-rich cards, local search, and editor sync keep every useful path in one compact workspace.',
      labels: ['Folders + tags', 'Property filters', 'Outgoing links', 'Backlinks', 'Local search', 'Editor sync'],
      mediaAlt:
        'Screen recording: selecting outgoing links around a note, narrowing the linked cards by workflow property, opening a card in the editor, and switching to backlinks.',
      mediaCaption: 'Follow outgoing links and backlinks, then narrow the linked cards by property.',
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
      headline: ['汇集。整理。重构——', '形成理解。'],
      headlineCompact: ['汇集。整理。', '重构——', '形成理解。'],
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
    browse: {
      kicker: '汇集',
      title: '从一篇笔记周围，汇集完整的上下文。',
      body:
        '沿着文件夹和标签浏览，用属性收窄来源，或跟随当前笔记查看出链与反链。带摘要的卡片、本地搜索和编辑器同步，让每一条有用的路径都留在同一个紧凑工作区。',
      labels: ['文件夹 + 标签', '属性筛选', '出链', '反链', '本地搜索', '编辑器同步'],
      mediaAlt:
        '录屏：查看一篇笔记的出链，按 workflow 属性收窄关联卡片，在编辑器中打开卡片，然后切换到反链。',
      mediaCaption: '沿出链和反链汇集上下文，再用属性收窄关联卡片。',
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
