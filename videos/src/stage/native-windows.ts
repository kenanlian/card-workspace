// Obsidian surfaces outside the plugin panel that the scene needs as real
// markup under the captured theme: separate windows (settings, popout note),
// the page-preview popover, and the tab drag feedback.
//
// Each extra window is its own document, as in Obsidian: a same-origin iframe
// whose <body> carries the popout classes, so the theme's `body.is-popout-*`
// rules apply and the main window's `body:not(.is-popout-*)` rules do not.
import { setIcon } from "obsidian";
import type { SettingDefinitionItem } from "obsidian";
import type { ThemeMeta } from "./obsidian-shell";
import { renderReadingView, type ReadingViewOptions } from "./reading-view";
import { createPopoutWorkspace, createTitlebar, type WindowSize } from "./window-shell";

function el<K extends keyof HTMLElementTagNameMap>(tag: K, cls: string, parent?: HTMLElement): HTMLElementTagNameMap[K] {
  const doc = parent?.ownerDocument ?? document;
  const node = doc.createElement(tag);
  node.className = cls;
  parent?.appendChild(node);
  return node;
}

export interface PopoutDocument {
  iframe: HTMLIFrameElement;
  doc: Document;
  body: HTMLElement;
  /** Stylesheets and fonts of the window document have loaded. */
  ready: Promise<void>;
}

/**
 * An empty Obsidian window document of `size` CSS px: the main document's
 * stylesheets (theme, fonts, stage rules) and the captured body variables,
 * with `is-maximized` dropped and `extraClass` added to the body.
 */
export function createPopoutDocument(target: HTMLElement, size: WindowSize, meta: ThemeMeta, extraClass: string): PopoutDocument {
  const iframe = document.createElement("iframe");
  iframe.className = "demo-popout-frame";
  iframe.style.cssText = `position: absolute; left: 0; top: 0; width: ${size.width}px; height: ${size.height}px; border: 0; display: block;`;
  target.appendChild(iframe);
  const doc = iframe.contentDocument!;
  doc.open();
  doc.write("<!doctype html><html><head><meta charset=\"UTF-8\"></head><body></body></html>");
  doc.close();
  if (meta.htmlClass) doc.documentElement.className = meta.htmlClass;

  const loads: Promise<unknown>[] = [];
  for (const node of Array.from(document.head.querySelectorAll<HTMLLinkElement | HTMLStyleElement>("link[rel=stylesheet], style"))) {
    if (node instanceof HTMLLinkElement) {
      const link = doc.createElement("link");
      link.rel = "stylesheet";
      loads.push(new Promise((resolve) => {
        link.onload = resolve;
        link.onerror = resolve;
      }));
      link.href = node.href;
      doc.head.appendChild(link);
    } else {
      doc.head.appendChild(doc.importNode(node, true));
    }
  }
  const body = doc.body;
  const classes = meta.bodyClass.split(/\s+/).filter((name) => name && name !== "is-maximized");
  body.className = [...classes, ...extraClass.split(/\s+/).filter(Boolean)].join(" ");
  body.style.cssText = `${meta.bodyStyle ?? ""}; margin: 0;`;
  const ready = Promise.all(loads).then(() => doc.fonts.ready).then(() => undefined);
  return { iframe, doc, body, ready };
}

export interface NoteWindow extends PopoutDocument {
  noteScroller: HTMLElement;
}

/** A popout window holding one note tab, as "open in new window" creates it. */
export function createNoteWindow(target: HTMLElement, size: WindowSize, meta: ThemeMeta, html: string, note: ReadingViewOptions): NoteWindow {
  const popout = createPopoutDocument(target, size, meta, "is-popout-window");
  createTitlebar(popout.body, "", false);
  const { noteScroller } = createPopoutWorkspace(popout.body, html, note);
  return { ...popout, noteScroller };
}

export interface SettingsNavGroup {
  title: string;
  icon: string;
  section: string;
  items: Array<{ title: string; icon?: string; active?: boolean }>;
}

export interface SettingsPageOptions {
  searchPlaceholder: string;
  nav: SettingsNavGroup[];
  definitions: SettingDefinitionItem[];
  getValue(key: string): unknown;
}

export interface SettingsPage {
  modal: HTMLElement;
  navScroller: HTMLElement;
  /** `select.dropdown` per control key. */
  dropdowns: Map<string, HTMLSelectElement>;
}

type DefinitionLike = {
  type?: string;
  heading?: string;
  items?: DefinitionLike[];
  name?: string;
  desc?: string | DocumentFragment;
  visible?: () => boolean;
  control?: { type: string; key: string; options?: Record<string, string>; min?: number; max?: number; step?: number };
};

function renderSetting(parent: HTMLElement, item: DefinitionLike, options: SettingsPageOptions, dropdowns: Map<string, HTMLSelectElement>): void {
  if (item.visible && !item.visible()) return;
  const row = el("div", "setting-item", parent);
  const info = el("div", "setting-item-info", row);
  el("div", "setting-item-name", info).textContent = item.name ?? "";
  const desc = el("div", "setting-item-description", info);
  if (typeof item.desc === "string") desc.textContent = item.desc;
  else if (item.desc) desc.appendChild(item.desc);
  const control = el("div", "setting-item-control", row);
  const spec = item.control;
  if (!spec) return;
  const value = options.getValue(spec.key);
  if (spec.type === "dropdown") {
    const select = el("select", "dropdown", control);
    for (const [key, label] of Object.entries(spec.options ?? {})) {
      const option = el("option", "", select);
      option.value = key;
      option.textContent = label;
    }
    select.value = String(value);
    dropdowns.set(spec.key, select);
  } else if (spec.type === "toggle") {
    const box = el("div", `checkbox-container${value ? " is-enabled" : ""}`, control);
    const input = el("input", "", box);
    input.type = "checkbox";
    input.tabIndex = 0;
    input.checked = Boolean(value);
  } else if (spec.type === "slider") {
    row.classList.add("mod-slider");
    el("span", "slider-value", control).textContent = String(value);
    const input = el("input", "slider", control);
    input.type = "range";
    input.min = String(spec.min ?? 0);
    input.max = String(spec.max ?? 100);
    input.step = String(spec.step ?? 1);
    input.value = String(value);
  }
}

/**
 * Obsidian's settings modal as it fills a popout-modal window: the vertical
 * tab sidebar, and the plugin's declarative definitions rendered as groups.
 */
export function renderSettingsPage(body: HTMLElement, options: SettingsPageOptions): SettingsPage {
  const modal = el("div", "modal mod-settings mod-sidebar-layout", body);
  setIcon(el("div", "modal-close-button", modal), "x");
  const content = el("div", "modal-content vertical-tabs-container", modal);

  const header = el("div", "vertical-tab-header", content);
  const search = el("div", "setting-search-container", header);
  const searchBox = el("div", "search-input-container", search);
  const input = el("input", "", searchBox);
  input.type = "search";
  input.placeholder = options.searchPlaceholder;
  input.spellcheck = false;
  const navScroller = el("div", "vertical-tab-header-group-container", header);
  for (const group of options.nav) {
    const groupEl = el("div", "vertical-tab-header-group", navScroller);
    const title = el("div", "vertical-tab-header-group-title", groupEl);
    setIcon(el("span", "vertical-tab-header-group-title-icon", title), group.icon);
    title.append(group.title);
    const items = el("div", "vertical-tab-header-group-items", groupEl);
    items.dataset.section = group.section;
    for (const item of group.items) {
      const nav = el("div", `vertical-tab-nav-item tappable${item.active ? " is-active" : ""}`, items);
      const icon = el("div", "vertical-tab-nav-item-icon", nav);
      if (item.icon) setIcon(icon, item.icon);
      el("div", "vertical-tab-nav-item-title", nav).textContent = item.title;
      setIcon(el("div", "vertical-tab-nav-item-chevron", nav), "chevron-right");
    }
  }

  const container = el("div", "vertical-tab-content-container", content);
  const page = el("div", "vertical-tab-content", container);
  const dropdowns = new Map<string, HTMLSelectElement>();
  for (const item of options.definitions as DefinitionLike[]) {
    if (item.type === "group" || item.type === "list") {
      const group = el("div", "setting-group", page);
      if (item.heading) {
        const heading = el("div", "setting-item setting-item-heading", group);
        const info = el("div", "setting-item-info", heading);
        el("div", "setting-item-name", info).textContent = item.heading;
        el("div", "setting-item-description", info);
        el("div", "setting-item-control", heading);
      }
      el("div", "setting-group-search", group);
      const rows = el("div", "setting-items", group);
      for (const child of item.items ?? []) renderSetting(rows, child, options, dropdowns);
    } else {
      renderSetting(page, item, options, dropdowns);
    }
  }
  return { modal, navScroller, dropdowns };
}

/**
 * The page-preview popover for `path`, positioned in its window: a reading
 * view embed with collapsed properties and no inline title, plus the
 * open-link button.
 */
export function createHoverPopover(windowFrame: HTMLElement, note: ReadingViewOptions, at: { left: number; top: number }): HTMLElement {
  const popover = el("div", "popover hover-popover", windowFrame);
  popover.style.cssText = `top: ${at.top}px; left: ${at.left}px;`;
  const embed = el("div", "markdown-embed is-loaded", popover);
  const content = el("div", "markdown-embed-content", embed);
  const view = renderReadingView({ ...note, propertiesCollapsed: true, inlineTitle: false });
  const preview = view.querySelector<HTMLElement>(".markdown-preview-view")!;
  preview.classList.remove("is-readable-line-width");
  content.appendChild(preview);
  const link = el("div", "markdown-embed-link", embed);
  link.setAttribute("aria-label", "打开链接");
  setIcon(link, "maximize-2");
  return popover;
}

/** The ghost Obsidian draws under the pointer while a tab is dragged, from that tab's header. */
export function createLeafDragGhost(parent: HTMLElement, tabHeader: HTMLElement): HTMLElement {
  const ghost = el("div", "drag-ghost mod-leaf", parent);
  const icon = el("div", "drag-ghost-icon", ghost);
  const svg = tabHeader.querySelector(".workspace-tab-header-inner-icon svg");
  if (svg) icon.appendChild(svg.cloneNode(true));
  Object.assign(icon.style, { display: "flex", alignItems: "center", flexShrink: "0" });
  icon.style.setProperty("--icon-size", "var(--icon-s)");
  ghost.append(tabHeader.querySelector(".workspace-tab-header-inner-title")?.textContent ?? "");
  Object.assign(ghost.style, { position: "absolute", whiteSpace: "nowrap", width: "max-content" });
  return ghost;
}

/** The accent box Obsidian draws over the leaf a dragged tab would join. */
export function showDropOverlay(windowFrame: HTMLElement, target: HTMLElement): HTMLElement {
  const frameRect = windowFrame.getBoundingClientRect();
  const rect = target.getBoundingClientRect();
  // Client rects include any ancestor zoom; the overlay's own px do not.
  const scale = frameRect.width / windowFrame.offsetWidth;
  const overlay = el("div", "workspace-drop-overlay", windowFrame);
  overlay.style.cssText = `transition: none; width: ${rect.width / scale}px; height: ${rect.height / scale}px; transform: translate(${(rect.left - frameRect.left) / scale}px, ${(rect.top - frameRect.top) / scale}px);`;
  return overlay;
}
