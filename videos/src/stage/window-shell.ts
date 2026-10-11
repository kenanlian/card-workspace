// A full Obsidian window rebuilt from the `.app-container` outerHTML captured
// in the live app: ribbon, sidebar tabs, root split and status bar are the real
// markup. The stage adds what the dump cannot hold (the frameless titlebar,
// which lives outside `.app-container`, and a note leaf in the root split),
// mounts the plugin panel into the captured `.folder-card-view`, and exposes
// the workspace moves a scene scripts (resize, drag to the root, collapse).
import { setIcon } from "obsidian";
import { setMenuLayer, setModalLayer } from "../shims/obsidian";
import type { ThemeMeta } from "./obsidian-shell";
import { renderReadingView, type ReadingViewOptions } from "./reading-view";

export interface WindowSize {
  width: number;
  height: number;
}

function el<K extends keyof HTMLElementTagNameMap>(tag: K, cls: string, parent?: HTMLElement): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  node.className = cls;
  parent?.appendChild(node);
  return node;
}

function must<T extends Element>(root: ParentNode, selector: string): T {
  const node = root.querySelector<T>(selector);
  if (!node) throw new Error(`Window dump is missing ${selector}`);
  return node;
}

/**
 * Wrapper standing in for `<body>`: the theme's child selectors
 * (`.is-hidden-frameless > .titlebar`) need the classes on the direct parent,
 * and the transform makes it the containing block for `position: fixed`.
 */
export function createWindowFrame(target: HTMLElement, size: WindowSize, meta: ThemeMeta, extraClass = ""): HTMLElement {
  const frame = el("div", `demo-window ${meta.bodyClass} ${extraClass}`.trim(), target);
  frame.style.cssText = `${meta.bodyStyle ?? ""}; position: absolute; left: 0; top: 0; width: ${size.width}px; height: ${size.height}px; overflow: hidden; transform: translate(0, 0); display: flex; flex-direction: column; background: var(--background-underlying);`;
  return frame;
}

export function createTitlebar(frame: HTMLElement, text: string, maximized = true): HTMLElement {
  const titlebar = el("div", "titlebar", frame);
  const inner = el("div", "titlebar-inner", titlebar);
  el("div", "titlebar-button-container mod-left", inner);
  el("div", "titlebar-text", inner).textContent = text;
  const right = el("div", "titlebar-button-container mod-right", inner);
  const maximize = maximized ? ["maximize", "还原", "copy"] as const : ["maximize", "最大化", "square"] as const;
  for (const [mod, label, icon] of [["minimize", "最小化", "minus"], maximize, ["close", "关闭", "x"]] as const) {
    const button = el("div", `titlebar-button mod-${mod}`, right);
    button.setAttribute("aria-label", label);
    setIcon(button, icon);
  }
  return titlebar;
}

/** A root-split tab header shaped like the captured ones. */
export function createTabHeader(type: string, title: string, icon: string): HTMLElement {
  const header = el("div", "workspace-tab-header tappable");
  header.draggable = true;
  header.setAttribute("aria-label", title);
  header.dataset.type = type;
  const inner = el("div", "workspace-tab-header-inner", header);
  setIcon(el("div", "workspace-tab-header-inner-icon", inner), icon);
  el("div", "workspace-tab-header-inner-title", inner).textContent = title;
  el("div", "workspace-tab-header-status-container", inner);
  const close = el("div", "workspace-tab-header-inner-close-button", inner);
  close.setAttribute("aria-label", "关闭");
  setIcon(close, "x");
  return header;
}

/** A markdown leaf in reading mode, with the same view header the dump carries. */
export function createMarkdownLeaf(template: HTMLElement, options: ReadingViewOptions): HTMLElement {
  const leaf = template.cloneNode(true) as HTMLElement;
  const content = must<HTMLElement>(leaf, ".workspace-leaf-content");
  content.dataset.type = "markdown";
  content.dataset.mode = "preview";
  const folder = options.path.includes("/") ? options.path.slice(0, options.path.lastIndexOf("/")) : "";
  const parent = must<HTMLElement>(content, ".view-header-title-parent");
  parent.replaceChildren();
  if (folder) {
    el("span", "view-header-breadcrumb", parent).textContent = folder;
    el("span", "view-header-breadcrumb-separator", parent).textContent = "/";
  }
  must<HTMLElement>(content, ".view-header-title").textContent = options.path.slice(options.path.lastIndexOf("/") + 1).replace(/\.md$/, "");
  const viewContent = must<HTMLElement>(content, ".view-content");
  viewContent.replaceChildren(renderReadingView(options));
  viewContent.style.cssText = "padding: 0px; overflow: hidden; position: relative;";
  return leaf;
}

/**
 * A popout window's `.app-container`: the captured root tab group alone, with
 * no ribbons, sidebars or status bar, holding one note tab.
 */
export function createPopoutWorkspace(body: HTMLElement, html: string, note: ReadingViewOptions): { noteScroller: HTMLElement } {
  const template = body.ownerDocument.createElement("template");
  template.innerHTML = html;
  const app = template.content.firstElementChild as HTMLElement;
  body.appendChild(app);
  const workspace = must<HTMLElement>(app, ".workspace");
  workspace.classList.remove("is-left-sidedock-open");
  for (const node of Array.from(workspace.children)) {
    if (!node.classList.contains("mod-root")) node.remove();
  }
  app.querySelector(".status-bar")?.remove();
  const rootTabs = must<HTMLElement>(workspace, ".mod-root > .workspace-tabs");
  rootTabs.classList.add("mod-active", "mod-top-left-space");
  rootTabs.querySelector(".sidebar-toggle-button")?.remove();
  const emptyHeader = must<HTMLElement>(rootTabs, '.workspace-tab-header[data-type="empty"]');
  const emptyLeaf = must<HTMLElement>(rootTabs, '.workspace-leaf-content[data-type="empty"]').parentElement!;
  const header = createTabHeader("markdown", note.path.slice(note.path.lastIndexOf("/") + 1).replace(/\.md$/, ""), "file-text");
  header.classList.add("is-active", "mod-active");
  emptyHeader.replaceWith(header);
  const leaf = createMarkdownLeaf(emptyLeaf, note);
  leaf.classList.add("mod-active");
  emptyLeaf.replaceWith(leaf);
  return { noteScroller: must<HTMLElement>(leaf, ".markdown-preview-view") };
}

export interface MainWindowOptions {
  /** Captured `.app-container` outerHTML. */
  html: string;
  meta: ThemeMeta;
  size: WindowSize;
  titleText: string;
  note: ReadingViewOptions;
  /** CSS width of the left split; defaults to the captured one. */
  leftWidth?: number;
  /** Shown in the sidebar's vault switcher instead of the captured vault. */
  vaultName?: string;
  /** Language of the chrome text the dump carries (status bar, property labels). */
  lang?: "zh" | "en";
}

const CHROME_TEXT = {
  zh: {
    properties: "笔记属性",
    addProperty: "添加笔记属性",
    backlinks: (count: number) => `${count} 条反向链接`,
    propertyCount: (count: number) => `${count} 个笔记属性`,
    words: (count: number) => `${count.toLocaleString("en-US")} 个词`,
    characters: (count: number) => `${count.toLocaleString("en-US")} 个字符`,
  },
  en: {
    properties: "Properties",
    addProperty: "Add property",
    backlinks: (count: number) => `${count} backlink${count === 1 ? "" : "s"}`,
    propertyCount: (count: number) => `${count} propert${count === 1 ? "y" : "ies"}`,
    words: (count: number) => `${count.toLocaleString("en-US")} word${count === 1 ? "" : "s"}`,
    characters: (count: number) => `${count.toLocaleString("en-US")} character${count === 1 ? "" : "s"}`,
  },
};

/** Obsidian's word count: every CJK character is a word, as is every other run of letters or digits. */
function noteStats(markdown: string): { words: number; characters: number; properties: number } {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(markdown);
  const body = match ? markdown.slice(match[0].length) : markdown;
  const properties = match ? match[1].split("\n").filter((line) => /^[^\s#][^:]*:/.test(line)).length : 0;
  const cjk = body.match(/[\u3400-\u9fff]/g)?.length ?? 0;
  const latin = body.replace(/[\u3400-\u9fff]/g, " ").match(/[\p{L}\p{N}][\p{L}\p{N}'’-]*/gu)?.length ?? 0;
  return { words: cjk + latin, characters: body.replace(/\s/g, "").length, properties };
}

export interface MainWindow {
  frame: HTMLElement;
  /** The `.folder-card-view` element the panel mounts into. */
  host: HTMLElement;
  leftSplit: HTMLElement;
  leftResizeHandle: HTMLElement;
  cardTabHeader: HTMLElement;
  rootTabs: HTMLElement;
  rootLeafContent: HTMLElement;
  noteScroller: HTMLElement;
  sidebarToggle: HTMLElement;
  setLeftWidth(width: number): void;
  /** Opens `path` in the root note leaf, as clicking a card does. */
  showNote(path: string): void;
  /** The drop of the card view's tab onto the root tab group's center. */
  moveCardViewToRoot(): void;
  setLeftCollapsed(collapsed: boolean): void;
}

export function createMainWindow(target: HTMLElement, options: MainWindowOptions): MainWindow {
  const frame = createWindowFrame(target, options.size, options.meta);
  createTitlebar(frame, options.titleText);
  const template = document.createElement("template");
  template.innerHTML = options.html;
  const app = template.content.firstElementChild as HTMLElement;
  frame.appendChild(app);

  // The frame stands in for the window body: menus and dialogs open over it.
  const modals = el("div", "demo-modal-layer", frame);
  // Obsidian sizes dialogs in vh/vw; the window, not the page, is the viewport here.
  const { width, height } = options.size;
  modals.style.cssText = `position: absolute; inset: 0; z-index: var(--layer-modal); pointer-events: none; --dialog-max-height: ${height * 0.85}px; --modal-height: ${height * 0.85}px; --dialog-max-width: ${width * 0.8}px; --modal-width: ${width * 0.9}px;`;
  const menus = el("div", "demo-menu-layer", frame);
  menus.style.cssText = "position: absolute; inset: 0; z-index: var(--layer-menu); pointer-events: none;";
  setModalLayer(modals);
  setMenuLayer(menus);

  const workspace = must<HTMLElement>(app, ".workspace");
  const leftSplit = must<HTMLElement>(app, ".mod-left-split");
  const leftResizeHandle = must<HTMLElement>(leftSplit, ":scope > .workspace-leaf-resize-handle");
  const leftTabs = must<HTMLElement>(leftSplit, ":scope > .workspace-tabs");
  const leftHeaders = must<HTMLElement>(leftTabs, ".workspace-tab-header-container-inner");
  const leftLeaves = must<HTMLElement>(leftTabs, ".workspace-tab-container");
  const cardTabHeader = must<HTMLElement>(leftHeaders, '[data-type="folder-card-view"]');
  const cardLeaf = must<HTMLElement>(leftLeaves, '.workspace-leaf-content[data-type="folder-card-view"]').parentElement!;
  const bookmarksHeader = must<HTMLElement>(leftHeaders, '[data-type="bookmarks"]');
  const bookmarksLeaf = must<HTMLElement>(leftLeaves, '.workspace-leaf-content[data-type="bookmarks"]').parentElement!;
  const sidebarToggle = must<HTMLElement>(leftTabs, ".sidebar-toggle-button.mod-left");
  const host = must<HTMLElement>(cardLeaf, ".folder-card-view");
  host.replaceChildren();

  const rootSplit = must<HTMLElement>(app, ".mod-root");
  const rootTabs = must<HTMLElement>(rootSplit, ".workspace-tabs");
  const rootHeaders = must<HTMLElement>(rootTabs, ".workspace-tab-header-container-inner");
  const rootLeaves = must<HTMLElement>(rootTabs, ".workspace-tab-container");
  const emptyHeader = must<HTMLElement>(rootHeaders, '[data-type="empty"]');
  const emptyLeaf = must<HTMLElement>(rootLeaves, '.workspace-leaf-content[data-type="empty"]').parentElement!;
  const chrome = CHROME_TEXT[options.lang ?? "zh"];
  const leafTemplate = emptyLeaf.cloneNode(true) as HTMLElement;
  const noteOptions = (path: string): ReadingViewOptions => ({
    propertiesLabel: chrome.properties, addPropertyLabel: chrome.addProperty, ...options.note, path,
  });
  const titleOf = (path: string) => path.slice(path.lastIndexOf("/") + 1).replace(/\.md$/, "");
  const noteHeader = createTabHeader("markdown", titleOf(options.note.path), "file-text");
  noteHeader.classList.add("is-active");
  emptyHeader.replaceWith(noteHeader);
  let noteLeaf = createMarkdownLeaf(leafTemplate, noteOptions(options.note.path));
  emptyLeaf.replaceWith(noteLeaf);
  let noteScroller = must<HTMLElement>(noteLeaf, ".markdown-preview-view");

  if (options.vaultName) {
    const vaultName = app.querySelector<HTMLElement>(".workspace-drawer-vault-name");
    if (vaultName) vaultName.textContent = options.vaultName;
  }

  // The OS input-method bar is not Obsidian; the editor status shows for an open note.
  const editorStatus = app.querySelector<HTMLElement>(".status-bar-item.plugin-editor-status");
  if (editorStatus) editorStatus.style.display = "";

  /** The status bar counts the dump carries belong to the captured note; recount for the open one. */
  const updateStatusBar = (path: string) => {
    const { vault } = options.note;
    const markdown = vault.readMarkdown(path);
    const stats = noteStats(markdown);
    const target = vault.app.metadataCache.getFirstLinkpathDest(titleOf(path), "");
    const backlinks = vault.files.filter((file) => file.path !== path && [...vault.readMarkdown(file.path).matchAll(/\[\[([^\]|#]+)/g)]
      .some((match) => vault.app.metadataCache.getFirstLinkpathDest(match[1].trim(), file.path) === target)).length;
    const set = (selector: string, text: string) => {
      const node = app.querySelector<HTMLElement>(selector);
      if (node) node.textContent = text;
    };
    set(".status-bar-item.plugin-backlink", chrome.backlinks(backlinks));
    set(".status-bar-item.plugin-properties", chrome.propertyCount(stats.properties));
    const segments = app.querySelectorAll<HTMLElement>(".status-bar-item.plugin-word-count .status-bar-item-segment");
    if (segments[0]) segments[0].textContent = chrome.words(stats.words);
    if (segments[1]) segments[1].textContent = chrome.characters(stats.characters);
  };
  updateStatusBar(options.note.path);

  const setLeftWidth = (width: number) => {
    leftSplit.style.width = `${width}px`;
  };
  if (options.leftWidth !== undefined) setLeftWidth(options.leftWidth);

  return {
    frame,
    host,
    leftSplit,
    leftResizeHandle,
    cardTabHeader,
    rootTabs,
    rootLeafContent: rootLeaves,
    get noteScroller() {
      return noteScroller;
    },
    sidebarToggle,
    setLeftWidth,
    showNote(path) {
      const next = createMarkdownLeaf(leafTemplate, noteOptions(path));
      next.className = noteLeaf.className;
      noteLeaf.replaceWith(next);
      noteLeaf = next;
      noteScroller = must<HTMLElement>(noteLeaf, ".markdown-preview-view");
      noteHeader.setAttribute("aria-label", titleOf(path));
      must<HTMLElement>(noteHeader, ".workspace-tab-header-inner-title").textContent = titleOf(path);
      updateStatusBar(path);
    },
    moveCardViewToRoot() {
      cardTabHeader.classList.remove("mod-active");
      noteHeader.classList.remove("is-active");
      rootHeaders.appendChild(cardTabHeader);
      noteLeaf.style.display = "none";
      noteLeaf.classList.remove("mod-active");
      rootLeaves.appendChild(cardLeaf);
      cardLeaf.classList.add("mod-active");
      leftTabs.classList.remove("mod-active");
      rootTabs.classList.add("mod-active");
      // The sidebar falls back to the tab left of the one that left.
      bookmarksHeader.classList.add("is-active", "mod-active");
      bookmarksLeaf.style.display = "";
    },
    setLeftCollapsed(collapsed) {
      workspace.classList.toggle("is-left-sidedock-open", !collapsed);
      leftSplit.classList.toggle("is-sidedock-collapsed", collapsed);
      if (collapsed) {
        leftSplit.style.width = "0px";
        leftSplit.style.display = "none";
        // Obsidian moves the toggle into the first root tab group while the sidebar is closed.
        rootTabs.classList.add("mod-top-left-space");
        must<HTMLElement>(rootTabs, ".workspace-tab-header-container").prepend(sidebarToggle);
      } else {
        leftSplit.style.display = "";
        rootTabs.classList.remove("mod-top-left-space");
        must<HTMLElement>(leftTabs, ".workspace-tab-header-container").appendChild(sidebarToggle);
      }
    },
  };
}
