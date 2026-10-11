// Gather: the vault's own structure gathers cards. A folder, then a tag
// inside it, then a property value that takes the tag's place; last, a folder
// dragged to the top of the list.
import gsap from "gsap";
import meta from "../../../theme/meta.json";
import workspaceHtml from "../../../theme/workspace.html?raw";
import zhSnapshot from "../../../data/vault.zh.json";
import enSnapshot from "../../../data/vault.en.json";
import {
  navigationFolderId, navigationPropertyValueId, navigationTagId,
} from "@plugin/view/navigation-model";
import { DemoHost } from "../../stage/demo-host";
import { createDemoVault, type VaultSnapshot } from "../../stage/demo-vault";
import { Director, type Box, type MountedScene, type Target } from "../../stage/director";
import { applyThemeMeta, mountPanel } from "../../stage/obsidian-shell";
import { createMainWindow } from "../../stage/window-shell";
import {
  callout, carry, createClipDom, dragGhost, FRAME, glide, LANG, popIn, popOut, pulse, registerClip, THREE_COLUMN_ZOOM, threeColumns, windowFor,
  type Point,
} from "../../clip/frame";
import { dragSteps, LAND, MOVE, navRow, press, scrollSteps, within } from "../../clip/script";

const COPY = {
  zh: {
    openNote: "读书笔记/注意力经济.md",
    folder: "读书笔记",
    tag: "神经科学",
    property: "状态",
    value: "已完成",
    dragFolder: "研究",
    /** The first folder under the root, so the dragged one lands at the top. */
    dropBefore: "厨房",
    notes: (count: number) => `${count} 篇笔记`,
    dragLabel: "拖动调整顺序",
  },
  en: {
    openNote: "Reading/The attention economy.md",
    folder: "Reading",
    tag: "neuroscience",
    property: "status",
    value: "done",
    dragFolder: "Research",
    dropBefore: "Attachments",
    notes: (count: number) => `${count} notes`,
    dragLabel: "Drag to reorder",
  },
}[LANG];

const ZOOM = THREE_COLUMN_ZOOM;
const WINDOW = windowFor(ZOOM);
const LAYOUT = threeColumns(WINDOW);
const ROWS = {
  folder: navRow(navigationFolderId(COPY.folder)),
  tag: navRow(navigationTagId(COPY.tag)),
  value: navRow(navigationPropertyValueId(COPY.property, { kind: "text", value: COPY.value })),
  drag: navRow(navigationFolderId(COPY.dragFolder)),
  dropBefore: navRow(navigationFolderId(COPY.dropBefore)),
};
const NAV_SCROLLER = ".fce-nav-pane-sections";
const label = (row: Target) => within(row, ".fce-tree-label");

/** Even beats: travel, land, click, and a read hold after each result. Motion starts at 0.4 (loop cross-fade). */
const T = (() => {
  const toFolder = 0.4;
  const clickFolder = toFolder + MOVE + LAND;
  // The tags and properties sit below the folders: scroll them up while the cursor travels.
  const scrollDown = clickFolder + 1.1;
  const clickTag = scrollDown + 0.15 + MOVE + LAND;
  const clickValue = clickTag + 1.2 + MOVE + LAND;
  const scrollUp = clickValue + 1.3;
  const toDrag = scrollUp + 0.2;
  const press = toDrag + MOVE + LAND;
  const drop = press + 1.05;
  return {
    toFolder, clickFolder, scrollDown, toTag: scrollDown + 0.15, clickTag, toValue: clickTag + 1.2, clickValue,
    scrollUp, toDrag, press, over: drop - 0.3, drop, end: drop + 1.3 + MOVE,
  };
})();
const SCROLL = 0.7;

const snapshot = (LANG === "zh" ? zhSnapshot : enSnapshot) as unknown as VaultSnapshot;
const settings = { ...snapshot.settings, workspace: { ...snapshot.settings.workspace, navPaneWidth: LAYOUT.navPaneWidth } };
applyThemeMeta(meta);
const dom = createClipDom(ZOOM);

function mountScene(): MountedScene {
  dom.stage.replaceChildren();
  // A folder reorder writes to the runtime state, so every replay starts from the snapshot.
  const vault = createDemoVault(snapshot, "/data/files/");
  const demo = new DemoHost(vault, settings, LANG, { expandedPropertyKeys: [COPY.property], selectedPath: COPY.openNote });
  const win = createMainWindow(dom.stage, {
    html: workspaceHtml, meta, size: WINDOW, titleText: snapshot.name, leftWidth: LAYOUT.leftWidth,
    vaultName: snapshot.name, lang: LANG, note: { vault, path: COPY.openNote },
  });
  const panel = mountPanel(win.host, demo);
  return { demo, host: win.frame, destroy: () => panel.destroy() };
}

const director = new Director(mountScene, [
  ...press(T.clickFolder, ROWS.folder),
  ...scrollSteps(NAV_SCROLLER, T.scrollDown, T.scrollDown + SCROLL, 0, "end"),
  ...press(T.clickTag, ROWS.tag),
  ...press(T.clickValue, ROWS.value),
  ...scrollSteps(NAV_SCROLLER, T.scrollUp, T.scrollUp + SCROLL, "end", 0),
  ...dragSteps({ start: T.press, over: T.over, drop: T.drop }, ROWS.drag, ROWS.dropBefore, { x: 0.3, y: 0.5 }, { x: 0.3, y: 0.15 }),
]);

/** Cursor tip just inside a row label, where a reader's eye lands. */
const onLabel = (box: Box): Point => ({ x: box.x + Math.min(box.width / 2, 48), y: box.y + box.height / 2 });

async function buildTimeline(): Promise<{ tl: gsap.core.Timeline }> {
  const m = (time: number, target: Target) => director.measureAsync(time, target, dom.camera);
  const count = (time: number) => director.readAsync(time, ({ demo }) => demo.model.getState().cards.records.length);
  const at = {
    folder: await m(T.toFolder, label(ROWS.folder)),
    tag: await m(T.toTag + SCROLL, label(ROWS.tag)),
    value: await m(T.toValue, label(ROWS.value)),
    drag: await m(T.toDrag + SCROLL, label(ROWS.drag)),
    dropBefore: await m(T.press, ROWS.dropBefore),
  };
  const counts = { folder: await count(T.clickFolder), tag: await count(T.clickTag), value: await count(T.clickValue) };
  await director.seekAsync(0);

  const tl = gsap.timeline({ paused: true });
  // Cursor: rests over the cards at the start and the end, so the loop closes.
  const rest: Point = { x: FRAME.width * 0.5, y: FRAME.height * 0.62 };
  tl.set(dom.cursor, { x: rest.x, y: rest.y, opacity: 1 }, 0);

  const pills = [
    callout(dom.callouts, { icon: "folder", label: COPY.folder, text: COPY.notes(counts.folder) }),
    callout(dom.callouts, { icon: "tag", label: `#${COPY.tag}`, text: COPY.notes(counts.tag) }),
    callout(dom.callouts, { icon: "list", label: `${COPY.property}${LANG === "zh" ? "：" : ": "}${COPY.value}`, text: COPY.notes(counts.value) }),
    callout(dom.callouts, { icon: "grip-vertical", text: COPY.dragLabel, className: "is-accent" }),
  ];
  const step = (index: number, from: number, to: Point, click: number) => {
    glide(tl, dom.cursor, to, from, MOVE);
    pulse(tl, dom, to, click - 0.05);
    if (index > 0) popOut(tl, pills[index - 1], click);
    popIn(tl, pills[index], click + 0.1);
  };
  step(0, T.toFolder, onLabel(at.folder), T.clickFolder);
  step(1, T.toTag, onLabel(at.tag), T.clickTag);
  step(2, T.toValue, onLabel(at.value), T.clickValue);

  const grab = onLabel(at.drag);
  const drop = { x: grab.x, y: at.dropBefore.y + at.dropBefore.height * 0.15 };
  glide(tl, dom.cursor, grab, T.toDrag, MOVE);
  popOut(tl, pills[2], T.press);
  popIn(tl, pills[3], T.press + 0.1);
  carry(tl, dom, dragGhost(dom, { icon: "folder", text: COPY.dragFolder }), grab, drop, { press: T.press, drop: T.drop });
  popOut(tl, pills[3], T.end - MOVE - 0.4);
  glide(tl, dom.cursor, rest, T.end - MOVE - 0.15, MOVE);
  tl.set({}, {}, T.end);
  return { tl };
}

await document.fonts.ready;
const { tl } = await buildTimeline();
registerClip(director, tl, T.end, dom);
