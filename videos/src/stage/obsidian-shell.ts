import { flushSync, mount, unmount } from "svelte";
import { setIcon } from "obsidian";
import { setMenuLayer, setModalLayer } from "../shims/obsidian";
import FolderCardPanel from "@plugin/view/FolderCardPanel.svelte";
import type { NavigationIntent } from "@plugin/view/navigation-model";
import type { NavContextMenuPayload } from "@plugin/view/types";
import type { DemoHost } from "./demo-host";

export interface ThemeMeta {
  bodyClass: string;
  bodyStyle: string | null;
  htmlClass: string;
}

export interface SidebarSize {
  /** CSS pixels, as measured inside Obsidian. */
  width: number;
  height: number;
}

/** Width of the theme's styled scrollbar on `.fce-list`, measured in Obsidian. */
const LIST_SCROLLBAR_WIDTH = 11;

/** Applies the body classes and inline variables captured from the live Obsidian window. */
export function applyThemeMeta(meta: ThemeMeta): void {
  const keep = document.body.className;
  document.body.className = `${meta.bodyClass} ${keep}`.trim();
  if (meta.bodyStyle) document.body.style.cssText += `;${meta.bodyStyle}`;
  if (meta.htmlClass) document.documentElement.className = meta.htmlClass;

  // Headless Chrome hides scrollbars, which would widen the card column; keep
  // the gutter Obsidian reserves so wrapping matches the real sidebar.
  const style = document.createElement("style");
  style.textContent = `.demo-sidebar-frame .fce-list, .demo-window .fce-list { padding-right: ${LIST_SCROLLBAR_WIDTH}px; }
.demo-sidebar-frame input, .demo-window input, .demo-window [contenteditable], .is-popout-modal input { caret-color: transparent; }
.vertical-tab-header-group-title { display: flex; align-items: center; gap: var(--size-4-2); }
.vertical-tab-header-group-title-icon { display: flex; --icon-size: var(--icon-s); }
.vertical-tab-header-group-title-icon svg { fill: currentColor; stroke-width: 1px; }
.demo-menu-layer > .menu { pointer-events: auto; }
.demo-window .cm-cursorLayer { animation: none !important; }
.demo-menu-layer > .menu:not(.demo-submenu) { min-width: 200px; }`;
  document.head.appendChild(style);
  suppressPointerFocusRings();
  mirrorHoverRules();
}

/**
 * Nav rows focus themselves on click. From a scripted click Chrome paints that
 * as keyboard focus, while a real mouse click shows no ring, so the row rules
 * are retargeted to a class no element carries.
 */
function suppressPointerFocusRings(): void {
  const visit = (rules: CSSRuleList): void => {
    for (const rule of Array.from(rules)) {
      if (rule instanceof CSSStyleRule) {
        if (rule.selectorText.includes(".fce-tree-row") && rule.selectorText.includes(":focus-visible")) {
          rule.selectorText = rule.selectorText.replaceAll(":focus-visible", ".demo-focus-visible");
        }
      } else if (rule instanceof CSSMediaRule || rule instanceof CSSSupportsRule) {
        visit(rule.cssRules);
      }
    }
  };
  for (const sheet of Array.from(document.styleSheets)) {
    try {
      visit(sheet.cssRules);
    } catch {
      // Cross-origin sheets are unreadable and never hold theme rules.
    }
  }
}

/**
 * A scripted cursor never triggers `:hover`, so every hover rule gets a
 * `.demo-hover` twin that scenes can toggle deterministically.
 */
function mirrorHoverRules(): void {
  const mirrored: string[] = [];
  const visit = (rules: CSSRuleList, wrap: (css: string) => string): void => {
    for (const rule of Array.from(rules)) {
      if (rule instanceof CSSStyleRule && rule.selectorText.includes(":hover")) {
        mirrored.push(wrap(`${rule.selectorText.replaceAll(":hover", ".demo-hover")} { ${rule.style.cssText} }`));
      } else if (rule instanceof CSSMediaRule) {
        visit(rule.cssRules, (css) => wrap(`@media ${rule.conditionText} { ${css} }`));
      } else if (rule instanceof CSSSupportsRule) {
        visit(rule.cssRules, (css) => wrap(`@supports ${rule.conditionText} { ${css} }`));
      }
    }
  };
  for (const sheet of Array.from(document.styleSheets)) {
    try {
      visit(sheet.cssRules, (css) => css);
    } catch {
      // Cross-origin sheets are unreadable and never hold theme rules.
    }
  }
  const style = document.createElement("style");
  style.textContent = mirrored.join("\n");
  document.head.appendChild(style);
}

function el<K extends keyof HTMLElementTagNameMap>(tag: K, cls: string, parent?: HTMLElement): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  node.className = cls;
  parent?.appendChild(node);
  return node;
}

/**
 * The ancestor chain Obsidian renders around a left-sidebar leaf, so theme
 * selectors that key off `.mod-left-split` and friends still match. The frame
 * is cropped to the split itself, dropping whatever gutter the theme adds.
 */
export function createLeftSidebarShell(target: HTMLElement, size: SidebarSize, vaultName: string): HTMLElement {
  const frame = el("div", "demo-sidebar-frame", target);
  frame.style.cssText = `position: relative; overflow: hidden; width: ${size.width}px; height: ${size.height}px;`;
  const app = el("div", "app-container", frame);
  app.style.cssText = `position: absolute; left: 0; top: 0; width: ${size.width * 2}px; height: ${size.height}px;`;
  const main = el("div", "horizontal-main-container", app);
  const workspace = el("div", "workspace is-left-sidedock-open", main);
  const split = el("div", "workspace-split mod-horizontal mod-sidedock mod-left-split", workspace);
  split.style.width = `${size.width}px`;

  // Obsidian places the profile before the tabs and reorders it with `order: 1`;
  // `.workspace-tabs:last-of-type` padding depends on that DOM order.
  const profile = el("div", "workspace-sidedock-vault-profile", split);
  const switcher = el("div", "workspace-drawer-vault-switcher", profile);
  setIcon(el("div", "workspace-drawer-vault-switcher-icon", switcher), "chevrons-up-down");
  el("div", "workspace-drawer-vault-name", switcher).textContent = vaultName;
  const actions = el("div", "workspace-drawer-vault-actions", profile);
  setIcon(el("div", "clickable-icon", actions), "circle-help");
  setIcon(el("div", "clickable-icon", actions), "settings");

  const tabs = el("div", "workspace-tabs mod-top mod-top-left-space mod-active", split);
  const tabContainer = el("div", "workspace-tab-container", tabs);
  const leaf = el("div", "workspace-leaf mod-active", tabContainer);
  const leafContent = el("div", "workspace-leaf-content", leaf);
  leafContent.dataset.type = "folder-card-view";
  const viewContent = el("div", "view-content", leafContent);
  const host = el("div", "folder-card-view", viewContent);

  // Menus open over the whole frame, which stands in for the window body. A
  // menu that would spill into the editor area in Obsidian flips inside the
  // crop instead; the toolbar menus' 200px plugin min-width only arrives after
  // placement, so the layer applies it up front.
  const menus = el("div", "demo-menu-layer", frame);
  menus.style.cssText = "position: absolute; inset: 0; z-index: var(--layer-menu); pointer-events: none;";
  setMenuLayer(menus);

  // Dialogs center over the frame instead of the whole window, so their width
  // and height limits resolve against the crop.
  const modals = el("div", "demo-modal-layer", frame);
  modals.style.cssText = "position: absolute; inset: 0; z-index: var(--layer-modal); --dialog-max-width: calc(100% - 32px); --dialog-max-height: calc(100% - 48px);";
  frame.insertBefore(modals, menus);
  setModalLayer(modals);

  // Rects include any ancestor `zoom`; convert back to the frame's CSS pixels.
  const zoom = frame.getBoundingClientRect().width / size.width;
  const appBox = app.getBoundingClientRect();
  const splitBox = split.getBoundingClientRect();
  app.style.left = `${(appBox.left - splitBox.left) / zoom}px`;
  app.style.top = `${(appBox.top - splitBox.top) / zoom}px`;
  app.style.height = `${size.height + (appBox.height - splitBox.height) / zoom}px`;

  return host;
}

export interface MountedPanel {
  destroy(): void;
}

/** `callbacks` adds the panel callbacks a scene answers itself (opening notes, page previews). */
export function mountPanel(host: HTMLElement, demo: DemoHost, callbacks: Record<string, unknown> = {}): MountedPanel {
  const component = flushSync(() => mount(FolderCardPanel, {
    target: host,
    props: {
      panelModel: demo.model,
      onSearchQueryChange: ({ query }: { query: string }) => demo.setDraftQuery(query),
      onSearchQueryReset: () => {
        demo.setDraftQuery("");
        demo.commitQuery();
      },
      onNavigationIntent: (intent: NavigationIntent) => demo.handleNavigationIntent(intent),
      onNavContextMenu: (payload: NavContextMenuPayload) => demo.openNavContextMenu(payload),
      onFilterChange: ({ tags }: { tags: string[] }) => demo.update({ filterTags: tags }),
      onPropertyCommand: ({ command }: { command: "choose-visible" | "clear-filters" }) => {
        if (command === "clear-filters") demo.update({ propertyFilters: [] });
      },
      onToggleNavPane: () => demo.toggleNavPane(),
      onGroupChange: (detail: Parameters<DemoHost["setGroup"]>[0]) => demo.setGroup(detail),
      onGroupCollapseCommand: (detail: { command?: unknown; key?: unknown }) => demo.groupCollapseCommand(detail),
      ...callbacks,
    },
  }));
  return {
    destroy: () => {
      void unmount(component);
      host.replaceChildren();
    },
  };
}
