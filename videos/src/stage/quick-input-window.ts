// The plugin's quick input window (1.4.7+) as `QuickInputWindowManager.mount`
// builds it: a frameless window document whose root holds the grip, the
// draft editor (inline title, properties widget, body lines) and the footer
// of choice buttons and Send. Obsidian's native Markdown editor cannot run on
// the stage, so the editor is its rendered markup, redrawn from a draft state
// that scenes set; `reset` returns it to the empty draft a fresh window shows.
import { setIcon } from "obsidian";
import type { UiStrings } from "@plugin/i18n";
import type { DemoVault } from "./demo-vault";
import { createPopoutDocument, type PopoutDocument } from "./native-windows";
import type { ThemeMeta } from "./obsidian-shell";
import { renderProperties } from "./reading-view";
import type { WindowSize } from "./window-shell";

export interface QuickInputDraft {
  title: string;
  body: string;
  /** `null` until "Add tags" adds the property. */
  tags: string[] | null;
  /** Text typed into the tags input, not yet a pill. */
  tagDraft: string;
  /** Where the caret shows: the body's end or the tags input. */
  caret: "body" | "tags" | null;
}

export interface QuickInputWindowOptions {
  meta: ThemeMeta;
  size: WindowSize;
  strings: UiStrings;
  vault: DemoVault;
  /** One of the plugin's tints; the "random" default picks one per window. */
  tint: string;
  defaultTitle: string;
  propertiesLabel: string;
  addPropertyLabel: string;
}

export interface QuickInputWindow extends PopoutDocument {
  root: HTMLElement;
  buttons: { tags: HTMLElement; send: HTMLElement; folder: HTMLElement };
  set(patch: Partial<QuickInputDraft>): void;
  reset(): void;
  readonly draft: Readonly<QuickInputDraft>;
}

const EMPTY: QuickInputDraft = { title: "", body: "", tags: null, tagDraft: "", caret: "body" };

export function createQuickInputWindow(target: HTMLElement, options: QuickInputWindowOptions): QuickInputWindow {
  const popout = createPopoutDocument(target, options.size, options.meta, "is-focused");
  const { doc, body } = popout;
  doc.documentElement.classList.add("fce-quick-input-window");
  body.dataset.quickInputRadius = "rounded";
  // A posed frame never shows a blinking native caret; the body's caret is drawn.
  const style = doc.createElement("style");
  style.textContent = `.fce-quick-input input { caret-color: transparent; }
.demo-caret { display: inline-block; width: 0; height: 1.25em; margin-right: -2px; border-left: 2px solid var(--text-normal); vertical-align: text-bottom; }`;
  doc.head.appendChild(style);
  const s = options.strings.noteInput;
  const el = <K extends keyof HTMLElementTagNameMap>(tag: K, cls: string, parent: HTMLElement) => {
    const node = doc.createElement(tag);
    if (cls) node.className = cls;
    parent.appendChild(node);
    return node;
  };

  const root = el("div", "fce-quick-input", body);
  root.setAttribute("role", "dialog");
  root.setAttribute("aria-label", s.quickInput);
  root.dataset.color = options.tint;
  root.style.setProperty("--fce-quick-input-tint", `var(--color-${options.tint})`);
  const grip = el("div", "fce-quick-input-grip", root);
  setIcon(el("span", "fce-quick-input-grip-icon", grip), "ellipsis");
  const editorEl = el("div", "fce-quick-input-editor", root);
  const footer = el("div", "fce-quick-input-footer", root);
  const pin = el("button", "clickable-icon fce-quick-input-pin", footer);
  pin.setAttribute("aria-pressed", "true");
  setIcon(pin, "pin");
  const button = (cls: string, icon: string) => {
    const node = el("button", `clickable-icon ${cls}`, footer);
    setIcon(node, icon);
    return node;
  };
  const folder = button("fce-quick-input-folder", "folder");
  el("span", "fce-quick-input-choice-name", folder).textContent = s.rootFolder;
  const boxes = button("fce-quick-input-boxes", "box");
  el("span", "fce-quick-input-choice-count", boxes).hidden = true;
  const tags = button("fce-quick-input-tags", "tags");
  button("fce-quick-input-property", "list");
  const actions = el("div", "fce-quick-input-actions", footer);
  el("button", "fce-quick-input-cancel", actions).textContent = s.cancel;
  const send = el("button", "mod-cta", actions);
  setIcon(el("span", "fce-quick-input-send-icon", send), "send");
  el("span", "fce-quick-input-send-label", send).textContent = s.send;

  const source = el("div", "markdown-source-view cm-s-obsidian mod-cm6 node-insert-event is-live-preview show-properties", editorEl);
  const cm = el("div", "cm-editor cm-focused ͼ1 ͼ2", source);
  const scroller = el("div", "cm-scroller", cm);
  const sizer = el("div", "cm-sizer", scroller);
  const title = el("input", "inline-title fce-quick-input-title", sizer);
  title.type = "text";
  title.placeholder = options.defaultTitle;
  const container = el("div", "cm-contentContainer", sizer);
  const content = el("div", "cm-content cm-lineWrapping", container);
  content.setAttribute("contenteditable", "true");

  let draft: QuickInputDraft = { ...EMPTY };
  const render = () => {
    title.value = draft.title;
    content.replaceChildren();
    if (draft.tags) {
      const widget = el("div", "", content);
      widget.setAttribute("contenteditable", "false");
      renderProperties({ tags: draft.tags }, {
        vault: options.vault, path: "", propertiesLabel: options.propertiesLabel, addPropertyLabel: options.addPropertyLabel,
      }, widget);
      const panel = widget.querySelector<HTMLElement>(".metadata-container")!;
      panel.classList.add("fce-quick-input-properties");
      const input = panel.querySelector<HTMLElement>(".multi-select-input")!;
      input.setAttribute("contenteditable", "true");
      input.textContent = draft.tagDraft;
      if (draft.caret === "tags") el("span", "demo-caret", input);
    }
    const line = el("div", "cm-line", content);
    if (draft.body) line.textContent = draft.body;
    else el("span", "cm-placeholder", line).textContent = s.inputPlaceholder;
    if (draft.caret === "body") {
      const caret = doc.createElement("span");
      caret.className = "demo-caret";
      if (draft.body) line.appendChild(caret);
      else line.prepend(caret);
    }
  };
  render();

  return {
    ...popout,
    root,
    buttons: { tags, send, folder },
    get draft() {
      return draft;
    },
    set(patch) {
      draft = { ...draft, ...patch };
      render();
    },
    reset() {
      draft = { ...EMPTY };
      render();
    },
  };
}
