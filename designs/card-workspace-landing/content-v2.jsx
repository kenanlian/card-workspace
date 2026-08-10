/* Card Workspace — v2 landing copy.
   Same provenance rule as v1: every claim traces to the plugin's README.md /
   manifest.json / i18n.ts, and anything unverified stays wrapped in TODO[] so it
   renders as a visible placeholder.

   Changes from v1's content.jsx:
   · hero.meta / hero.metaSoft / hero.installNote removed (requested)
   · hero.eyebrow no longer repeats the version — it now lives in the header badge
   · version + boxViz added for the header badge and the card-box diagram */

const CONTENT = {
  en: {
    lang: 'en',
    version: 'v1.0.2',
    versionTitle: 'Current release — v1.0.2',
    nav: [
      { label: 'Why', href: '#why' },
      { label: 'Boxes', href: '#boxes' },
      { label: 'In flow', href: '#flow' },
      { label: 'Scale', href: '#scale' },
      { label: 'Docs', href: '#install' },
    ],
    hero: {
      eyebrow: 'Obsidian plugin',
      // Deliberately not "infinite canvas" — the plugin is a sidebar card stream.
      headline: ['Browse your vault', 'as cards,', 'not filenames.'],
      headlineEmphasis: 1,
      tagline:
        'Card Workspace turns any folder, tag, or saved collection into a scannable card stream inside Obsidian’s sidebar — titles and excerpts, right beside the note you’re writing.',
      primaryCta: 'Get Card Workspace',
      secondaryCta: 'Read the docs',
      shotCaption: 'Card Workspace open in the left sidebar, navigation pane beside the card stream',
    },
    sections: {
      why: {
        index: '01',
        kicker: 'The premise',
        title: 'A file list gives you names. A card gives you the note.',
        body:
          'Every card carries the note’s title and a Markdown-stripped excerpt, so you can tell two similarly named notes apart without opening either. Click a card and the note opens in your main editor. Switch notes in the editor and the matching card selects itself — the panel never falls out of sync with what you’re reading.',
        points: [
          {
            term: 'Excerpt previews',
            desc: 'Titles plus clean excerpts with the Markdown syntax stripped out.',
          },
          {
            term: 'Two-way sync',
            desc: 'Click a card to open a note; change notes in the editor and the card follows.',
          },
          {
            term: 'Local search',
            desc: 'Indexed full-text search across the cards currently in scope.',
          },
        ],
        slot: 'Drop a close-up of two or three cards showing the title + excerpt treatment',
      },
      nav: {
        index: '02',
        kicker: 'Its own navigation',
        title: 'A second column that doesn’t borrow the File Explorer.',
        body:
          'Card Workspace renders its own navigation column next to the card stream, holding Folders, Tags, Boxes, and Favorites. Drag the divider to rebalance the two columns, or hide the column entirely and give the cards full width. Narrow the sidebar past two columns and the layout falls back to a single pane, with the header button swapping between navigation and cards — so the panel stays usable at any width.',
        points: [
          { term: 'Folders', desc: 'Scope to a folder, with or without its subfolders.' },
          { term: 'Tags', desc: 'Filter by tags read from both frontmatter and note body.' },
          { term: 'Boxes', desc: 'Saved rule-based collections that cut across folders.' },
          { term: 'Favorites', desc: 'Pin folders, files, tags, and boxes; grouped and reorderable.' },
        ],
        slot: 'Drop a shot of the navigation column with Folders / Tags / Boxes / Favorites visible',
      },
      boxes: {
        index: '03',
        kicker: 'The idea worth the install',
        title: 'Card boxes collect what folders can’t.',
        body:
          'A card box is a saved, topic-oriented collection. It keeps its own membership rules — a folder scope plus tags, combined with OR across rules — along with its own sort order and its own pins, and you can add or exclude individual notes by hand. Use one to gather notes that belong together conceptually but live in different folders, without moving a single file or maintaining an index note.',
        rules: [
          { op: 'scope', value: 'Projects/Research' },
          { op: 'or', value: '#method' },
          { op: 'or', value: '#fieldwork' },
          { op: 'minus', value: 'manually excluded notes' },
        ],
        aside:
          'Right-click in the Boxes section to create one, or save your current folder-and-tag scope as a box in a single step.',
        boxViz: {
          deckTitle: 'Research',
          deckLabel: 'card box',
          excluded: 'excluded by hand',
          caption: 'Rules gather matching notes out of different folders into one box. No file moves.',
        },
      },
      flow: {
        index: '04',
        kicker: 'Stays in your flow',
        title: 'Drag a card into the editor and it writes itself in.',
        body:
          'Drop a card into an open note to insert a wikilink, an embed, the note’s content, or its title plus content. The plugin can also ask which one you meant on every drop. Right-click almost anything for the rest: create notes, folders, canvases, and bases, rename, duplicate, move, delete, copy vault or system paths, reveal in your system file explorer, or search inside a folder.',
        points: [
          { term: 'Wikilink', desc: 'A plain link back to the note.' },
          { term: 'Embed', desc: 'Transclude the note where you dropped it.' },
          { term: 'Content', desc: 'Paste the note’s body inline.' },
          { term: 'Title + content', desc: 'Heading followed by the body.' },
        ],
        aside: 'Select several cards to move, delete, or merge notes in one pass.',
        slot: 'Drop a shot or short clip of a card being dragged into an open editor',
      },
      scale: {
        index: '05',
        kicker: 'Built for real vaults',
        title: 'Large folders stay smooth.',
        body:
          'Only the cards actually on screen get rendered, so a folder with thousands of notes scrolls like a short one. Search runs against a local index, and tag filtering reads tags from frontmatter and inline content alike.',
        points: [
          { term: 'Virtualized scrolling', desc: 'Only visible cards are rendered.' },
          { term: 'Indexed search', desc: 'Full-text search over the current scope.' },
          { term: 'Pin reordering', desc: 'Keep chosen cards at the top of the stream.' },
        ],
      },
      privacy: {
        index: '06',
        kicker: 'Privacy',
        title: 'Nothing leaves your vault.',
        body:
          'Card Workspace makes no external network requests. File operations go through Obsidian’s local Vault and FileManager APIs, and search indexing runs on the bundled local library. Your notes stay Markdown files on your disk.',
        badge: 'No network requests',
      },
      install: {
        index: '07',
        kicker: 'Get started',
        title: 'Add it to your vault.',
        body:
          'Card Workspace requires Obsidian 1.9.0 or later. Open the panel from the ribbon icon or run “Open Card Workspace view” from the command palette, then pick a folder, tag, or box to start browsing.',
        steps: [
          'Install the plugin',
          'Enable it under Community plugins',
          'Run “Open Card Workspace view”',
          'Pick a folder, tag, or box',
        ],
        primaryCta: 'Get Card Workspace',
        secondaryCta: 'View on GitHub',
        note: 'TODO[confirm install channel + mobile timeline before publishing]',
      },
    },
    footer: {
      tagline: 'A card-based workspace for Obsidian.',
      columns: [
        { title: 'Docs', links: ['Introduction', 'Installation', 'Getting started', 'Settings'] },
        { title: 'Project', links: ['GitHub', 'Releases', 'Issues', 'License (MIT)'] },
      ],
      legal: 'MIT licensed · Built by kenan.lian',
    },
    ui: {
      theme: 'Theme',
      language: 'Language',
      light: 'Light',
      dark: 'Dark',
      dropHint: 'Click or drop an image',
      clear: 'Clear',
    },
  },

  zh: {
    lang: 'zh',
    version: 'v1.0.2',
    versionTitle: '当前版本 —— v1.0.2',
    nav: [
      { label: '为什么', href: '#why' },
      { label: '卡片盒', href: '#boxes' },
      { label: '不打断', href: '#flow' },
      { label: '大库', href: '#scale' },
      { label: '文档', href: '#install' },
    ],
    hero: {
      eyebrow: 'Obsidian 插件',
      headline: ['把仓库读成卡片，', '而不是', '一串文件名。'],
      headlineEmphasis: 1,
      tagline:
        'Card Workspace 把任意文件夹、标签或已存集合变成 Obsidian 侧边栏里可扫读的卡片流——标题和摘要，就在你正在写的那篇笔记旁边。',
      primaryCta: '获取 Card Workspace',
      secondaryCta: '查看文档',
      shotCaption: 'Card Workspace 在左侧边栏展开，导航列与卡片流并置',
    },
    sections: {
      why: {
        index: '01',
        kicker: '前提',
        title: '文件列表只给名字，卡片给你笔记本身。',
        body:
          '每张卡片都带着笔记标题和一段剥离了 Markdown 语法的摘要，两篇名字相近的笔记不用打开就能分清。点一张卡片，笔记在主编辑区打开；在编辑器里切换笔记，对应的卡片会自动选中——面板不会和你正在读的内容脱节。',
        points: [
          { term: '摘要预览', desc: '标题加上剥离了 Markdown 语法的干净摘要。' },
          { term: '双向同步', desc: '点卡片打开笔记；在编辑器换笔记，卡片跟着走。' },
          { term: '本地搜索', desc: '对当前范围内的卡片做索引化全文检索。' },
        ],
        slot: '放一张卡片特写，展示标题与摘要的排版处理（两三张卡片即可）',
      },
      nav: {
        index: '02',
        kicker: '自带导航',
        title: '第二列导航，不占用文件管理器。',
        body:
          'Card Workspace 在卡片流旁边渲染自己的导航列，收纳文件夹、标签、卡片盒和收藏。拖动分隔条重新分配两列宽度，或者直接把导航列收起来让卡片占满。当侧边栏窄到放不下两列时，布局会自动降级为单栏，标题栏的按钮在导航和卡片之间切换——任何宽度下面板都还能用。',
        points: [
          { term: '文件夹', desc: '限定到某个文件夹，可选是否包含子文件夹。' },
          { term: '标签', desc: '按标签筛选，来源同时包含 frontmatter 和正文。' },
          { term: '卡片盒', desc: '已保存的规则集合，可以跨文件夹取材。' },
          { term: '收藏', desc: '收藏文件夹、文件、标签和卡片盒，分类排列且可重排。' },
        ],
        slot: '放一张导航列的截图，让文件夹 / 标签 / 卡片盒 / 收藏 四个分区都可见',
      },
      boxes: {
        index: '03',
        kicker: '真正值得装的那个功能',
        title: '卡片盒装得下文件夹装不下的东西。',
        body:
          '卡片盒是一个已保存的、面向主题的集合。它有自己的归属规则——一个文件夹范围加上标签，多条规则之间以 OR 组合——还有自己的排序和自己的置顶，你也可以手工加入或排除单篇笔记。用它来聚合那些概念上属于一起、却分散在不同文件夹里的笔记，不用移动任何文件，也不用维护索引笔记。',
        rules: [
          { op: 'scope', value: 'Projects/Research' },
          { op: 'or', value: '#method' },
          { op: 'or', value: '#fieldwork' },
          { op: 'minus', value: '手工排除的笔记' },
        ],
        aside:
          '在「卡片盒」分区右键即可新建，也可以把当前的文件夹与标签范围一步存成一个卡片盒。',
        boxViz: {
          deckTitle: 'Research',
          deckLabel: '卡片盒',
          excluded: '手工排除',
          caption: '规则把散落在不同文件夹里的笔记收拢进同一个盒子，文件一个都不用动。',
        },
      },
      flow: {
        index: '04',
        kicker: '不打断手上的事',
        title: '把卡片拖进编辑器，它自己会写进去。',
        body:
          '把卡片拖到打开的笔记里，可以插入 wikilink、嵌入、笔记正文，或者标题加正文。也可以让插件每次拖放时都问你想用哪一种。其余操作几乎都在右键里：新建笔记、文件夹、白板和 Bases，重命名、复制、移动、删除，拷贝库内路径或系统路径，在系统文件管理器中显示，或在文件夹内搜索。',
        points: [
          { term: 'wikilink', desc: '一个指回笔记的普通链接。' },
          { term: '嵌入', desc: '在拖放位置直接嵌入这篇笔记。' },
          { term: '正文', desc: '把笔记正文原样粘进来。' },
          { term: '标题加正文', desc: '标题在前，正文在后。' },
        ],
        aside: '多选若干卡片，可以一次性移动、删除或合并笔记。',
        slot: '放一张（或一小段录屏）把卡片拖进打开的编辑器的画面',
      },
      scale: {
        index: '05',
        kicker: '为真实体量的库而做',
        title: '大文件夹一样顺。',
        body:
          '只有真正出现在屏幕上的卡片才会被渲染，所以装着几千篇笔记的文件夹滚起来和小文件夹没差别。搜索走本地索引，标签筛选同时读取 frontmatter 和正文里的标签。',
        points: [
          { term: '虚拟滚动', desc: '只渲染可见范围内的卡片。' },
          { term: '索引搜索', desc: '在当前范围内做全文检索。' },
          { term: '置顶重排', desc: '把选定的卡片固定在卡片流顶部。' },
        ],
      },
      privacy: {
        index: '06',
        kicker: '隐私',
        title: '没有任何东西离开你的仓库。',
        body:
          'Card Workspace 不发起任何外部网络请求。文件操作全部走 Obsidian 本地的 Vault 与 FileManager API，搜索索引跑在随插件打包的本地库里。你的笔记始终是磁盘上的 Markdown 文件。',
        badge: '零联网请求',
      },
      install: {
        index: '07',
        kicker: '开始使用',
        title: '把它装进你的仓库。',
        body:
          'Card Workspace 需要 Obsidian 1.9.0 或更高版本。从侧边栏图标打开面板，或在命令面板运行「打开 Card Workspace 视图」，然后选一个文件夹、标签或卡片盒开始浏览。',
        steps: [
          '安装插件',
          '在第三方插件中启用',
          '运行「打开 Card Workspace 视图」',
          '选一个文件夹、标签或卡片盒',
        ],
        primaryCta: '获取 Card Workspace',
        secondaryCta: '在 GitHub 查看',
        note: 'TODO[发布前确认安装渠道与移动端时间线]',
      },
    },
    footer: {
      tagline: '一个为 Obsidian 而做的卡片工作区。',
      columns: [
        { title: '文档', links: ['简介', '安装', '快速开始', '设置'] },
        { title: '项目', links: ['GitHub', '发布', '问题反馈', '许可证 (MIT)'] },
      ],
      legal: 'MIT 许可 · 由 kenan.lian 开发',
    },
    ui: {
      theme: '主题',
      language: '语言',
      light: '浅色',
      dark: '深色',
      dropHint: '点击或拖入图片',
      clear: '清除',
    },
  },
};

Object.assign(window, { CONTENT });
