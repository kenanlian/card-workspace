// Card boxes: a tag view saved as a box through the plugin's own dialog, which
// previews how many notes match; inside the box, the cards get the box's own
// grouping, by folder.
import gsap from "gsap";
import meta from "../../../theme/meta.json";
import workspaceHtml from "../../../theme/workspace.html?raw";
import zhSnapshot from "../../../data/vault.zh.json";
import enSnapshot from "../../../data/vault.en.json";
import { getUiStrings } from "@plugin/i18n";
import { navigationTagId } from "@plugin/view/navigation-model";
import { BoxDemoHost } from "../../stage/box-host";
import { createDemoVault, type VaultSnapshot } from "../../stage/demo-vault";
import { call, Director, type Box, type MountedScene, type SceneStep, type Target } from "../../stage/director";
import { applyThemeMeta, mountPanel } from "../../stage/obsidian-shell";
import { createMainWindow } from "../../stage/window-shell";
import {
  callout, center, createClipDom, FRAME, glide, LANG, popIn, popOut, pulse, registerClip, THREE_COLUMN_ZOOM, threeColumns, windowFor,
  type Point,
} from "../../clip/frame";
import { hoverOff, hoverOn, LAND, MOVE, navRow, press, resolve, typeSteps, within } from "../../clip/script";

const COPY = {
  zh: {
    openNote: "读书笔记/深度工作.md",
    tag: "神经科学",
    name: "专注研究",
    notes: (count: number) => `${count} 篇笔记`,
    saved: (count: number) => `${count} 张卡片`,
    arranged: "每个盒子有自己的分组和排序",
  },
  en: {
    openNote: "Reading/Deep work.md",
    tag: "neuroscience",
    name: "Focus research",
    notes: (count: number) => `${count} notes`,
    saved: (count: number) => `${count} cards`,
    arranged: "Each box keeps its own grouping and sort",
  },
}[LANG];

const ZOOM = THREE_COLUMN_ZOOM;
const WINDOW = windowFor(ZOOM);
const LAYOUT = threeColumns(WINDOW);
const TYPE_RATE = LANG === "zh" ? 6 : 20;

const T = (() => {
  const toSave = 0.4 + 0.9;
  const clickSave = toSave + MOVE + LAND;
  const type = clickSave + 0.55;
  const toCreate = type + COPY.name.length / TYPE_RATE + 0.25;
  const clickCreate = toCreate + MOVE + LAND;
  const toSort = clickCreate + 1.4;
  const clickSort = toSort + MOVE + LAND;
  const toFolder = clickSort + 0.45;
  const clickFolder = toFolder + MOVE + LAND;
  return { toSave, clickSave, type, toCreate, clickCreate, toSort, clickSort, toFolder, clickFolder, end: clickFolder + 2 + MOVE + 0.1 };
})();

const snapshot = (LANG === "zh" ? zhSnapshot : enSnapshot) as unknown as VaultSnapshot;
const vault = createDemoVault(snapshot, "/data/files/");
const strings = getUiStrings(LANG);
applyThemeMeta(meta);
const dom = createClipDom(ZOOM);

/** Box writes land in the settings object, so every mount starts from a fresh copy. */
function mountScene(): MountedScene {
  dom.stage.replaceChildren();
  const settings = structuredClone(snapshot.settings);
  settings.workspace.navPaneWidth = LAYOUT.navPaneWidth;
  settings.workspace.sectionCollapsed = { ...settings.workspace.sectionCollapsed, folders: true, tags: false, properties: true, boxes: false, links: true };
  const demo = new BoxDemoHost(vault, settings, LANG, { selectedPath: COPY.openNote });
  const win = createMainWindow(dom.stage, {
    html: workspaceHtml, meta, size: WINDOW, titleText: snapshot.name, leftWidth: LAYOUT.leftWidth,
    vaultName: snapshot.name, lang: LANG, note: { vault, path: COPY.openNote },
  });
  const panel = mountPanel(win.host, demo, demo.panelCallbacks());
  return { demo, host: win.frame, destroy: () => panel.destroy() };
}

const TAG = navRow(navigationTagId(COPY.tag));
const toolbarButton = (icon: string): Target => (host) =>
  host.querySelector(`.fce-toolbar svg.lucide-${icon}`)?.closest<HTMLElement>("button") ?? null;
const SAVE = toolbarButton("package-plus");
const SORT = ".fce-sort-trigger";
const INPUT = ".demo-modal-layer input[type=text]";
const CREATE: Target = (host) => Array.from(host.querySelectorAll<HTMLElement>(".demo-modal-layer button"))
  .find((button) => button.textContent?.trim() === strings.box.create) ?? null;
const GROUP_BY_FOLDER: Target = (host) => Array.from(host.querySelectorAll<HTMLElement>(".demo-menu-layer .menu-item"))
  .find((item) => item.querySelector(".menu-item-title")?.textContent === strings.sortGroup.dimensionFolder) ?? null;
const BOX_ROW: Target = (host) => Array.from(host.querySelectorAll<HTMLElement>('[data-nav-row-id^="box:"]'))
  .find((row) => row.querySelector(".fce-tree-label")?.textContent?.trim() === COPY.name) ?? null;

/** Obsidian marks the hovered menu item `.selected`. */
function pick(at: number, target: Target): SceneStep[] {
  return [
    call(at - LAND, ({ host }) => resolve(target, host).classList.add("selected")),
    call(at, ({ host }) => resolve(target, host).click()),
  ];
}

const director = new Director(mountScene, [
  // The clip opens on the tag view it saves.
  call(0, ({ host }) => resolve(TAG, host).click()),
  ...press(T.clickSave, SAVE),
  call(T.type - 0.01, ({ host }) => {
    const input = resolve(INPUT, host) as HTMLInputElement;
    input.value = "";
    input.dispatchEvent(new Event("input", { bubbles: true }));
  }),
  ...typeSteps(T.type, INPUT, COPY.name, TYPE_RATE),
  hoverOn(T.clickCreate - LAND, CREATE),
  call(T.clickCreate, ({ host }) => resolve(CREATE, host).click()),
  ...press(T.clickSort, SORT),
  hoverOff(T.toFolder),
  ...pick(T.clickFolder, GROUP_BY_FOLDER),
]);

const onLabel = (box: Box): Point => ({ x: box.x + Math.min(box.width / 2, 48), y: box.y + box.height / 2 });

async function buildTimeline(): Promise<{ tl: gsap.core.Timeline }> {
  const m = (time: number, target: Target) => director.measureAsync(time, target, dom.camera);
  const count = (time: number) => director.readAsync(time, ({ demo }) => demo.model.getState().cards.records.length);
  const at = {
    save: await m(T.toSave, SAVE),
    input: await m(T.type, INPUT),
    create: await m(T.toCreate, CREATE),
    box: await m(T.clickCreate + 0.1, within(BOX_ROW, ".fce-tree-label")),
    sort: await m(T.toSort, SORT),
    folder: await m(T.toFolder, GROUP_BY_FOLDER),
  };
  const counts = { tag: await count(0.1), box: await count(T.clickCreate + 0.1) };
  await director.seekAsync(0);

  const tl = gsap.timeline({ paused: true });
  const rest: Point = { x: FRAME.width * 0.5, y: FRAME.height * 0.62 };
  tl.set(dom.cursor, { x: rest.x, y: rest.y, opacity: 1 }, 0);

  const view = callout(dom.callouts, { icon: "tag", label: `#${COPY.tag}`, text: COPY.notes(counts.tag) });
  popIn(tl, view, 0.4);

  glide(tl, dom.cursor, center(at.save), T.toSave, MOVE);
  pulse(tl, dom, center(at.save), T.clickSave - 0.05);
  popOut(tl, view, T.clickSave);
  glide(tl, dom.cursor, { x: at.input.x + at.input.width * 0.8, y: center(at.input).y + 46 }, T.clickSave + 0.1, 0.45);

  glide(tl, dom.cursor, center(at.create), T.toCreate, MOVE);
  pulse(tl, dom, center(at.create), T.clickCreate - 0.05);
  const saved = callout(dom.callouts, { icon: "package", label: COPY.name, text: COPY.saved(counts.box) });
  popIn(tl, saved, T.clickCreate + 0.15);
  glide(tl, dom.cursor, onLabel(at.box), T.clickCreate + 0.2, MOVE);

  glide(tl, dom.cursor, center(at.sort), T.toSort, MOVE);
  pulse(tl, dom, center(at.sort), T.clickSort - 0.05);
  const folderPoint = onLabel(at.folder);
  glide(tl, dom.cursor, folderPoint, T.toFolder, MOVE);
  pulse(tl, dom, folderPoint, T.clickFolder - 0.05);
  const arranged = callout(dom.callouts, { icon: "list-tree", text: COPY.arranged, className: "is-accent" });
  popOut(tl, saved, T.clickFolder);
  popIn(tl, arranged, T.clickFolder + 0.15);

  popOut(tl, arranged, T.end - MOVE - 0.3);
  glide(tl, dom.cursor, rest, T.end - MOVE - 0.1, MOVE);
  tl.set({}, {}, T.end);
  return { tl };
}

await document.fonts.ready;
const { tl } = await buildTimeline();
registerClip(director, tl, T.end, dom);
