export type Locale = 'en' | 'zh';

export interface NavItem {
  label: string;
  href: string;
}

export interface ProofItem {
  title: string;
  body: string;
}

export interface FooterLink {
  label: string;
  href: string;
}

export interface LandingCopy {
  lang: Locale;
  version: string;
  versionTitle: string;
  themeLabel: string;
  languageLabel: string;
  languageHref: string;
  languageCode: string;
  nav: NavItem[];
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
    mediaLabel: string;
    mediaTitle: string;
    mediaBrief: string;
  };
  boxes: {
    kicker: string;
    title: string;
    body: string;
    support: string;
    conceptLabel: string;
    conceptTitle: string;
    ruleOne: string;
    ruleTwo: string;
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
    mediaLabel: string;
    mediaTitle: string;
    mediaBrief: string;
  };
  drag: {
    kicker: string;
    title: string;
    body: string;
    actions: string[];
    mediaLabel: string;
    mediaTitle: string;
    mediaBrief: string;
  };
  proof: {
    kicker: string;
    title: string;
    items: ProofItem[];
    capabilities: string;
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

const RELEASES = 'https://github.com/kenanlian/obsidian-card-workspace/releases';
const REPO = 'https://github.com/kenanlian/obsidian-card-workspace';

function docs(locale: Locale, slug: string): string {
  return `/card-workspace-site/${locale}/${slug}/`;
}

export const landing: Record<Locale, LandingCopy> = {
  en: {
    lang: 'en',
    version: 'v1.1.5',
    versionTitle: 'Card Workspace v1.1.5 on GitHub Releases',
    themeLabel: 'Switch color theme',
    languageLabel: 'Read this page in Simplified Chinese',
    languageHref: '/card-workspace-site/zh/',
    languageCode: '中文',
    nav: [
      { label: 'Card boxes', href: '#card-boxes' },
      { label: 'Browse', href: '#browse' },
      { label: 'Drag to write', href: '#drag' },
      { label: 'Docs', href: docs('en', 'guides/introduction') },
    ],
    hero: {
      eyebrow: 'Obsidian desktop plugin · v1.1.5',
      headline: ['Browse your vault', 'as cards,', 'not filenames.'],
      headlineCompact: ['Browse your vault', 'as cards,', 'not filenames.'],
      lede:
        'Card Workspace turns folders and tags into an excerpt-rich card stream in Obsidian’s left sidebar. See what each note says, open it beside your work, or drag it into the note you’re writing.',
      primaryCta: 'Install from GitHub',
      primaryHref: RELEASES,
      secondaryCta: 'Read the docs',
      secondaryHref: docs('en', 'guides/getting-started'),
      meta: 'Obsidian 1.9+ · Desktop only · Runs locally',
      mediaLabel: 'Product screenshot slot · 16:10',
      mediaTitle: 'The complete browsing loop, beside the editor',
      mediaBrief:
        'Capture a populated sidebar with folders, tags, card boxes, and favorites; show 4–6 readable Markdown cards, one selected card, and its corresponding note open in the editor.',
    },
    boxes: {
      kicker: 'Card boxes',
      title: 'Card boxes collect what folders can’t.',
      body:
        'Save the current folder and tag scope as a card box, and matching notes keep appearing as the vault changes. Add individual notes when needed, remove the ones you do not want, and keep each box’s own sort and pins. The source files stay where they are.',
      support:
        'Made for research topics, long-running projects, reading lists, and any collection that crosses folder boundaries.',
      conceptLabel: 'Rule model · accurate example',
      conceptTitle: 'Field research',
      ruleOne: 'Projects/Research',
      ruleTwo: 'Sources/Interviews',
      and: 'AND',
      or: 'OR',
      manual: 'Manually added',
      manualNote: 'synthesis-map.md',
      excluded: 'Excluded',
      excludedNote: 'meeting-scratch.md',
      boxState: 'Modified date ↓ · 2 pinned at top',
      precedence: 'Manual inclusion wins over exclusion.',
    },
    browse: {
      kicker: 'Browse',
      title: 'Keep the whole browsing loop beside your editor.',
      body:
        'Card Workspace keeps folders, tags, favorites, and card boxes beside the card stream. Markdown notes show readable previews; scoped search highlights matching text and counts. Open a card in the editor, or switch notes in the editor and let the card stream follow.',
      labels: ['Excerpt previews', 'Task status', 'Hover preview', 'Current-scope search', 'Chinese matching', 'Two-way sync'],
      mediaLabel: 'Future product clip · 16:10 · 5 seconds',
      mediaTitle: 'Scope, search, open, follow',
      mediaBrief:
        'Switch folders, type a Chinese query, reveal highlights and per-note match counts, open a result, then show editor-to-card selection sync.',
    },
    drag: {
      kicker: 'Writing flow',
      title: 'Drag a useful card into the note you’re writing.',
      body:
        'Drop a Markdown card at a specific position in the editor, then insert a wikilink, an embed, the note body, or its title and body. Choose every time or make one action the default.',
      actions: ['Wikilink', 'Embed', 'Content', 'Title + content'],
      mediaLabel: 'Future product clip · 16:10 · 4–6 seconds',
      mediaTitle: 'From card to draft in one drop',
      mediaBrief:
        'Show the drag ghost leaving the card stream, the drop menu at the editor cursor, and the chosen result inserted into the note.',
    },
    proof: {
      kicker: 'Built for daily use',
      title: 'Quiet engineering where it matters.',
      items: [
        {
          title: 'Chinese-aware local search',
          body: 'Titles and Markdown bodies are indexed locally, with matches highlighted directly on each card.',
        },
        {
          title: 'Only visible cards are rendered',
          body: 'The virtualized stream avoids mounting the full result set at once.',
        },
        {
          title: 'Processing stays on your device',
          body: 'Card Workspace makes no network requests. Search indexing and file operations stay local.',
        },
      ],
      capabilities:
        'Also included: favorites, pins, task counts, hover preview, sorting, bulk organization, complete file context menus, and Markdown, Base, Canvas, and Excalidraw cards.',
    },
    cta: {
      title: 'Replace the file list with cards you can read.',
      body:
        'Card Workspace is installed manually from GitHub Releases and supports Obsidian 1.9.0 or later on desktop.',
      primaryCta: 'Download from GitHub Releases',
      primaryHref: RELEASES,
      secondaryCta: 'Read installation guide',
      secondaryHref: docs('en', 'guides/installation'),
    },
    footer: {
      tagline: 'Readable notes, beside the note you are writing.',
      links: [
        { label: 'Documentation', href: docs('en', 'guides/introduction') },
        { label: 'Installation', href: docs('en', 'guides/installation') },
        { label: 'GitHub', href: REPO },
        { label: 'Releases', href: RELEASES },
      ],
      legal: 'MIT licensed · Card Workspace v1.1.5',
    },
  },
  zh: {
    lang: 'zh',
    version: 'v1.1.5',
    versionTitle: '在 GitHub Releases 查看 Card Workspace v1.1.5',
    themeLabel: '切换颜色主题',
    languageLabel: 'View this page in English',
    languageHref: '/card-workspace-site/en/',
    languageCode: 'EN',
    nav: [
      { label: '卡片盒', href: '#card-boxes' },
      { label: '浏览', href: '#browse' },
      { label: '拖入写作', href: '#drag' },
      { label: '文档', href: docs('zh', 'guides/introduction') },
    ],
    hero: {
      eyebrow: 'Obsidian 桌面端插件 · v1.1.5',
      headline: ['把仓库读成卡片，', '而不是一串文件名。'],
      headlineCompact: ['把仓库读成卡片，', '而不是', '一串文件名。'],
      lede:
        'Card Workspace 在 Obsidian 左侧栏把文件夹和标签变成带摘要的卡片流。扫一眼就知道笔记里写了什么，点开继续读，或直接拖进正在写的页面。',
      primaryCta: '从 GitHub 安装',
      primaryHref: RELEASES,
      secondaryCta: '查看文档',
      secondaryHref: docs('zh', 'guides/getting-started'),
      meta: 'Obsidian 1.9+ · 仅桌面端 · 本地运行',
      mediaLabel: '产品截图位置 · 16:10',
      mediaTitle: '编辑器旁边的完整浏览闭环',
      mediaBrief:
        '未来截图：左侧栏中填充文件夹、标签、卡片盒与收藏；显示 4–6 张可读卡片、当前选中的卡片，以及编辑器中对应打开的笔记。',
    },
    boxes: {
      kicker: '卡片盒',
      title: '卡片盒装得下文件夹装不下的东西。',
      body:
        '把当前的文件夹和标签保存成一个卡片盒，它会持续收集符合规则的笔记。临时需要的可以手动加入，不想看到的可以移出。笔记仍留在原来的文件夹，每个卡片盒可以保留自己的排序和置顶。',
      support: '适合研究主题、长期项目、阅读清单，以及任何跨越文件夹的笔记集合。',
      conceptLabel: '规则模型 · 准确示例',
      conceptTitle: '田野研究',
      ruleOne: 'Projects/Research',
      ruleTwo: 'Sources/Interviews',
      and: '且',
      or: '或',
      manual: '手动加入',
      manualNote: 'synthesis-map.md',
      excluded: '排除',
      excludedNote: 'meeting-scratch.md',
      boxState: '修改时间 ↓ · 2 张卡片置顶',
      precedence: '手动加入优先于排除。',
    },
    browse: {
      kicker: '浏览',
      title: '整个浏览过程，都留在编辑器旁边。',
      body:
        'Card Workspace 自带文件夹、标签、收藏和卡片盒导航。选定范围后，Markdown 笔记会显示为带摘要的卡片；在当前范围内搜索时，命中的文字和次数直接出现在卡片上。点开一张卡片，编辑器随即打开；从编辑器切换笔记，卡片流也会跟着高亮。',
      labels: ['摘要预览', '任务状态', '悬停预览', '当前范围搜索', '中文匹配', '双向同步'],
      mediaLabel: '未来产品录屏 · 16:10 · 5 秒',
      mediaTitle: '切换范围、搜索、打开、跟随',
      mediaBrief:
        '未来录屏：切换文件夹，输入一条中文查询，显示高亮与每篇笔记的命中次数，打开结果，再展示编辑器与卡片选择同步。',
    },
    drag: {
      kicker: '写作流',
      title: '看到有用的卡片，直接拖进正在写的笔记。',
      body:
        '把 Markdown 卡片拖到编辑器中的具体位置，松手后可以插入 wikilink、嵌入、正文，或“标题 + 正文”。常用方式可以设为默认，也可以每次选择。',
      actions: ['Wikilink', '嵌入', '正文', '标题 + 正文'],
      mediaLabel: '未来产品录屏 · 16:10 · 4–6 秒',
      mediaTitle: '拖一下，把卡片放进草稿',
      mediaBrief:
        '未来录屏：展示卡片离开卡片流时的拖拽影子、编辑器光标旁的放置菜单，以及选择后插入的结果。',
    },
    proof: {
      kicker: '日常使用',
      title: '把工程细节用在真正重要的地方。',
      items: [
        {
          title: '中文也能直接搜索',
          body: '标题和 Markdown 正文使用本地索引。搜索结果在卡片中高亮，并显示每篇笔记的命中次数。',
        },
        {
          title: '卡片流只渲染可见部分',
          body: '虚拟化布局不会一次渲染完整列表，较大的文件夹和卡片盒也能保持可用。',
        },
        {
          title: '所有处理都留在本机',
          body: 'Card Workspace 不发起网络请求。搜索索引和文件操作都在本地完成，笔记仍然保存在原来的仓库中。',
        },
      ],
      capabilities:
        '还包括：收藏、置顶、任务状态、悬停预览、排序、批量整理、完整的文件右键菜单，以及 Markdown、Base、Canvas、Excalidraw 卡片。',
    },
    cta: {
      title: '把文件列表换成能读的卡片。',
      body: 'Card Workspace 目前通过 GitHub Releases 手动安装，支持 Obsidian 1.9.0 及以上桌面端。',
      primaryCta: '从 GitHub Releases 下载',
      primaryHref: RELEASES,
      secondaryCta: '查看安装说明',
      secondaryHref: docs('zh', 'guides/installation'),
    },
    footer: {
      tagline: '能读的笔记，就在正在写的笔记旁边。',
      links: [
        { label: '使用文档', href: docs('zh', 'guides/introduction') },
        { label: '安装说明', href: docs('zh', 'guides/installation') },
        { label: 'GitHub', href: REPO },
        { label: '版本发布', href: RELEASES },
      ],
      legal: 'MIT 许可证 · Card Workspace v1.1.5',
    },
  },
};

export function getLanding(locale: Locale): LandingCopy {
  return landing[locale];
}
