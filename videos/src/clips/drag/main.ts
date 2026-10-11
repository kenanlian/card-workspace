// Drag into the editor: a card dragged from the stream onto the note being
// written drops through the plugin's EditorDropController, which asks how to
// insert it; "wiki link" writes the link at the drop point.
import gsap from "gsap";
import meta from "../../../theme/meta.json";
import workspaceHtml from "../../../theme/workspace.html?raw";
import zhSnapshot from "../../../data/vault.zh.json";
import enSnapshot from "../../../data/vault.en.json";
import { getUiStrings } from "@plugin/i18n";
import { DEFAULT_SETTINGS, type PluginSettings } from "@plugin/settings";
import { EditorDropController } from "@plugin/services/EditorDropController";
import { createFolderScope } from "@plugin/view/scope";
import type { App, Editor, MarkdownFileInfo } from "obsidian";
import { DemoHost } from "../../stage/demo-host";
import { createDemoVault, type VaultSnapshot } from "../../stage/demo-vault";
import { call, Director, type MountedScene, type SceneStep, type Target } from "../../stage/director";
import { mountLivePreview, type EditorPosition, type LivePreview } from "../../stage/live-preview";
import { applyThemeMeta, mountPanel } from "../../stage/obsidian-shell";
import { createMainWindow } from "../../stage/window-shell";
import {
  callout, center, createClipDom, FRAME, glide, LANG, MARGIN, popIn, popOut, pulse, registerClip, windowFor, type Point,
} from "../../clip/frame";
import { cardTitled, hoverOff, hoverOn, LAND, MOVE, resolve } from "../../clip/script";

const COPY = {
  zh: {
    folder: "读书笔记",
    card: "心流的条件",
    note: "研究/注意力研究综述.md",
    /** The section being written when the clip starts, ahead of `before`: one reference so far, the caret on a fresh bullet. */
    draft: "## 延伸阅读\n- [[红点与角标]]\n- \n\n",
    before: "## 下一步",
    drag: "拖进正在写的笔记",
    inserted: "插入为 wiki link",
  },
  en: {
    folder: "Reading",
    card: "Conditions for flow",
    note: "Research/Attention research review.md",
    draft: "## Further reading\n- [[Red dots and badges]]\n- \n\n",
    before: "## Next steps",
    drag: "Drag it into the note you're writing",
    inserted: "Inserted as a wiki link",
  },
}[LANG];

const ZOOM = 2;
const WINDOW = windowFor(ZOOM);
const LEFT_WIDTH = 330;
/** The plugin's ghost trails the pointer by 12 CSS px; the frame is zoomed. */
const GHOST_OFFSET = 12 * ZOOM;

const T = (() => {
  const toCard = 0.4;
  const press = toCard + MOVE + LAND;
  const over = press + 1.25;
  const drop = over + 0.3;
  const toOption = drop + 0.45;
  const clickOption = toOption + MOVE + LAND;
  return { toCard, press, over, drop, toOption, clickOption, end: clickOption + 1.9 + MOVE + 0.1 };
})();

const snapshot = (LANG === "zh" ? zhSnapshot : enSnapshot) as unknown as VaultSnapshot;
const vault = createDemoVault(snapshot, "/data/files/");
const strings = getUiStrings(LANG);
const pluginSettings: PluginSettings = { ...DEFAULT_SETTINGS, dragInsertAction: "ask", enableHeadingDragInsert: false };
/** Obsidian's workspace: no other leaf has the dragged note open. */
const app = Object.assign(Object.create(vault.app), { workspace: { getLeavesOfType: () => [] } }) as App;
const doc = vault.readMarkdown(COPY.note).replace(COPY.before, COPY.draft + COPY.before);
const caretAt: EditorPosition = { line: doc.split("\n").indexOf("- "), ch: 2 };
applyThemeMeta(meta);
const dom = createClipDom(ZOOM);

let editor: LivePreview;
function mountScene(): MountedScene {
  dom.stage.replaceChildren();
  const demo = new DemoHost(vault, snapshot.settings, LANG, {
    navPaneCollapsed: true,
    scope: createFolderScope(COPY.folder, snapshot.settings.preferences.includeSubfolders),
  });
  const win = createMainWindow(dom.stage, {
    html: workspaceHtml, meta, size: WINDOW, titleText: snapshot.name, leftWidth: LEFT_WIDTH,
    vaultName: snapshot.name, lang: LANG, note: { vault, path: COPY.note },
  });
  editor = mountLivePreview(win, {
    vault, path: COPY.note, doc, cursor: caretAt, focused: true,
    propertiesLabel: LANG === "zh" ? "笔记属性" : "Properties", addPropertyLabel: LANG === "zh" ? "添加笔记属性" : "Add property",
  });
  const drops = new EditorDropController({ app, getSettings: () => pluginSettings, getUiStrings: () => strings });
  const view = editor;
  // The plugin's `dragover` handler and Obsidian's `editor-drop` event, as main.ts registers them.
  view.editorEl.addEventListener("dragover", (event) => {
    if (drops.handleDragOver(event)) view.setDropCursor(view.editor.getCursor());
  });
  view.editorEl.addEventListener("drop", (event) => {
    view.setDropCursor(null);
    drops.handleWorkspaceEditorDrop(event, view.editor as unknown as Editor, view.info as unknown as MarkdownFileInfo);
  });
  const panel = mountPanel(win.host, demo);
  return { demo, host: win.frame, destroy: () => { drops.dispose(); panel.destroy(); } };
}

const CARD = cardTitled(COPY.card);
const DROP_LINE: Target = () => editor.lineEl(caretAt.line);
const WIKI_ITEM: Target = (host) => host.querySelector<HTMLElement>(".fce-card-drag-insert-menu .menu-item");

/** Client point of the caret on the drop line, where the pointer lets go. */
function dropPoint(): { x: number; y: number } {
  const line = editor.lineEl(caretAt.line).getBoundingClientRect();
  const marker = editor.lineEl(caretAt.line).querySelector(".cm-formatting-list")!.getBoundingClientRect();
  return { x: marker.right + 6, y: line.top + line.height / 2 };
}

function dragSteps(): SceneStep[] {
  let transfer = new DataTransfer();
  const event = (type: string, point: { x: number; y: number }) =>
    new DragEvent(type, { bubbles: true, cancelable: true, dataTransfer: transfer, clientX: point.x, clientY: point.y });
  return [
    hoverOn(T.press - LAND, CARD),
    call(T.press, ({ host }) => {
      transfer = new DataTransfer();
      const card = resolve(CARD, host);
      card.classList.remove("demo-hover");
      // Pressing on the card takes focus from the editor.
      editor.setFocused(false);
      const box = card.getBoundingClientRect();
      card.dispatchEvent(event("dragstart", { x: box.left + box.width * 0.3, y: box.top + 24 }));
    }),
    call(T.over, () => {
      editor.editorEl.dispatchEvent(event("dragenter", dropPoint()));
      editor.editorEl.dispatchEvent(event("dragover", dropPoint()));
    }),
    call(T.drop, ({ host }) => {
      editor.editorEl.dispatchEvent(event("drop", dropPoint()));
      resolve(CARD, host).dispatchEvent(new DragEvent("dragend", { bubbles: true, dataTransfer: transfer }));
    }),
    call(T.clickOption - LAND, ({ host }) => resolve(WIKI_ITEM, host).classList.add("selected", "demo-hover")),
    call(T.clickOption, ({ host }) => resolve(WIKI_ITEM, host).click()),
    hoverOff(T.clickOption + 0.3),
  ];
}

/** CodeMirror's caret blink while the editor has focus: 0.6 s on, 0.6 s off. */
function blinkSteps(until: number): SceneStep[] {
  const steps: SceneStep[] = [];
  for (let at = 0.6, on = false; at < until; at += 0.6, on = !on) {
    const visible = on;
    steps.push(call(at, () => editor.setCaretVisible(visible)));
  }
  return steps;
}

const director = new Director(mountScene, [...blinkSteps(T.press), ...dragSteps()]);

/** The plugin's drag ghost, redrawn in screen space at the stage's zoom. */
function cardGhost(): HTMLElement {
  const wrap = document.createElement("div");
  wrap.className = "clip-card-ghost";
  const ghost = document.createElement("div");
  ghost.className = "fce-card-drag-ghost";
  ghost.style.zoom = String(ZOOM);
  ghost.innerHTML = `<div class="fce-card-drag-ghost-self"><span class="fce-card-drag-ghost-icon" aria-hidden="true"></span><span class="fce-card-drag-ghost-title"></span></div><div class="fce-card-drag-ghost-action"></div>`;
  const icon = ghost.querySelector<HTMLElement>(".fce-card-drag-ghost-icon")!;
  icon.innerHTML = document.querySelector(".fce-card-file-icon svg")?.outerHTML ?? "";
  ghost.querySelector(".fce-card-drag-ghost-title")!.textContent = COPY.card;
  ghost.querySelector(".fce-card-drag-ghost-action")!.textContent = strings.cardItem.dragInsert;
  wrap.appendChild(ghost);
  dom.cursor.before(wrap);
  return wrap;
}

async function buildTimeline(): Promise<{ tl: gsap.core.Timeline }> {
  const m = (time: number, target: Target) => director.measureAsync(time, target, dom.camera);
  const card = await m(T.toCard, CARD);
  const grab: Point = { x: card.x + card.width * 0.3, y: card.y + 24 };
  const drop = await director.readAsync(T.over - 0.01, () => {
    const point = dropPoint();
    const origin = dom.camera.getBoundingClientRect();
    return { x: point.x - origin.left, y: point.y - origin.top };
  });
  const option = await m(T.toOption, WIKI_ITEM);
  await director.seekAsync(0);

  const tl = gsap.timeline({ paused: true });
  const rest: Point = { x: FRAME.width * 0.5, y: FRAME.height * 0.6 };
  tl.set(dom.cursor, { x: rest.x, y: rest.y, opacity: 1 }, 0);

  glide(tl, dom.cursor, grab, T.toCard, MOVE);
  tl.to(dom.cursor, { scale: 0.86, duration: 0.1, ease: "power1.in" }, T.press - 0.05);
  const ghost = cardGhost();
  tl.set(ghost, { x: grab.x + GHOST_OFFSET, y: grab.y + GHOST_OFFSET, opacity: 0 }, 0);
  tl.to(ghost, { opacity: 1, duration: 0.15, ease: "power1.out" }, T.press);
  const travel = T.over - T.press - 0.1;
  glide(tl, dom.cursor, drop, T.press + 0.1, travel);
  glide(tl, ghost, { x: drop.x + GHOST_OFFSET, y: drop.y + GHOST_OFFSET }, T.press + 0.1, travel);
  tl.set(ghost, { opacity: 0 }, T.drop);
  tl.to(dom.cursor, { scale: 1, duration: 0.22, ease: "back.out(3)" }, T.drop);

  const dragging = callout(dom.callouts, { icon: "grip-vertical", text: COPY.drag }, { left: MARGIN, bottom: MARGIN });
  popIn(tl, dragging, T.press + 0.2);

  const optionPoint = { x: option.x + option.width * 0.4, y: center(option).y };
  glide(tl, dom.cursor, optionPoint, T.toOption, MOVE);
  pulse(tl, dom, optionPoint, T.clickOption - 0.05);
  const inserted = callout(dom.callouts, { icon: "link", text: COPY.inserted, className: "is-accent" }, { left: MARGIN, bottom: MARGIN });
  popOut(tl, dragging, T.clickOption);
  popIn(tl, inserted, T.clickOption + 0.15);

  popOut(tl, inserted, T.end - MOVE - 0.3);
  glide(tl, dom.cursor, rest, T.end - MOVE - 0.1, MOVE);
  tl.set({}, {}, T.end);
  return { tl };
}

await document.fonts.ready;
const { tl } = await buildTimeline();
registerClip(director, tl, T.end, dom);
