// Browser stand-in for the `obsidian` module: just enough runtime surface for
// the plugin's panel components and pure view helpers to run outside Obsidian.
import { icons, type IconNode } from "lucide";

const SVG_NS = "http://www.w3.org/2000/svg";

// Obsidian's own non-Lucide glyphs, redrawn on the 24 grid from screenshots.
const LINK_GLYPH = `<g transform="scale(0.72)"><path vector-effect="non-scaling-stroke" d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path vector-effect="non-scaling-stroke" d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></g>`;
const toViewBox100 = (body: string) => `<g transform="scale(${100 / 24})">${body}</g>`;
const customIcons = new Map<string, string>([
  ["links-going-out", toViewBox100(`${LINK_GLYPH}<path d="M13 19h8"/><path d="m18 16 3 3-3 3"/>`)],
  ["links-coming-in", toViewBox100(`${LINK_GLYPH}<path d="M21 19h-8"/><path d="m16 16-3 3 3 3"/>`)],
]);

export function addIcon(name: string, svgContent: string): void {
  customIcons.set(name, svgContent);
}

function toPascalCase(name: string): string {
  return name.replace(/^lucide-/, "").split("-").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join("");
}

function createSvg(name: string, viewBox: string, lucide = true): SVGSVGElement {
  const svg = document.createElementNS(SVG_NS, "svg");
  svg.setAttribute("xmlns", SVG_NS);
  svg.setAttribute("width", "24");
  svg.setAttribute("height", "24");
  svg.setAttribute("viewBox", viewBox);
  svg.setAttribute("fill", "none");
  svg.setAttribute("stroke", "currentColor");
  svg.setAttribute("stroke-width", "2");
  svg.setAttribute("stroke-linecap", "round");
  svg.setAttribute("stroke-linejoin", "round");
  svg.setAttribute("class", `svg-icon ${!lucide || name.startsWith("lucide-") ? name : `lucide-${name}`}`);
  return svg;
}

/** Mirrors Obsidian's markup: one `svg.svg-icon` child replacing prior content. */
export function setIcon(el: HTMLElement, name: string): void {
  el.replaceChildren();
  const custom = customIcons.get(name);
  if (custom) {
    // Obsidian's own glyphs carry their bare name as the class.
    const svg = createSvg(name, "0 0 100 100", false);
    svg.innerHTML = custom;
    el.appendChild(svg);
    return;
  }
  const node = (icons as Record<string, IconNode | undefined>)[toPascalCase(name)];
  if (!node) {
    console.warn(`[obsidian shim] unknown icon "${name}"`);
    return;
  }
  const svg = createSvg(name, "0 0 24 24");
  for (const [tag, attrs] of node) {
    const child = document.createElementNS(SVG_NS, tag);
    for (const [key, value] of Object.entries(attrs)) {
      if (value !== undefined) child.setAttribute(key, String(value));
    }
    svg.appendChild(child);
  }
  el.appendChild(svg);
}

let language = "zh";

/** Stage-only: the language Obsidian would report, for code that asks it directly. */
export function setDemoLanguage(next: string): void {
  language = next;
}

export function getLanguage(): string {
  return language;
}

export function setTooltip(el: HTMLElement, tooltip: string): void {
  el.setAttribute("aria-label", tooltip);
}

export function getIcon(name: string): SVGSVGElement | null {
  const host = document.createElement("div");
  setIcon(host, name);
  return host.querySelector("svg");
}

export function normalizePath(path: string): string {
  return path.trim().replace(/\\/g, "/").replace(/\/{2,}/g, "/").replace(/^\/+|\/+$/g, "");
}

export function debounce<T extends unknown[]>(callback: (...args: T) => void): ((...args: T) => void) & { cancel(): void; run(): void } {
  const debounced = ((...args: T) => callback(...args)) as ((...args: T) => void) & { cancel(): void; run(): void };
  debounced.cancel = () => {};
  debounced.run = () => {};
  return debounced;
}

export const Platform = { isDesktopApp: true, isDesktop: true, isMobile: false, isMacOS: false, isWin: true };

export abstract class TAbstractFile {
  path = "";
  name = "";
  parent: TFolder | null = null;
}

export class TFile extends TAbstractFile {
  basename = "";
  extension = "";
  stat = { ctime: 0, mtime: 0, size: 0 };
}

export class TFolder extends TAbstractFile {
  children: TAbstractFile[] = [];
  isRoot(): boolean {
    return this.path === "";
  }
}

interface FrontmatterCache {
  tags?: unknown;
  tag?: unknown;
  [key: string]: unknown;
}

/** Obsidian's contract: frontmatter tags plus inline tags, each with a leading `#`. */
export function getAllTags(cache: { frontmatter?: FrontmatterCache; tags?: Array<{ tag: string }> } | null): string[] | null {
  if (!cache) return null;
  const out: string[] = [];
  const fm = cache.frontmatter;
  for (const raw of [fm?.tags, fm?.tag]) {
    const values = Array.isArray(raw) ? raw : typeof raw === "string" ? raw.split(/[,\s]+/) : [];
    for (const value of values) {
      if (typeof value === "string" && value.trim()) out.push(`#${value.trim().replace(/^#/, "")}`);
    }
  }
  for (const entry of cache.tags ?? []) out.push(entry.tag);
  return out;
}

/** The stage's metadata has no headings or blocks, so a subpath never resolves. */
export function resolveSubpath(_cache: unknown, _subpath: string): null {
  return null;
}

/** Obsidian drops the characters a link subpath cannot carry. */
export function stripHeadingForLink(heading: string): string {
  return heading.replace(/[#|^\\%[\]:]/g, " ").replace(/\s+/g, " ").trim();
}

export class App {}
export class Component {}
/** `instanceof` targets only: the stage's editor is `stage/live-preview.ts`, and no leaf is a MarkdownView. */
export class Editor {}
export class MarkdownView {}
/** Notices open in the window's top-right corner, outside every cropped frame. */
export class Notice {
  constructor(_message: string) {}
}

type DomElementInfo = string | {
  cls?: string | string[];
  text?: string;
  attr?: Record<string, string | number | boolean | null>;
  title?: string;
  type?: string;
  value?: string;
  placeholder?: string;
};

/** Obsidian's DOM prototype extensions, for plugin code that builds dialogs imperatively. */
function installDomExtensions(): void {
  const proto = Node.prototype as unknown as Record<string, unknown>;
  if (proto.createEl) return;
  const apply = (el: HTMLElement, info?: DomElementInfo): void => {
    if (info === undefined) return;
    if (typeof info === "string") {
      el.className = info;
      return;
    }
    if (info.cls) el.className = Array.isArray(info.cls) ? info.cls.join(" ") : info.cls;
    if (info.text !== undefined) el.textContent = info.text;
    if (info.title !== undefined) el.title = info.title;
    if (info.type !== undefined) el.setAttribute("type", info.type);
    if (info.value !== undefined) (el as HTMLInputElement).value = info.value;
    if (info.placeholder !== undefined) el.setAttribute("placeholder", info.placeholder);
    for (const [key, value] of Object.entries(info.attr ?? {})) {
      if (value !== null && value !== false) el.setAttribute(key, String(value));
    }
  };
  function createEl(this: Node, tag: string, info?: DomElementInfo, callback?: (el: HTMLElement) => void): HTMLElement {
    const doc = this.ownerDocument ?? document;
    const el = doc.createElement(tag);
    apply(el, info);
    this.appendChild(el);
    callback?.(el);
    return el;
  }
  Object.assign(proto, {
    createEl,
    createDiv(this: Node, info?: DomElementInfo, callback?: (el: HTMLElement) => void) {
      return createEl.call(this, "div", info, callback);
    },
    createSpan(this: Node, info?: DomElementInfo, callback?: (el: HTMLElement) => void) {
      return createEl.call(this, "span", info, callback);
    },
    empty(this: Node) {
      while (this.firstChild) this.removeChild(this.firstChild);
    },
    setText(this: Node, text: string) {
      this.textContent = text;
    },
  });
  Object.assign(Element.prototype, {
    addClass(this: Element, ...classes: string[]) {
      this.classList.add(...classes.flatMap((cls) => cls.split(/\s+/)).filter(Boolean));
    },
    removeClass(this: Element, ...classes: string[]) {
      this.classList.remove(...classes);
    },
    toggleClass(this: Element, cls: string, value: boolean) {
      this.classList.toggle(cls, value);
    },
    hasClass(this: Element, cls: string) {
      return this.classList.contains(cls);
    },
    setAttr(this: Element, name: string, value: string | number | boolean | null) {
      if (value === null || value === false) this.removeAttribute(name);
      else this.setAttribute(name, String(value));
    },
  });
}
installDomExtensions();

/** The stage runs the 1.13+ code paths: native confirmation dialogs. */
export function requireApiVersion(_version: string): boolean {
  return true;
}

/** Where dialogs open, standing in for the window body; the shell crops it to the sidebar frame. */
let modalLayer: HTMLElement | null = null;

export function setModalLayer(layer: HTMLElement | null): void {
  modalLayer = layer;
}

export class ButtonComponent {
  readonly buttonEl: HTMLButtonElement;
  private handler: ((event: MouseEvent) => unknown) | null = null;

  constructor(containerEl: HTMLElement) {
    this.buttonEl = containerEl.ownerDocument.createElement("button");
    containerEl.appendChild(this.buttonEl);
    this.buttonEl.addEventListener("click", (event) => {
      if (!this.buttonEl.disabled) void this.handler?.(event);
    });
  }
  setButtonText(text: string): this {
    this.buttonEl.textContent = text;
    return this;
  }
  setCta(): this {
    this.buttonEl.classList.add("mod-cta");
    return this;
  }
  setWarning(): this {
    this.buttonEl.classList.add("mod-warning");
    return this;
  }
  setClass(cls: string): this {
    this.buttonEl.classList.add(cls);
    return this;
  }
  setIcon(icon: string): this {
    setIcon(this.buttonEl, icon);
    return this;
  }
  setTooltip(tooltip: string): this {
    setTooltip(this.buttonEl, tooltip);
    return this;
  }
  setDisabled(disabled: boolean): this {
    this.buttonEl.disabled = disabled;
    return this;
  }
  onClick(handler: (event: MouseEvent) => unknown): this {
    this.handler = handler;
    return this;
  }
}

export class ExtraButtonComponent {
  readonly extraSettingsEl: HTMLElement;
  private handler: (() => unknown) | null = null;

  constructor(containerEl: HTMLElement) {
    this.extraSettingsEl = div("clickable-icon extra-setting-button", containerEl);
    this.extraSettingsEl.tabIndex = 0;
    setIcon(this.extraSettingsEl, "lucide-settings");
    this.extraSettingsEl.addEventListener("click", () => void this.handler?.());
  }
  setIcon(icon: string): this {
    setIcon(this.extraSettingsEl, icon);
    return this;
  }
  setTooltip(tooltip: string): this {
    setTooltip(this.extraSettingsEl, tooltip);
    return this;
  }
  setDisabled(disabled: boolean): this {
    this.extraSettingsEl.classList.toggle("is-disabled", disabled);
    return this;
  }
  onClick(handler: () => unknown): this {
    this.handler = handler;
    return this;
  }
}

export class TextComponent {
  readonly inputEl: HTMLInputElement;
  private handler: ((value: string) => unknown) | null = null;

  constructor(containerEl: HTMLElement) {
    this.inputEl = containerEl.ownerDocument.createElement("input");
    this.inputEl.type = "text";
    this.inputEl.spellcheck = false;
    containerEl.appendChild(this.inputEl);
    this.inputEl.addEventListener("input", () => void this.handler?.(this.inputEl.value));
  }
  getValue(): string {
    return this.inputEl.value;
  }
  setValue(value: string): this {
    this.inputEl.value = value;
    return this;
  }
  setPlaceholder(placeholder: string): this {
    this.inputEl.placeholder = placeholder;
    return this;
  }
  setDisabled(disabled: boolean): this {
    this.inputEl.disabled = disabled;
    return this;
  }
  onChange(handler: (value: string) => unknown): this {
    this.handler = handler;
    return this;
  }
}

/** Obsidian sizes a dropdown to its selected label through a hidden twin. */
export class DropdownComponent {
  readonly selectEl: HTMLSelectElement;
  private readonly measureEl: HTMLSelectElement;
  private readonly measureOptionEl: HTMLOptionElement;
  private handler: ((value: string) => unknown) | null = null;

  constructor(containerEl: HTMLElement) {
    const doc = containerEl.ownerDocument;
    this.selectEl = doc.createElement("select");
    this.selectEl.className = "dropdown";
    this.measureEl = doc.createElement("select");
    this.measureEl.className = "dropdown is-measuring";
    this.measureEl.setAttribute("aria-hidden", "true");
    this.measureEl.tabIndex = -1;
    this.measureOptionEl = doc.createElement("option");
    this.measureEl.appendChild(this.measureOptionEl);
    containerEl.append(this.selectEl, this.measureEl);
    this.selectEl.addEventListener("change", () => {
      this.resizeToFit();
      void this.handler?.(this.selectEl.value);
    });
  }
  resizeToFit(): void {
    const option = this.selectEl.options[this.selectEl.selectedIndex];
    if (!option) return;
    this.measureOptionEl.text = option.text;
    this.selectEl.style.setProperty("--dropdown-fitted-width", `${this.measureEl.offsetWidth}px`);
  }
  addOption(value: string, display: string): this {
    const option = this.selectEl.ownerDocument.createElement("option");
    option.value = value;
    option.textContent = display;
    this.selectEl.appendChild(option);
    return this;
  }
  addOptions(options: Record<string, string>): this {
    for (const [value, display] of Object.entries(options)) this.addOption(value, display);
    return this;
  }
  getValue(): string {
    return this.selectEl.value;
  }
  setValue(value: string): this {
    this.selectEl.value = value;
    this.resizeToFit();
    return this;
  }
  setDisabled(disabled: boolean): this {
    this.selectEl.disabled = disabled;
    return this;
  }
  onChange(handler: (value: string) => unknown): this {
    this.handler = handler;
    return this;
  }
}

/** Obsidian's toggle: `.checkbox-container`, `is-enabled` when on, around a hidden checkbox. */
export class ToggleComponent {
  readonly toggleEl: HTMLElement;
  private value = false;
  private handler: ((value: boolean) => unknown) | null = null;

  constructor(containerEl: HTMLElement) {
    this.toggleEl = div("checkbox-container", containerEl);
    const input = containerEl.ownerDocument.createElement("input");
    input.type = "checkbox";
    input.tabIndex = 0;
    this.toggleEl.appendChild(input);
    this.toggleEl.addEventListener("click", () => {
      this.setValue(!this.value);
      void this.handler?.(this.value);
    });
  }
  getValue(): boolean {
    return this.value;
  }
  setValue(on: boolean): this {
    this.value = on;
    this.toggleEl.classList.toggle("is-enabled", on);
    return this;
  }
  setDisabled(disabled: boolean): this {
    this.toggleEl.classList.toggle("is-disabled", disabled);
    return this;
  }
  onChange(handler: (value: boolean) => unknown): this {
    this.handler = handler;
    return this;
  }
}

/** Obsidian's `Setting` row: name and description on the left, controls on the right. */
export class Setting {
  readonly settingEl: HTMLElement;
  readonly infoEl: HTMLElement;
  readonly nameEl: HTMLElement;
  readonly descEl: HTMLElement;
  readonly controlEl: HTMLElement;

  constructor(containerEl: HTMLElement) {
    this.settingEl = div("setting-item", containerEl);
    this.settingEl.tabIndex = -1;
    this.infoEl = div("setting-item-info", this.settingEl);
    this.nameEl = div("setting-item-name", this.infoEl);
    this.descEl = div("setting-item-description", this.infoEl);
    this.controlEl = div("setting-item-control", this.settingEl);
  }
  setName(name: string | DocumentFragment): this {
    this.nameEl.replaceChildren(name);
    return this;
  }
  setDesc(desc: string | DocumentFragment): this {
    this.descEl.replaceChildren(desc);
    return this;
  }
  setClass(cls: string): this {
    this.settingEl.classList.add(cls);
    return this;
  }
  setHeading(): this {
    this.settingEl.classList.add("setting-item-heading");
    return this;
  }
  addText(configure: (text: TextComponent) => unknown): this {
    configure(new TextComponent(this.controlEl));
    return this;
  }
  addDropdown(configure: (dropdown: DropdownComponent) => unknown): this {
    configure(new DropdownComponent(this.controlEl));
    return this;
  }
  addToggle(configure: (toggle: ToggleComponent) => unknown): this {
    configure(new ToggleComponent(this.controlEl));
    return this;
  }
  addButton(configure: (button: ButtonComponent) => unknown): this {
    configure(new ButtonComponent(this.controlEl));
    return this;
  }
  addExtraButton(configure: (button: ExtraButtonComponent) => unknown): this {
    configure(new ExtraButtonComponent(this.controlEl));
    return this;
  }
}

/** Obsidian 1.14 `SettingGroup`: a heading row, prepended once it has content, above the list. */
export class SettingGroup {
  readonly groupEl: HTMLElement;
  private readonly headerEl: HTMLElement;
  private readonly headerInnerEl: HTMLElement;
  private readonly controlEl: HTMLElement;
  private readonly listEl: HTMLElement;

  constructor(containerEl: HTMLElement) {
    this.groupEl = div("setting-group", containerEl);
    this.headerEl = div("setting-item setting-item-heading");
    this.headerInnerEl = div("setting-item-name", this.headerEl);
    this.controlEl = div("setting-item-control", this.headerEl);
    const search = div("setting-group-search", this.groupEl);
    search.tabIndex = -1;
    this.listEl = div("setting-items", this.groupEl);
  }
  setHeading(text: string): this {
    this.headerInnerEl.textContent = text;
    if (!this.headerEl.isConnected) this.groupEl.prepend(this.headerEl);
    return this;
  }
  addClass(...classes: string[]): this {
    this.groupEl.classList.add(...classes);
    return this;
  }
  addSetting(configure: (setting: Setting) => unknown): this {
    configure(new Setting(this.listEl));
    return this;
  }
  addExtraButton(configure: (button: ExtraButtonComponent) => unknown): this {
    if (!this.headerEl.isConnected) this.groupEl.prepend(this.headerEl);
    configure(new ExtraButtonComponent(this.controlEl));
    return this;
  }
}

/**
 * Obsidian 1.14 modal markup inside the stage's modal layer, opened without
 * its entrance animation: `.modal-container.mod-dim > .modal-bg + .modal >
 * .modal-header-button + .modal-header > .modal-title, + .modal-content`.
 */
export class Modal {
  readonly containerEl: HTMLElement;
  readonly bgEl: HTMLElement;
  readonly modalEl: HTMLElement;
  readonly headerEl: HTMLElement;
  readonly titleEl: HTMLElement;
  readonly contentEl: HTMLElement;

  constructor(public app: unknown) {
    this.containerEl = div("modal-container");
    this.bgEl = div("modal-bg", this.containerEl);
    this.modalEl = div("modal", this.containerEl);
    const close = div("modal-header-button mod-raised clickable-icon", this.modalEl);
    setIcon(close, "x");
    close.addEventListener("click", () => this.close());
    this.headerEl = div("modal-header", this.modalEl);
    this.titleEl = div("modal-title", this.headerEl);
    this.contentEl = div("modal-content", this.modalEl);
  }
  setTitle(title: string | DocumentFragment): this {
    this.titleEl.replaceChildren(title);
    return this;
  }
  setContent(content: string | DocumentFragment): this {
    this.contentEl.replaceChildren(content);
    return this;
  }
  open(): void {
    if (!modalLayer) return;
    modalLayer.appendChild(this.containerEl);
    this.onOpen();
    this.containerEl.classList.add("mod-dim");
    this.bgEl.style.opacity = "0.85";
  }
  close(): void {
    if (!this.containerEl.isConnected) return;
    this.containerEl.remove();
    this.onClose();
  }
  onOpen(): void {}
  onClose(): void {}
}

/** Obsidian 1.13 `ConfirmationModal`: a button row below the content; a truthy handler result keeps it open. */
export class ConfirmationModal extends Modal {
  private readonly buttonContainerEl: HTMLElement;

  constructor(app: unknown) {
    super(app);
    this.containerEl.classList.add("mod-confirmation");
    this.buttonContainerEl = div("modal-button-container", this.modalEl);
  }
  addClass(cls: string): this {
    this.modalEl.classList.add(cls);
    return this;
  }
  /** `ConfirmationButton`: closes on click unless its handler resolves truthy. */
  addButton(configure: (button: ButtonComponent) => unknown): this {
    const button = new ButtonComponent(this.buttonContainerEl);
    const register = button.onClick.bind(button);
    button.onClick = (handler) => register(async (event) => {
      if (!(await handler(event))) this.close();
    });
    button.onClick(() => undefined);
    configure(button);
    return this;
  }
  addCancelButton(text = "Cancel"): this {
    return this.addButton((button) => button.setButtonText(text).setClass("mod-cancel"));
  }
}

/** Import target only: no clip opens a suggester. */
export class FuzzySuggestModal<T> extends Modal {
  setPlaceholder(_placeholder: string): void {}
  getItems(): T[] { return []; }
  getItemText(_item: T): string { return ""; }
  onChooseItem(_item: T): void {}
}

/** The scene renders `getSettingDefinitions()` itself; the base only carries what tabs read. */
export class PluginSettingTab {
  containerEl = document.createElement("div");
  constructor(public app: unknown, public plugin: unknown) {}
  display(): void {}
  hide(): void {}
  refreshDomState(): void {}
}
/**
 * Where menus open, standing in for the document body. Positions arrive in
 * client coordinates (zoomed and camera-transformed) and are converted back to
 * the layer's CSS pixels; the layer's size is the body size menus flip within.
 */
let menuLayer: HTMLElement | null = null;

export function setMenuLayer(layer: HTMLElement | null): void {
  menuLayer = layer;
}

function div(cls: string, parent?: HTMLElement): HTMLDivElement {
  const node = document.createElement("div");
  node.className = cls;
  parent?.appendChild(node);
  return node;
}

/** Obsidian 1.14 `MenuItem` markup: icon, title, then optional check and submenu icons. */
export class MenuItem {
  readonly dom = div("menu-item tappable");
  private readonly iconEl = div("menu-item-icon", this.dom);
  private readonly titleEl = div("menu-item-title", this.dom);
  private checkIconEl: HTMLElement | null = null;
  submenu: Menu | null = null;
  disabled = false;
  private callback: ((event: MouseEvent) => unknown) | null = null;

  constructor(private readonly menu: Menu) {
    this.dom.addEventListener("click", (event) => this.handleEvent(event));
  }

  setTitle(title: string | DocumentFragment): this {
    if (typeof title === "string") this.titleEl.textContent = title;
    else this.titleEl.replaceChildren(title);
    return this;
  }
  setIcon(icon: string | null): this {
    if (icon) setIcon(this.iconEl, icon);
    else this.iconEl.replaceChildren();
    return this;
  }
  setChecked(checked: boolean | null): this {
    if (checked) {
      if (!this.checkIconEl) {
        this.checkIconEl = div("menu-item-icon mod-checked", this.dom);
        setIcon(this.checkIconEl, "lucide-check");
      }
    } else {
      this.checkIconEl?.remove();
      this.checkIconEl = null;
    }
    this.dom.classList.toggle("mod-checked", Boolean(checked));
    return this;
  }
  setDisabled(disabled: boolean): this {
    this.disabled = disabled;
    this.dom.classList.toggle("is-disabled", disabled);
    return this;
  }
  setWarning(warning: boolean): this {
    this.dom.classList.toggle("is-warning", warning);
    return this;
  }
  setIsLabel(label: boolean): this {
    this.dom.classList.toggle("tappable", !label);
    this.dom.classList.toggle("is-label", label);
    return this;
  }
  setSection(section: string): this {
    this.dom.dataset.section = section;
    return this;
  }
  setSubmenu(): Menu {
    if (!this.submenu) {
      this.dom.classList.add("has-submenu");
      this.submenu = new Menu();
      setIcon(div("menu-item-icon mod-submenu", this.dom), "lucide-chevron-right");
    }
    return this.submenu;
  }
  onClick(callback: (event: MouseEvent) => unknown): this {
    this.callback = callback;
    return this;
  }

  /** A desktop click on a submenu item opens it at once; any other item runs and closes the menu chain. */
  private handleEvent(event: MouseEvent): void {
    if (this.disabled) return;
    if (this.submenu) {
      this.menu.select(this);
      this.menu.openSubmenu(this);
      return;
    }
    this.callback?.(event);
    this.menu.hide();
  }
}

class MenuSeparator {
  readonly dom = div("menu-separator");
}

export interface MenuPositionDef {
  x: number;
  y: number;
  width?: number;
  overlap?: boolean;
  left?: boolean;
}

export class Menu {
  readonly dom = div("menu");
  private readonly scrollEl: HTMLElement;
  private items: Array<MenuItem | MenuSeparator> = [];
  private parentMenu: Menu | null = null;
  private currentSubmenu: Menu | null = null;
  private readonly hideCallbacks: Array<() => unknown> = [];

  constructor() {
    div("menu-grabber", this.dom);
    this.scrollEl = div("menu-scroll", this.dom);
  }

  addItem(configure: (item: MenuItem) => unknown): this {
    const item = new MenuItem(this);
    this.items.push(item);
    configure(item);
    return this;
  }
  addSeparator(): this {
    this.items.push(new MenuSeparator());
    return this;
  }
  setNoIcon(): this {
    this.dom.classList.add("mod-no-icon");
    return this;
  }
  setUseNativeMenu(): this { return this; }
  setParentElement(): this { return this; }
  onHide(callback: () => unknown): this {
    this.hideCallbacks.push(callback);
    return this;
  }

  showAtMouseEvent(event: MouseEvent): this {
    return this.showAtPosition({ x: event.clientX, y: event.clientY });
  }

  /** Obsidian's desktop placement, with the layer as the body. */
  showAtPosition(position: MenuPositionDef): this {
    const layer = menuLayer;
    if (!layer || this.items.length === 0) return this;
    this.render();
    const base = layer.getBoundingClientRect();
    const scale = base.width / layer.offsetWidth || 1;
    const x = (position.x - base.left) / scale;
    let y = (position.y - base.top) / scale;
    Object.assign(this.dom.style, { position: "absolute", left: "0px", top: "0px" });
    layer.appendChild(this.dom);
    const width = this.dom.offsetWidth;
    const height = this.dom.offsetHeight;
    const bodyWidth = layer.offsetWidth;
    const bodyHeight = layer.offsetHeight;
    let right: number;
    let left: number;
    if (position.width) {
      right = position.overlap ? x : x + position.width;
      left = position.overlap ? x + position.width : x;
    } else {
      right = x + 2;
      left = x - 2;
    }
    const fitsLeft = left - width >= 0;
    this.dom.style.left = `${!(right + width <= bodyWidth) || (position.left && fitsLeft) ? Math.max(0, left - width) : right}px`;
    if (y + height > bodyHeight) y = Math.max(0, y - height);
    this.dom.style.top = `${y + 2}px`;
    return this;
  }

  hide(): this {
    this.closeSubmenu();
    if (this.dom.isConnected) {
      this.dom.remove();
      for (const callback of this.hideCallbacks) callback();
    }
    this.parentMenu?.hide();
    return this;
  }

  select(item: MenuItem): void {
    for (const entry of this.items) {
      if (entry instanceof MenuItem) entry.dom.classList.toggle("selected", entry === item);
    }
  }

  openSubmenu(item: MenuItem): void {
    const submenu = item.submenu;
    if (!submenu || item.disabled || this.currentSubmenu === submenu) return;
    this.closeSubmenu();
    submenu.parentMenu = this;
    submenu.dom.classList.add("demo-submenu");
    this.currentSubmenu = submenu;
    const style = getComputedStyle(this.dom);
    const top = parseFloat(style.paddingTop) + parseFloat(style.borderTopWidth);
    const before = parseFloat(style.paddingLeft) + parseFloat(style.borderLeftWidth) + 2;
    const after = parseFloat(style.paddingRight) + parseFloat(style.borderRightWidth) + 2;
    const rect = item.dom.getBoundingClientRect();
    const scale = this.dom.getBoundingClientRect().width / this.dom.offsetWidth || 1;
    submenu.showAtPosition({ x: rect.x - before * scale, y: rect.y - top * scale, width: rect.width + (before + after) * scale });
  }

  private closeSubmenu(): void {
    const submenu = this.currentSubmenu;
    if (!submenu) return;
    this.currentSubmenu = null;
    submenu.parentMenu = null;
    submenu.hide();
  }

  /** `Menu.sort` without sections: items in order, separators splitting `.menu-group`s, trailing separators dropped. */
  private render(): void {
    while (this.items.at(-1) instanceof MenuSeparator) this.items.pop();
    this.scrollEl.replaceChildren();
    let group: HTMLElement | null = null;
    for (const entry of this.items) {
      if (entry instanceof MenuItem) {
        group ??= div("menu-group", this.scrollEl);
        group.appendChild(entry.dom);
      } else {
        group = null;
        this.scrollEl.appendChild(entry.dom);
      }
    }
  }
}
