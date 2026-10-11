// Obsidian's reading view rebuilt from a note's Markdown: block-level `el-*`
// wrappers, heading collapse indicators, list bullets, internal and external
// links, image embeds, and the properties block, so the captured theme styles
// it exactly as it styles the app.
import { marked, type Token, type Tokens } from "marked";
import { parse as parseYaml } from "yaml";
import { addIcon, setIcon } from "obsidian";
import type { DemoVault } from "./demo-vault";

addIcon("right-triangle", `<g transform="scale(${100 / 24})"><path d="M3 8L12 17L21 8"/></g>`);

const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/;

function escapeHtml(text: string): string {
  return text.replace(/[&<>"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[char]!);
}

function el<K extends keyof HTMLElementTagNameMap>(tag: K, cls = "", parent?: HTMLElement): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (cls) node.className = cls;
  parent?.appendChild(node);
  return node;
}

function iconEl(name: string, cls: string, parent: HTMLElement): HTMLElement {
  const node = el("span", cls, parent);
  setIcon(node, name);
  return node;
}

export interface ReadingViewOptions {
  vault: DemoVault;
  path: string;
  /** Collapsed "笔记属性" heading, as the hover preview shows it. */
  propertiesCollapsed?: boolean;
  /** Skip the inline title (hover previews show none). */
  inlineTitle?: boolean;
  propertiesLabel?: string;
  addPropertyLabel?: string;
}

type PropertyType = "text" | "tags" | "multitext";

function propertyType(key: string, value: unknown): PropertyType {
  if (key === "tags" || key === "aliases") return key === "tags" ? "tags" : "multitext";
  return Array.isArray(value) ? "multitext" : "text";
}

const PROPERTY_ICONS: Record<PropertyType, string> = { text: "text", tags: "tags", multitext: "list" };

function renderPill(value: string, parent: HTMLElement): void {
  const pill = el("div", "multi-select-pill", parent);
  pill.tabIndex = 0;
  const content = el("div", "multi-select-pill-content", pill);
  el("span", "", content).textContent = value;
  const remove = el("div", "multi-select-pill-remove-button", pill);
  setIcon(remove, "x");
}

export function renderProperties(frontmatter: Record<string, unknown>, options: ReadingViewOptions, parent: HTMLElement): void {
  const keys = Object.keys(frontmatter);
  const container = el("div", `metadata-container${options.propertiesCollapsed ? " is-collapsed" : ""}`, parent);
  container.tabIndex = -1;
  container.dataset.propertyCount = String(keys.length);
  const heading = el("div", "metadata-properties-heading", container);
  heading.tabIndex = 0;
  const indicator = el("div", `collapse-indicator collapse-icon${options.propertiesCollapsed ? " is-collapsed" : ""}`, heading);
  setIcon(indicator, "right-triangle");
  el("div", "metadata-properties-title", heading).textContent = options.propertiesLabel ?? "笔记属性";
  const content = el("div", "metadata-content", container);
  const properties = el("div", "metadata-properties", content);
  for (const key of keys) {
    const value = frontmatter[key];
    const type = propertyType(key, value);
    const row = el("div", "metadata-property", properties);
    row.tabIndex = 0;
    row.dataset.propertyKey = key;
    row.dataset.propertyType = type;
    const keyCell = el("div", "metadata-property-key", row);
    iconEl(PROPERTY_ICONS[type], "metadata-property-icon", keyCell);
    const input = el("input", "metadata-property-key-input", keyCell);
    input.type = "text";
    input.value = key;
    input.setAttribute("value", key);
    const valueCell = el("div", "metadata-property-value", row);
    valueCell.dataset.propertyType = type;
    if (type === "text") {
      const text = el("div", "metadata-input-longtext mod-truncate", valueCell);
      text.textContent = String(value ?? "");
    } else {
      const multi = el("div", "multi-select-container", valueCell);
      const values = Array.isArray(value) ? value : [value];
      values.filter((item) => item !== null && item !== undefined).forEach((item) => renderPill(String(item), multi));
      el("div", "multi-select-input", multi);
    }
  }
  if (options.propertiesCollapsed) return;
  const add = el("div", "metadata-add-button text-icon-button", content);
  add.tabIndex = 0;
  iconEl("plus", "text-button-icon", add);
  el("span", "text-button-label", add).textContent = options.addPropertyLabel ?? "添加笔记属性";
}

/** Obsidian-only inline syntax, rewritten to the markup the reading view emits. */
function preprocessInline(markdown: string, options: ReadingViewOptions): string {
  const { vault, path } = options;
  return markdown
    .replace(/!\[\[([^\]|]+)(?:\|([^\]]*))?\]\]/g, (_, target: string, alias?: string) => {
      const file = vault.app.metadataCache.getFirstLinkpathDest(target.trim(), path);
      if (!file) return "";
      const url = vault.resourceUrl(file);
      return `<span alt="${escapeHtml(alias ?? target)}" src="${escapeHtml(target)}" class="internal-embed media-embed image-embed is-loaded"><img alt="${escapeHtml(alias ?? target)}" src="${url}"></span>`;
    })
    .replace(/(?<!!)\[\[([^\]|]+)(?:\|([^\]]*))?\]\]/g, (_, target: string, alias?: string) =>
      `<a data-href="${escapeHtml(target)}" href="${escapeHtml(target)}" class="internal-link" target="_blank" rel="noopener nofollow">${escapeHtml(alias ?? target)}</a>`)
    .replace(/==([^=\n]+)==/g, "<mark>$1</mark>");
}

const renderer = new marked.Renderer();
renderer.link = function ({ href, tokens }: Tokens.Link): string {
  const text = this.parser.parseInline(tokens);
  if (/^[a-z][a-z\d+.-]*:/i.test(href)) {
    return `<a rel="noopener nofollow" class="external-link" href="${escapeHtml(href)}" target="_blank">${text}</a>`;
  }
  return `<a data-href="${escapeHtml(href)}" href="${escapeHtml(href)}" class="internal-link" target="_blank" rel="noopener nofollow">${text}</a>`;
};
renderer.heading = function ({ tokens, depth, text }: Tokens.Heading): string {
  const body = this.parser.parseInline(tokens);
  return `<h${depth} data-heading="${escapeHtml(text)}" dir="auto"><div class="heading-collapse-indicator collapse-indicator collapse-icon" data-icon="right-triangle"></div>${body}</h${depth}>`;
};
renderer.paragraph = function ({ tokens }: Tokens.Paragraph): string {
  return `<p dir="auto">${this.parser.parseInline(tokens)}</p>`;
};
renderer.list = function (token: Tokens.List): string {
  const tag = token.ordered ? "ol" : "ul";
  const items = token.items.map((item, index) => {
    const body = this.parser.parse(item.tokens);
    return `<li data-line="${index}" dir="auto"><span class="list-bullet"></span>${body}</li>`;
  }).join("");
  return `<${tag} class="has-list-bullet">${items}</${tag}>`;
};
renderer.listitem = function (item: Tokens.ListItem): string {
  return this.parser.parse(item.tokens);
};
renderer.text = function (token: Tokens.Text | Tokens.Escape): string {
  return "tokens" in token && token.tokens ? this.parser.parseInline(token.tokens) : token.text;
};

const BLOCK_TAG: Partial<Record<Token["type"], string>> = {
  paragraph: "p", list: "ul", code: "pre", blockquote: "blockquote", table: "table", hr: "hr", html: "div",
};

function blockClass(token: Token): string {
  if (token.type === "heading") return `el-h${(token as Tokens.Heading).depth}`;
  if (token.type === "list") return (token as Tokens.List).ordered ? "el-ol" : "el-ul";
  return `el-${BLOCK_TAG[token.type] ?? token.type}`;
}

/** `.markdown-reading-view` for `path`, ready to sit in a leaf's `.view-content`. */
export function renderReadingView(options: ReadingViewOptions): HTMLElement {
  const source = options.vault.readMarkdown(options.path);
  const match = FRONTMATTER.exec(source);
  const frontmatter = match ? parseYaml(match[1]) as Record<string, unknown> : null;
  const body = match ? source.slice(match[0].length) : source;

  const view = el("div", "markdown-reading-view");
  view.style.cssText = "width: 100%; height: 100%;";
  const preview = el("div", "markdown-preview-view markdown-rendered node-insert-event is-readable-line-width allow-fold-headings allow-fold-lists show-indentation-guide show-properties", view);
  preview.tabIndex = -1;
  preview.style.tabSize = "4";
  const sizer = el("div", "markdown-preview-sizer markdown-preview-section", preview);
  el("div", "markdown-preview-pusher", sizer).style.cssText = "width: 1px; height: 0.1px; margin-bottom: 0px;";
  const header = el("div", "mod-header mod-ui", sizer);
  if (options.inlineTitle !== false) {
    const title = el("div", "inline-title", header);
    title.textContent = options.path.slice(options.path.lastIndexOf("/") + 1).replace(/\.md$/, "");
  }
  if (frontmatter && Object.keys(frontmatter).length > 0) renderProperties(frontmatter, options, header);

  for (const token of marked.lexer(preprocessInline(body, options))) {
    if (token.type === "space") continue;
    const block = el("div", blockClass(token), sizer);
    block.innerHTML = token.type === "html" ? token.raw : marked.parser([token], { renderer });
  }
  el("div", "mod-footer mod-ui", sizer);
  sizer.querySelectorAll<HTMLElement>("[data-icon]").forEach((node) => {
    setIcon(node, node.dataset.icon!);
    delete node.dataset.icon;
  });
  return view;
}
