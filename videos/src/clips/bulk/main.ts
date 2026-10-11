// Bulk: in bulk mode a click and a Shift-click select a run of cards; "Merge
// selected" opens the plugin's merge dialog, whose preview shows the merged
// note before it is written; the new note joins the stream.
import gsap from "gsap";
import meta from "../../../theme/meta.json";
import workspaceHtml from "../../../theme/workspace.html?raw";
import zhSnapshot from "../../../data/vault.zh.json";
import enSnapshot from "../../../data/vault.en.json";
import { getUiStrings } from "@plugin/i18n";
import { createFolderScope } from "@plugin/view/scope";
import { BoxDemoHost } from "../../stage/box-host";
import { createDemoVault, type VaultSnapshot } from "../../stage/demo-vault";
import { call, Director, type MountedScene, type Target } from "../../stage/director";
import { applyThemeMeta, mountPanel } from "../../stage/obsidian-shell";
import { createMainWindow } from "../../stage/window-shell";
import {
  callout, center, createClipDom, FRAME, glide, LANG, popIn, popOut, pulse, registerClip, windowFor, type Point,
} from "../../clip/frame";
import { cardTitled, hoverOn, LAND, MOVE, press, resolve, scrollSteps, typeSteps } from "../../clip/script";

const COPY = {
  zh: {
    folder: "日志",
    openNote: "日志/十月第一周复盘.md",
    title: "十月日志",
    selected: (count: number) => `Shift 连选 ${count} 张`,
    merged: "合并成一篇新笔记",
  },
  en: {
    folder: "Journal",
    openNote: "Journal/October week one review.md",
    title: "October journal",
    selected: (count: number) => `Shift-click: ${count} selected`,
    merged: "Merged into one new note",
  },
}[LANG];

const ZOOM = 2;
const WINDOW = windowFor(ZOOM);
const LEFT_WIDTH = 330;
const TYPE_RATE = LANG === "zh" ? 6 : 20;

const T = (() => {
  const toBulk = 0.4;
  const clickBulk = toBulk + MOVE + LAND;
  const toFirst = clickBulk + 0.35;
  const clickFirst = toFirst + MOVE + LAND;
  const toLast = clickFirst + 0.2;
  const clickLast = toLast + MOVE + LAND;
  const toMerge = clickLast + 0.9;
  const clickMerge = toMerge + MOVE + LAND;
  const type = clickMerge + 0.55;
  const scroll = type + COPY.title.length / TYPE_RATE + 0.3;
  const scrollEnd = scroll + 1.1;
  const toSubmit = scrollEnd + 0.6;
  const clickSubmit = toSubmit + MOVE + LAND;
  const toMerged = clickSubmit + 0.35;
  return {
    toBulk, clickBulk, toFirst, clickFirst, toLast, clickLast, toMerge, clickMerge, type, scroll, scrollEnd, toSubmit, clickSubmit, toMerged,
    end: clickSubmit + 1.9 + MOVE + 0.1,
  };
})();

const snapshot = (LANG === "zh" ? zhSnapshot : enSnapshot) as unknown as VaultSnapshot;
const strings = getUiStrings(LANG);
applyThemeMeta(meta);
const dom = createClipDom(ZOOM);

let firstTitle = "";
let lastTitle = "";
/** A merge writes a note, so every mount starts from a fresh vault. */
function mountScene(): MountedScene {
  dom.stage.replaceChildren();
  const vault = createDemoVault(snapshot, "/data/files/");
  const demo = new BoxDemoHost(vault, structuredClone(snapshot.settings), LANG, {
    navPaneCollapsed: true,
    scope: createFolderScope(COPY.folder, snapshot.settings.preferences.includeSubfolders),
    selectedPath: COPY.openNote,
  });
  const titles = demo.model.getState().cards.records.map((record) => record.title);
  [firstTitle, lastTitle] = [titles[0], titles[2]];
  const win = createMainWindow(dom.stage, {
    html: workspaceHtml, meta, size: WINDOW, titleText: snapshot.name, leftWidth: LEFT_WIDTH,
    vaultName: snapshot.name, lang: LANG, note: { vault, path: COPY.openNote },
  });
  const panel = mountPanel(win.host, demo, demo.panelCallbacks());
  return { demo, host: win.frame, destroy: () => panel.destroy() };
}

const BULK = `.fce-toolbar button[aria-label="${strings.toolbar.actions.bulkTitle}"]`;
const MERGE = `.fce-toolbar-bulk-button[aria-label="${strings.toolbar.bulkActionLabels.mergeSelected}"]`;
const FIRST: Target = (host) => cardTitled(firstTitle)(host);
const LAST: Target = (host) => cardTitled(lastTitle)(host);
const TITLE_INPUT = ".demo-modal-layer .modal input[type=text]";
const MODAL_CONTENT = ".demo-modal-layer .modal-content";
const MERGED = cardTitled(COPY.title);
const SUBMIT: Target = (host) => Array.from(host.querySelectorAll<HTMLElement>(".demo-modal-layer button"))
  .find((button) => button.textContent?.trim() === strings.view.merge.mergeNotes) ?? null;

const director = new Director(mountScene, [
  ...press(T.clickBulk, BULK),
  ...press(T.clickFirst, FIRST),
  ...press(T.clickLast, LAST, { shiftKey: true }),
  ...press(T.clickMerge, MERGE),
  call(T.type - 0.01, ({ host }) => {
    const input = resolve(TITLE_INPUT, host) as HTMLInputElement;
    input.value = "";
    input.dispatchEvent(new Event("input", { bubbles: true }));
  }),
  ...typeSteps(T.type, TITLE_INPUT, COPY.title, TYPE_RATE),
  ...scrollSteps(MODAL_CONTENT, T.scroll, T.scrollEnd, 0, "end"),
  hoverOn(T.clickSubmit - LAND, SUBMIT),
  call(T.clickSubmit, ({ host }) => resolve(SUBMIT, host).click()),
  hoverOn(T.toMerged + MOVE, MERGED),
]);

async function buildTimeline(): Promise<{ tl: gsap.core.Timeline }> {
  const m = (time: number, target: Target) => director.measureAsync(time, target, dom.camera);
  const at = {
    bulk: await m(T.toBulk, BULK),
    first: await m(T.toFirst, FIRST),
    last: await m(T.toLast, LAST),
    merge: await m(T.toMerge, MERGE),
    input: await m(T.type, TITLE_INPUT),
    submit: await m(T.toSubmit, SUBMIT),
    merged: await m(T.toMerged, MERGED),
  };
  const selected = await director.readAsync(T.clickLast + 0.05, ({ demo }) => demo.model.getState().bulk.selectedCount);
  await director.seekAsync(0);

  const tl = gsap.timeline({ paused: true });
  const rest: Point = { x: FRAME.width * 0.5, y: FRAME.height * 0.62 };
  tl.set(dom.cursor, { x: rest.x, y: rest.y, opacity: 1 }, 0);
  const onCard = (box: { x: number; y: number; width: number; height: number }): Point => ({ x: box.x + box.width * 0.55, y: box.y + box.height * 0.5 });

  glide(tl, dom.cursor, center(at.bulk), T.toBulk, MOVE);
  pulse(tl, dom, center(at.bulk), T.clickBulk - 0.05);
  glide(tl, dom.cursor, onCard(at.first), T.toFirst, MOVE);
  pulse(tl, dom, onCard(at.first), T.clickFirst - 0.05);
  glide(tl, dom.cursor, onCard(at.last), T.toLast, MOVE);
  pulse(tl, dom, onCard(at.last), T.clickLast - 0.05);
  const range = callout(dom.callouts, { icon: "check-check", text: COPY.selected(selected) });
  popIn(tl, range, T.clickLast + 0.1);

  glide(tl, dom.cursor, center(at.merge), T.toMerge, MOVE);
  pulse(tl, dom, center(at.merge), T.clickMerge - 0.05);
  popOut(tl, range, T.clickMerge);
  glide(tl, dom.cursor, { x: at.input.x + at.input.width * 0.85, y: center(at.input).y + 46 }, T.clickMerge + 0.1, 0.45);

  glide(tl, dom.cursor, center(at.submit), T.toSubmit, MOVE);
  pulse(tl, dom, center(at.submit), T.clickSubmit - 0.05);
  const merged = callout(dom.callouts, { icon: "combine", text: COPY.merged, className: "is-accent" });
  popIn(tl, merged, T.clickSubmit + 0.15);
  glide(tl, dom.cursor, onCard(at.merged), T.toMerged, MOVE);

  popOut(tl, merged, T.end - MOVE - 0.3);
  glide(tl, dom.cursor, rest, T.end - MOVE - 0.1, MOVE);
  tl.set({}, {}, T.end);
  return { tl };
}

await document.fonts.ready;
const { tl } = await buildTimeline();
registerClip(director, tl, T.end, dom);
