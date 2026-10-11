// Card images: cards show the note's first local image as a right thumbnail;
// in the plugin's settings tab, "Card images" switches to the inline layout,
// and the stream re-lays out with the photos under each title.
import gsap from "gsap";
import meta from "../../../theme/meta.json";
import workspaceHtml from "../../../theme/workspace.html?raw";
import zhSnapshot from "../../../data/vault.zh.json";
import enSnapshot from "../../../data/vault.en.json";
import { DemoHost } from "../../stage/demo-host";
import { createDemoVault, type VaultSnapshot } from "../../stage/demo-vault";
import { call, Director, type Box, type MountedScene } from "../../stage/director";
import { applyThemeMeta, mountPanel } from "../../stage/obsidian-shell";
import { createSettingsWindow } from "../../stage/settings-window";
import { createMainWindow } from "../../stage/window-shell";
import {
  callout, center, createClipDom, FRAME, glide, LANG, popIn, popOut, pulse, registerClip, THREE_COLUMN_ZOOM, threeColumns, windowFor,
  type Point,
} from "../../clip/frame";
import { LAND, MOVE, scrollSteps } from "../../clip/script";

const ZOOM = THREE_COLUMN_ZOOM;
const WINDOW = windowFor(ZOOM);
const LAYOUT = threeColumns(WINDOW);
/**
 * The settings window at its own CSS size, placed in frame px and scaled up as a
 * whole: Obsidian's settings layout sizes itself in `vw`, which CSS zoom does not scale.
 */
const SETTINGS = { left: 54, top: 70, width: 860, height: 600, scale: 1.55 };
const MODE_KEY = "cardImageMode";
const TARGET_MODE = "inline";
const COPY = {
  zh: { label: "卡片图片", settings: "设置", openNote: "旅行/京都红叶季.md" },
  en: { label: "Card images", settings: "Settings", openNote: "Travel/Kyoto in autumn.md" },
}[LANG];

/** Even beats: travel, land, click. Motion starts at 0.4 (loop cross-fade). */
const T = (() => {
  const toGear = 0.4;
  const clickGear = toGear + MOVE + LAND;
  const toSelect = clickGear + 0.4;
  const clickSelect = toSelect + MOVE + LAND;
  const toOption = clickSelect + 0.25;
  const clickOption = toOption + 0.45 + LAND;
  const toClose = clickOption + 0.5;
  const clickClose = toClose + MOVE + LAND;
  const scroll = clickClose + 0.55;
  const scrollBack = scroll + 2.2 + 1.0;
  return {
    toGear, clickGear, toSelect, clickSelect, toOption, clickOption, toClose, clickClose,
    scroll, scrollBack, end: scrollBack + 1.6 + 0.3,
  };
})();
const SCROLL = { duration: 2.2, back: 1.4, to: 1150 };

const snapshot = (LANG === "zh" ? zhSnapshot : enSnapshot) as unknown as VaultSnapshot;
const settings = { ...snapshot.settings, workspace: { ...snapshot.settings.workspace, navPaneWidth: LAYOUT.navPaneWidth } };
const vault = createDemoVault(snapshot, "/data/files/");
applyThemeMeta(meta);
const dom = createClipDom(ZOOM);

function mountScene(): MountedScene {
  dom.stage.replaceChildren();
  const demo = new DemoHost(vault, settings, LANG, { selectedPath: COPY.openNote });
  const win = createMainWindow(dom.stage, {
    html: workspaceHtml, meta, size: WINDOW, titleText: snapshot.name, leftWidth: LAYOUT.leftWidth,
    vaultName: snapshot.name, lang: LANG, note: { vault, path: COPY.openNote },
  });
  const panel = mountPanel(win.host, demo);
  return { demo, host: win.frame, destroy: () => panel.destroy() };
}

// The settings window is its own document, outside the zoomed stage.
const slot = document.createElement("div");
slot.className = "clip-os-window";
Object.assign(slot.style, {
  left: `${SETTINGS.left}px`, top: `${SETTINGS.top}px`, width: `${SETTINGS.width}px`, height: `${SETTINGS.height}px`,
  transformOrigin: "0 0", transform: `scale(${SETTINGS.scale})`,
});
dom.stage.after(slot);
const settingsWindow = createSettingsWindow(slot, {
  meta, size: SETTINGS, data: snapshot.settings, language: LANG,
  title: `${COPY.settings} - ${snapshot.name} - Obsidian 1.13.7`,
});

/** Clear of the sidebar footer, where the gear the cursor clicks lives. */
const ABOVE_FOOTER = { right: 48, bottom: 120 };
const GEAR = ".workspace-drawer-vault-actions .clickable-icon:last-child";
const LIST = ".fce-list";

const director = new Director(mountScene, [
  // The settings tab saves the new value; the open view republishes its appearance.
  call(T.clickOption + 0.05, ({ demo }) => demo.setImageAppearance({ cardImageMode: TARGET_MODE })),
  ...scrollSteps(LIST, T.scroll, T.scroll + SCROLL.duration, 0, SCROLL.to),
  ...scrollSteps(LIST, T.scrollBack, T.scrollBack + SCROLL.back, SCROLL.to, 0),
]);

/** Box of an element inside the settings window, in frame px. */
function windowBox(node: Element): Box {
  const outer = settingsWindow.iframe.getBoundingClientRect();
  const base = dom.camera.getBoundingClientRect();
  const scale = outer.width / settingsWindow.doc.documentElement.clientWidth;
  const rect = node.getBoundingClientRect();
  return { x: outer.left - base.left + rect.left * scale, y: outer.top - base.top + rect.top * scale, width: rect.width * scale, height: rect.height * scale };
}

/** Chromium on Windows draws a native select's list as a plain box under the control. */
function renderSelectPopup(select: HTMLSelectElement): { popup: HTMLElement; rows: HTMLElement[] } {
  const doc = select.ownerDocument;
  const rect = select.getBoundingClientRect();
  const style = getComputedStyle(select);
  const popup = doc.createElement("div");
  const rowHeight = Math.round(rect.height * 0.84);
  Object.assign(popup.style, {
    position: "absolute", left: `${rect.left}px`, top: `${rect.bottom + 1}px`, minWidth: `${rect.width}px`,
    boxSizing: "border-box", border: "1px solid #a0a0a0", background: "#fff", boxShadow: "0 2px 6px rgb(0 0 0 / 0.18)",
    fontFamily: style.fontFamily, fontSize: style.fontSize, color: "#000", visibility: "hidden", zIndex: "100",
  });
  const rows = Array.from(select.options, (option) => {
    const row = doc.createElement("div");
    row.textContent = option.textContent;
    Object.assign(row.style, { height: `${rowHeight}px`, lineHeight: `${rowHeight}px`, padding: `0 12px 0 ${style.paddingLeft}`, whiteSpace: "nowrap" });
    popup.append(row);
    return row;
  });
  doc.body.append(popup);
  return { popup, rows };
}

async function buildTimeline(): Promise<{ tl: gsap.core.Timeline }> {
  const gear = await director.measureAsync(0, GEAR, dom.camera);
  const list = await director.measureAsync(0, LIST, dom.camera);
  await director.seekAsync(0);

  // Settings window: the Card Workspace tab, scrolled to the image rows.
  const { page, doc } = settingsWindow;
  page.navScroller.scrollTop = page.navScroller.scrollHeight;
  const select = page.dropdowns.get(MODE_KEY)!;
  const content = doc.querySelector<HTMLElement>(".vertical-tab-content")!;
  const row = select.closest<HTMLElement>(".setting-item")!;
  content.scrollTop = row.getBoundingClientRect().top - content.getBoundingClientRect().top + content.scrollTop - 150;
  const chosen = select.cloneNode(true) as HTMLSelectElement;
  chosen.value = TARGET_MODE;
  chosen.style.display = "none";
  select.after(chosen);
  const { popup, rows } = renderSelectPopup(select);
  const startIndex = select.selectedIndex;
  const targetIndex = Array.from(select.options).findIndex((option) => option.value === TARGET_MODE);
  const closeButton = doc.querySelector<HTMLElement>(".titlebar-button.mod-close")!;
  const selectBox = windowBox(select);
  const optionBox = windowBox(rows[targetIndex]);
  const closeBox = windowBox(closeButton);
  const labels = { from: select.selectedOptions[0].textContent!, to: chosen.selectedOptions[0].textContent! };

  const tl = gsap.timeline({ paused: true });
  const rest: Point = { x: FRAME.width * 0.5, y: FRAME.height * 0.6 };
  tl.set(dom.cursor, { x: rest.x, y: rest.y, opacity: 1 }, 0);
  tl.set(slot, { autoAlpha: 0 }, 0);

  const before = callout(dom.callouts, { icon: "image", label: COPY.label, text: labels.from }, ABOVE_FOOTER);
  const after = callout(dom.callouts, { icon: "image", label: COPY.label, text: labels.to, className: "is-accent" }, ABOVE_FOOTER);
  popIn(tl, before, T.toGear);

  // Open settings from the sidebar's gear.
  glide(tl, dom.cursor, center(gear), T.toGear, MOVE);
  pulse(tl, dom, center(gear), T.clickGear - 0.05);
  tl.fromTo(slot, { autoAlpha: 0, scale: SETTINGS.scale * 0.95 },
    { autoAlpha: 1, scale: SETTINGS.scale, duration: 0.28, ease: "power2.out", immediateRender: false }, T.clickGear + 0.05);

  // Open the dropdown and pick the inline layout; the panel re-lays out behind the window.
  const selectPoint = { x: selectBox.x + selectBox.width * 0.4, y: center(selectBox).y };
  glide(tl, dom.cursor, selectPoint, T.toSelect, MOVE);
  tl.set(select, { attr: { class: "dropdown demo-hover" } }, T.clickSelect - LAND);
  pulse(tl, dom, selectPoint, T.clickSelect - 0.05);
  const highlight = (index: number, at: number) => rows.forEach((node, rowIndex) =>
    tl.set(node, { backgroundColor: rowIndex === index ? "#0060df" : "#fff", color: rowIndex === index ? "#fff" : "#000" }, at));
  tl.set(popup, { visibility: "visible" }, T.clickSelect + 0.05);
  highlight(startIndex, T.clickSelect + 0.05);
  const optionPoint = { x: selectPoint.x, y: center(optionBox).y };
  glide(tl, dom.cursor, optionPoint, T.toOption, 0.45);
  highlight(targetIndex, T.toOption + 0.3);
  pulse(tl, dom, optionPoint, T.clickOption - 0.05);
  tl.set(popup, { visibility: "hidden" }, T.clickOption + 0.05);
  tl.set(select, { display: "none" }, T.clickOption + 0.05);
  tl.set(chosen, { display: "" }, T.clickOption + 0.05);
  popOut(tl, before, T.clickOption + 0.05);
  popIn(tl, after, T.clickOption + 0.3);

  // Close the window: the stream now carries the photos under each title.
  const closePoint = center(closeBox);
  glide(tl, dom.cursor, closePoint, T.toClose, MOVE);
  tl.set(closeButton, { attr: { class: "titlebar-button mod-close demo-hover" } }, T.clickClose - LAND);
  pulse(tl, dom, closePoint, T.clickClose - 0.05);
  tl.to(slot, { autoAlpha: 0, scale: SETTINGS.scale * 0.97, duration: 0.18, ease: "power2.in" }, T.clickClose + 0.05);
  const listPoint = { x: list.x + list.width * 0.72, y: list.y + list.height * 0.55 };
  glide(tl, dom.cursor, listPoint, T.clickClose + 0.2, MOVE);
  tl.to(dom.cursor, { y: `+=${30}`, duration: SCROLL.duration, ease: "sine.inOut" }, T.scroll);
  tl.to(dom.cursor, { y: `-=${30}`, duration: SCROLL.back, ease: "sine.inOut" }, T.scrollBack);
  popOut(tl, after, T.end - 0.7);
  glide(tl, dom.cursor, rest, T.end - MOVE - 0.1, MOVE);
  tl.set({}, {}, T.end);
  return { tl };
}

await Promise.all([document.fonts.ready, settingsWindow.ready]);
const { tl } = await buildTimeline();
registerClip(director, tl, T.end, dom);
