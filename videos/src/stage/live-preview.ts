// Obsidian's Live Preview editor rebuilt as CodeMirror 6 renders it: one
// `.cm-line` per source line, headings and list markers decorated the HyperMD
// way, links rendered except where the caret reveals their syntax, the
// properties widget in place of the frontmatter, and the caret and drop
// cursor layers. Behind it sits the slice of Obsidian's `Editor` the plugin's
// drop controller calls, so inserts land in the source and re-render.
import { parse as parseYaml } from "yaml";
import { setIcon, type TFile } from "obsidian";
import type { DemoVault } from "./demo-vault";
import { renderProperties } from "./reading-view";
import type { MainWindow } from "./window-shell";

export interface EditorPosition {
  line: number;
  ch: number;
}

const FRONTMATTER = /^---\r?\n[\s\S]*?\r?\n---\r?\n?/;
const HEADING = /^(#{1,6}) (.*)$/;
const LIST = /^(\s*)([-*+])( |$)(.*)$/;
const WIKI_LINK = /(?<!!)\[\[([^\]|]+)(?:\|([^\]]*))?\]\]/g;

function el<K extends keyof HTMLElementTagNameMap>(tag: K, cls: string, parent?: HTMLElement): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (cls) node.className = cls;
  parent?.appendChild(node);
  return node;
}

/** Rendered text that shows its source characters one for one, so a source column maps to a caret spot. */
interface Segment {
  node: Text;
  from: number;
}

/** The `Editor` methods `EditorDropController` uses, over a plain string. */
export class LivePreviewEditor {
  constructor(private doc: string, private cursor: EditorPosition, private readonly changed: () => void) {}

  getValue(): string {
    return this.doc;
  }

  getCursor(): EditorPosition {
    return { ...this.cursor };
  }

  setCursor(position: EditorPosition): void {
    this.cursor = { ...position };
    this.changed();
  }

  posToOffset(position: EditorPosition): number {
    const lines = this.doc.split("\n");
    let offset = 0;
    for (let line = 0; line < position.line; line += 1) offset += lines[line].length + 1;
    return offset + position.ch;
  }

  offsetToPos(offset: number): EditorPosition {
    const before = this.doc.slice(0, offset);
    const line = before.split("\n").length - 1;
    return { line, ch: offset - (before.lastIndexOf("\n") + 1) };
  }

  replaceRange(text: string, from: EditorPosition, to: EditorPosition = from): void {
    const start = this.posToOffset(from);
    const end = this.posToOffset(to);
    this.doc = this.doc.slice(0, start) + text + this.doc.slice(end);
    this.changed();
  }
}

export interface LivePreviewOptions {
  vault: DemoVault;
  path: string;
  /** Editor buffer; defaults to the note on disk. */
  doc?: string;
  cursor: EditorPosition;
  focused?: boolean;
  propertiesLabel?: string;
  addPropertyLabel?: string;
}

export interface LivePreview {
  editor: LivePreviewEditor;
  /** The `MarkdownFileInfo` an `editor-drop` event carries. */
  info: { file: TFile; editor: LivePreviewEditor };
  editorEl: HTMLElement;
  scroller: HTMLElement;
  setFocused(focused: boolean): void;
  /** The caret's blink phase while focused. */
  setCaretVisible(visible: boolean): void;
  /** CodeMirror's `dropCursor()` at `position`, or hidden. */
  setDropCursor(position: EditorPosition | null): void;
  /** The rendered `.cm-line` of a source line. */
  lineEl(line: number): HTMLElement;
}

/**
 * Switches the window's note leaf to Live Preview on `options.path`: the
 * leaf keeps its header and gains the reading-mode toggle editing shows.
 */
export function mountLivePreview(win: MainWindow, options: LivePreviewOptions): LivePreview {
  const leaf = win.rootLeafContent.querySelector<HTMLElement>('.workspace-leaf-content[data-type="markdown"]');
  const viewContent = leaf?.querySelector<HTMLElement>(".view-content");
  if (!leaf || !viewContent) throw new Error("Main window has no note leaf");
  leaf.dataset.mode = "source";
  const actions = leaf.querySelector<HTMLElement>(".view-actions");
  if (actions) {
    const toggle = el("button", "clickable-icon view-action");
    setIcon(toggle, "book-open");
    actions.prepend(toggle);
  }

  const file = options.vault.app.vault.getAbstractFileByPath(options.path) as TFile;
  const source = el("div", "markdown-source-view cm-s-obsidian mod-cm6 node-insert-event is-readable-line-width is-live-preview is-folding show-properties");
  const editorEl = el("div", "cm-editor ͼ1 ͼ2", source);
  const scroller = el("div", "cm-scroller", editorEl);
  scroller.tabIndex = -1;
  const sizer = el("div", "cm-sizer", scroller);
  const title = el("div", "inline-title", sizer);
  title.textContent = file.basename;
  const header = el("div", "", sizer);
  header.style.display = "contents";
  const container = el("div", "cm-contentContainer", sizer);
  const content = el("div", "cm-content cm-lineWrapping", container);
  content.setAttribute("contenteditable", "true");
  content.setAttribute("role", "textbox");
  const cursorLayer = el("div", "cm-layer cm-cursorLayer", scroller);
  cursorLayer.setAttribute("aria-hidden", "true");
  const caret = el("div", "cm-cursor cm-cursor-primary", cursorLayer);
  const dropCursor = el("div", "cm-dropCursor", scroller);
  dropCursor.style.display = "none";
  viewContent.replaceChildren(source);

  let focused = options.focused ?? false;
  let dropAt: EditorPosition | null = null;
  const lines = new Map<number, { el: HTMLElement; segments: Segment[] }>();
  const editor = new LivePreviewEditor(options.doc ?? options.vault.readMarkdown(options.path), options.cursor, () => render());

  /** A rect in scroller layout pixels (the layers' coordinate space). */
  const local = (rect: DOMRect) => {
    const frame = scroller.getBoundingClientRect();
    const scale = frame.width / scroller.offsetWidth || 1;
    return {
      left: (rect.left - frame.left) / scale + scroller.scrollLeft,
      top: (rect.top - frame.top) / scale + scroller.scrollTop,
      height: rect.height / scale,
    };
  };

  /** Where CodeMirror draws a caret at `position`. */
  const caretBox = (position: EditorPosition) => {
    const line = lines.get(position.line);
    if (!line) throw new Error(`Line ${position.line} is not rendered`);
    const range = document.createRange();
    const hit = [...line.segments].reverse().find((segment) => position.ch >= segment.from && position.ch <= segment.from + segment.node.length);
    if (hit) {
      range.setStart(hit.node, position.ch - hit.from);
      range.collapse(true);
      return local(range.getBoundingClientRect());
    }
    const box = local(line.el.getBoundingClientRect());
    const style = getComputedStyle(line.el);
    return { left: box.left + parseFloat(style.paddingInlineStart), top: box.top + parseFloat(style.paddingTop), height: parseFloat(style.lineHeight) };
  };

  const place = (node: HTMLElement, position: EditorPosition) => {
    const box = caretBox(position);
    Object.assign(node.style, { left: `${box.left}px`, top: `${box.top}px`, height: `${box.height}px` });
  };

  function renderInline(text: string, from: number, parent: HTMLElement, reveal: boolean, extra: string, segments: Segment[]): void {
    const textSpan = (value: string, start: number, cls: string) => {
      const target = cls || extra ? el("span", `${cls} ${extra}`.trim(), parent) : parent;
      const node = document.createTextNode(value);
      target.appendChild(node);
      segments.push({ node, from: start });
      return target;
    };
    let last = 0;
    for (const match of text.matchAll(WIKI_LINK)) {
      const index = match.index!;
      if (index > last) textSpan(text.slice(last, index), from + last, "");
      const start = from + index;
      const end = start + match[0].length;
      const linkpath = match[1];
      const display = match[2] ?? linkpath.replace("#", " > ");
      const resolved = options.vault.app.metadataCache.getFirstLinkpathDest(linkpath.split("#")[0], options.path);
      const link = `cm-hmd-internal-link${resolved ? "" : " is-unresolved"}`;
      if (reveal && editor.getCursor().ch >= start && editor.getCursor().ch <= end) {
        textSpan("[[", start, "cm-formatting-link cm-formatting-link-start");
        const inner = el("span", `${link} ${extra}`.trim(), parent);
        const node = document.createTextNode(match[0].slice(2, -2));
        el("span", "cm-underline", inner).appendChild(node);
        segments.push({ node, from: start + 2 });
        textSpan("]]", end - 2, "cm-formatting-link cm-formatting-link-end");
      } else {
        const inner = el("span", `${link} ${extra}`.trim(), parent);
        const underline = el("span", "cm-underline", inner);
        underline.draggable = true;
        underline.textContent = display;
      }
      last = index + match[0].length;
    }
    if (last < text.length) textSpan(text.slice(last), from + last, "");
  }

  function renderLine(text: string, index: number, active: boolean): HTMLElement {
    const segments: Segment[] = [];
    const line = el("div", "cm-line");
    const heading = HEADING.exec(text);
    const list = LIST.exec(text);
    if (text.length === 0) {
      el("br", "", line);
    } else if (heading) {
      const level = heading[1].length;
      line.className = `HyperMD-header HyperMD-header-${level} cm-line`;
      const cls = `cm-header cm-header-${level}`;
      if (active) {
        const marker = el("span", `cm-formatting cm-formatting-header cm-formatting-header-${level} ${cls}`, line);
        const node = document.createTextNode(`${heading[1]} `);
        marker.appendChild(node);
        segments.push({ node, from: 0 });
      }
      renderInline(heading[2], level + 1, line, active, cls, segments);
    } else if (list) {
      const depth = Math.floor(list[1].length / 2) + 1;
      line.className = `HyperMD-list-line HyperMD-list-line-${depth} cm-line`;
      const marker = el("span", `cm-formatting cm-formatting-list cm-formatting-list-ul cm-list-${depth}`, line);
      const bullet = el("span", "list-bullet", marker);
      const dash = document.createTextNode(list[2]);
      bullet.appendChild(dash);
      segments.push({ node: dash, from: list[1].length });
      if (list[3]) {
        const space = document.createTextNode(" ");
        marker.appendChild(space);
        segments.push({ node: space, from: list[1].length + 1 });
      }
      renderInline(list[4], list[1].length + 1 + list[3].length, line, active, `cm-list-${depth}`, segments);
    } else {
      renderInline(text, 0, line, active, "", segments);
    }
    lines.set(index, { el: line, segments });
    return line;
  }

  /** CodeMirror's hanging indent for list lines: the marker sits in the line's start padding. */
  function indentLists(): void {
    for (const { el: line } of lines.values()) {
      const marker = line.querySelector<HTMLElement>(":scope > .cm-formatting-list");
      if (!marker) continue;
      const width = marker.getBoundingClientRect().width / (line.getBoundingClientRect().width / line.offsetWidth || 1);
      line.style.textIndent = `-${width}px`;
      line.style.paddingInlineStart = `${width + 4}px`;
    }
  }

  function render(): void {
    const doc = editor.getValue();
    const match = FRONTMATTER.exec(doc);
    const bodyStartLine = match ? match[0].split("\n").length - 1 : 0;
    header.replaceChildren();
    if (match) {
      const frontmatter = parseYaml(match[0].replace(/^---\r?\n/, "").replace(/\r?\n---\r?\n?$/, "")) as Record<string, unknown>;
      if (frontmatter && Object.keys(frontmatter).length > 0) renderProperties(frontmatter, options, header);
    }
    lines.clear();
    const active = focused ? editor.getCursor().line : -1;
    const sourceLines = doc.split("\n");
    content.replaceChildren(...sourceLines.slice(bodyStartLine).map((text, offset) => renderLine(text, bodyStartLine + offset, bodyStartLine + offset === active)));
    indentLists();
    editorEl.classList.toggle("cm-focused", focused);
    place(caret, editor.getCursor());
    if (dropAt) place(dropCursor, dropAt);
  }

  render();
  // Scrolled to the end, then back so the top shows a whole text row, or a whole heading.
  scroller.scrollTop = scroller.scrollHeight - scroller.clientHeight;
  const firstVisible = [...lines.values()].find(({ el: line }) => local(line.getBoundingClientRect()).top + line.offsetHeight > scroller.scrollTop);
  if (firstVisible) {
    const line = firstVisible.el;
    const style = getComputedStyle(line);
    const textTop = local(line.getBoundingClientRect()).top + parseFloat(style.paddingTop);
    const row = parseFloat(style.lineHeight);
    const rows = line.classList.contains("HyperMD-header") ? 0 : Math.floor((scroller.scrollTop - textTop) / row);
    if (scroller.scrollTop > textTop) scroller.scrollTop = textTop + rows * row - 4;
  }

  return {
    editor,
    info: { file, editor },
    editorEl,
    scroller,
    setFocused(next) {
      focused = next;
      render();
    },
    setCaretVisible(visible) {
      caret.style.visibility = visible ? "" : "hidden";
    },
    setDropCursor(position) {
      dropAt = position;
      dropCursor.style.display = position ? "" : "none";
      if (position) place(dropCursor, position);
    },
    lineEl(line) {
      const entry = lines.get(line);
      if (!entry) throw new Error(`Line ${line} is not rendered`);
      return entry.el;
    },
  };
}
