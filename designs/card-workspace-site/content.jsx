/* Specimen content — the real `reference/settings.md` from the live site, in
   both locales. It is the densest page in the docs (table, inline code, bold,
   links, long h2 runs), so it exercises every typographic decision. */

const SIDEBAR = {
  en: [
    {
      label: 'Getting started',
      items: [
        { label: 'Introduction', href: '#' },
        { label: 'Installation', href: '#' },
        { label: 'Getting started', href: '#' },
      ],
    },
    {
      label: 'Using Card Workspace',
      items: [
        { label: 'Navigation', href: '#' },
        { label: 'Card boxes', href: '#' },
        { label: 'Browsing cards', href: '#' },
        { label: 'Writing and organizing', href: '#' },
      ],
    },
    {
      label: 'Reference',
      items: [
        { label: 'Settings', href: '#', current: true },
        { label: 'Commands and menus', href: '#' },
        { label: 'Limits and privacy', href: '#' },
      ],
    },
  ],
  zh: [
    {
      label: '开始使用',
      items: [
        { label: '简介', href: '#' },
        { label: '安装', href: '#' },
        { label: '快速开始', href: '#' },
      ],
    },
    {
      label: '使用指南',
      items: [
        { label: '导航', href: '#' },
        { label: '卡片盒', href: '#' },
        { label: '浏览卡片', href: '#' },
        { label: '写作与整理', href: '#' },
      ],
    },
    {
      label: '参考',
      items: [
        { label: '设置', href: '#', current: true },
        { label: '命令与菜单', href: '#' },
        { label: '限制与隐私', href: '#' },
      ],
    },
  ],
};

const TOC = {
  en: [
    { label: 'Default card open behavior', current: true },
    { label: 'Card drag insert behavior' },
    { label: 'New note content' },
    { label: 'Card corner radius' },
    { label: 'Preview lines' },
    { label: 'Show item counts in navigation' },
    { label: 'Navigation section order' },
  ],
  zh: [
    { label: '卡片默认打开方式', current: true },
    { label: '卡片拖拽插入行为' },
    { label: '新建笔记内容' },
    { label: '卡片圆角' },
    { label: '预览行数' },
    { label: '在导航栏显示条目计数' },
    { label: '导航区分区顺序' },
  ],
};

const UI = {
  en: {
    eyebrow: 'Reference',
    onThisPage: 'On this page',
    prev: 'Previous',
    next: 'Next',
    prevTitle: 'Writing and organizing',
    nextTitle: 'Commands and menus',
    docs: 'Docs',
    lang: '中文',
  },
  zh: {
    eyebrow: '参考',
    onThisPage: '本页目录',
    prev: '上一页',
    next: '下一页',
    prevTitle: '写作与整理',
    nextTitle: '命令与菜单',
    docs: '文档',
    lang: 'EN',
  },
};

/* --- Article, English ----------------------------------------------------- */
function ArticleEn() {
  return (
    <React.Fragment>
      <p className="doc-micro doc-eyebrow">Reference</p>
      <h1>Settings</h1>
      <p className="doc-lede">
        These are the settings in <strong>Settings → Card Workspace</strong>. Other remembered
        state — boxes, favorites, pins, last folder, pane collapse — is not listed here.
      </p>

      <div className="doc-prose">
        <table className="doc-table">
          <thead>
            <tr>
              <th>Setting key</th>
              <th>Default</th>
              <th>Name</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>defaultCardOpenBehavior</code></td>
              <td><code>smart</code></td>
              <td>Default card open behavior</td>
            </tr>
            <tr>
              <td><code>dragInsertAction</code></td>
              <td><code>ask</code></td>
              <td>Card drag insert behavior</td>
            </tr>
            <tr>
              <td><code>newNoteTemplate</code></td>
              <td><code>tags-frontmatter</code></td>
              <td>New note content</td>
            </tr>
            <tr>
              <td><code>cardCornerRadius</code></td>
              <td><code>rounded</code></td>
              <td>Card corner radius</td>
            </tr>
            <tr>
              <td><code>previewLines</code></td>
              <td><code>5</code> (min 3, max 8)</td>
              <td>Preview lines</td>
            </tr>
            <tr>
              <td><code>showNavItemCounts</code></td>
              <td><code>false</code></td>
              <td>Show item counts in navigation</td>
            </tr>
          </tbody>
        </table>

        <p>
          The interface language follows Obsidian: if Obsidian’s language starts with{' '}
          <code>zh</code>, Card Workspace uses Simplified Chinese; otherwise it uses English. There
          is no separate language setting.
        </p>

        <h2>Default card open behavior</h2>
        <p>
          Choose what happens when you click a card directly. Right-click menu actions stay
          available separately.
        </p>
        <ul>
          <li><strong>Current pane / current tab</strong> (<code>smart</code>) — default</li>
          <li><strong>Open in new tab</strong> (<code>new-tab</code>)</li>
          <li><strong>Open to the right</strong> (<code>split-right</code>)</li>
          <li><strong>Open in new window</strong> (<code>new-window</code>)</li>
        </ul>

        <h2>Card drag insert behavior</h2>
        <p>Choose what happens when a card is dropped into a Markdown editor.</p>
        <ul>
          <li><strong>Ask every time</strong> (<code>ask</code>) — default</li>
          <li><strong>Insert wiki link</strong> (<code>wiki</code>)</li>
          <li><strong>Insert embed link</strong> (<code>embed</code>)</li>
          <li><strong>Insert card content</strong> (<code>content</code>)</li>
          <li><strong>Insert card title &amp; content</strong> (<code>title-content</code>)</li>
        </ul>

        <h2>New note content</h2>
        <p>
          Choose what the toolbar’s create-note action writes into a new note: an empty tags
          property, or nothing at all.
        </p>
        <ul>
          <li><strong>Start with a tags property</strong> (<code>tags-frontmatter</code>) — default</li>
          <li><strong>Start blank</strong> (<code>blank</code>)</li>
        </ul>

        <h2>Card corner radius</h2>
        <p>Adjust how square or rounded each card border feels in the panel.</p>
        <ul>
          <li><strong>Compact</strong> (<code>compact</code>)</li>
          <li><strong>Softer</strong> (<code>medium</code>)</li>
          <li><strong>Rounded</strong> (<code>rounded</code>) — default</li>
        </ul>

        <h2>Preview lines</h2>
        <p>
          Choose how many normalized summary lines each card preview can show (3–8). Default is{' '}
          <code>5</code>.
        </p>

        <h2>Show item counts in navigation</h2>
        <p>
          Show how many cards each folder and tag contributes in the navigation pane. Folder counts
          follow the include-subfolders toggle, and tag counts include child tags. Off by default
          (<code>false</code>).
        </p>

        <h2>Navigation section order</h2>
        <p>
          Arrange the order of the navigation pane’s sections with <strong>Move up</strong> and{' '}
          <strong>Move down</strong>. <strong>Restore default order</strong> puts Favorites,
          Folders, Tags, and Boxes back in that sequence. Collapse state is tracked separately and
          is unaffected.
        </p>
      </div>
    </React.Fragment>
  );
}

/* --- Article, Simplified Chinese ------------------------------------------ */
function ArticleZh() {
  return (
    <React.Fragment>
      <p className="doc-micro doc-eyebrow">参考</p>
      <h1>设置</h1>
      <p className="doc-lede">
        以下是 <strong>设置 → Card Workspace</strong> 中显示的选项。其他会记住的状态 —— 卡片盒、收藏、置顶、上次文件夹、面板折叠 —— 不列在这里。
      </p>

      <div className="doc-prose">
        <table className="doc-table">
          <thead>
            <tr>
              <th>设置键</th>
              <th>默认值</th>
              <th>名称</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>defaultCardOpenBehavior</code></td>
              <td><code>smart</code></td>
              <td>卡片默认打开方式</td>
            </tr>
            <tr>
              <td><code>dragInsertAction</code></td>
              <td><code>ask</code></td>
              <td>卡片拖拽插入行为</td>
            </tr>
            <tr>
              <td><code>newNoteTemplate</code></td>
              <td><code>tags-frontmatter</code></td>
              <td>新建笔记内容</td>
            </tr>
            <tr>
              <td><code>cardCornerRadius</code></td>
              <td><code>rounded</code></td>
              <td>卡片圆角</td>
            </tr>
            <tr>
              <td><code>previewLines</code></td>
              <td><code>5</code>（最小 3，最大 8）</td>
              <td>预览行数</td>
            </tr>
            <tr>
              <td><code>showNavItemCounts</code></td>
              <td><code>false</code></td>
              <td>在导航栏显示条目计数</td>
            </tr>
          </tbody>
        </table>

        <p>
          界面语言跟随 Obsidian：若 Obsidian 语言以 <code>zh</code> 开头，Card Workspace 使用简体中文，否则使用英文。没有单独的语言设置。
        </p>

        <h2>卡片默认打开方式</h2>
        <p>选择直接点击卡片时的行为。右键菜单操作仍可单独使用。</p>
        <ul>
          <li><strong>当前窗格 / 当前标签页</strong>（<code>smart</code>）— 默认</li>
          <li><strong>在新标签页中打开</strong>（<code>new-tab</code>）</li>
          <li><strong>在右侧分栏打开</strong>（<code>split-right</code>）</li>
          <li><strong>在新窗口中打开</strong>（<code>new-window</code>）</li>
        </ul>

        <h2>卡片拖拽插入行为</h2>
        <p>选择将卡片拖入 Markdown 编辑器时的处理方式。</p>
        <ul>
          <li><strong>每次弹框确认</strong>（<code>ask</code>）— 默认</li>
          <li><strong>插入 wiki link</strong>（<code>wiki</code>）</li>
          <li><strong>插入嵌入 link</strong>（<code>embed</code>）</li>
          <li><strong>插入卡片内容</strong>（<code>content</code>）</li>
          <li><strong>插入卡片标题&amp;内容</strong>（<code>title-content</code>）</li>
        </ul>

        <h2>新建笔记内容</h2>
        <p>选择工具栏“创建笔记”生成的笔记内容：带一个空的 tags 属性，或完全空白。</p>
        <ul>
          <li><strong>带 tags 属性</strong>（<code>tags-frontmatter</code>）— 默认</li>
          <li><strong>完全空白</strong>（<code>blank</code>）</li>
        </ul>

        <h2>卡片圆角</h2>
        <p>调整面板中每张卡片边框的方正或圆润程度。</p>
        <ul>
          <li><strong>紧凑</strong>（<code>compact</code>）</li>
          <li><strong>柔和</strong>（<code>medium</code>）</li>
          <li><strong>圆角</strong>（<code>rounded</code>）— 默认</li>
        </ul>

        <h2>预览行数</h2>
        <p>
          选择每张卡片预览可显示的规范化摘要行数（3–8）。默认值为 <code>5</code>。
        </p>

        <h2>在导航栏显示条目计数</h2>
        <p>
          在导航栏中显示每个文件夹和标签包含的卡片数量。文件夹计数会跟随“包含子文件夹”开关变化，标签计数包含其子标签。默认关闭（<code>false</code>）。
        </p>

        <h2>导航区分区顺序</h2>
        <p>
          用 <strong>上移</strong> 和 <strong>下移</strong> 调整导航区各分区的上下顺序。<strong>恢复默认顺序</strong> 会把收藏、文件夹、标签、卡片盒还原为该序列。折叠状态单独记录，不受影响。
        </p>
      </div>
    </React.Fragment>
  );
}

Object.assign(window, { SIDEBAR, TOC, UI, ArticleEn, ArticleZh });
