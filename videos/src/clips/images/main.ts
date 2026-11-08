// Card images: cards show the note's first local image as a right thumbnail;
// on the settings tab's "Cards and previews" page, "Card images" switches to
// the inline layout, and the stream re-lays out with the photos under each title.
import gsap from "gsap";
import meta from "../../../theme/meta.json";
import workspaceHtml from "../../../theme/workspace.html?raw";
import zhSnapshot from "../../../data/vault.zh.json";
import enSnapshot from "../../../data/vault.en.json";
import { DemoHost } from "../../stage/demo-host";
import { createDemoVault, type VaultSnapshot } from "../../stage/demo-vault";
import { call, Director, type MountedScene } from "../../stage/director";
import { applyThemeMeta, mountPanel } from "../../stage/obsidian-shell";
import { createSettingsWindow } from "../../stage/settings-window";
import { createMainWindow } from "../../stage/window-shell";
import {
  callout, center, createClipDom, FRAME, glide, LANG, popIn, popOut, pulse, registerClip, THREE_COLUMN_ZOOM, threeColumns, windowFor,
  type Point,
} from "../../clip/frame";
import { LAND, MOVE, scrollSteps } from "../../clip/script";
import { renderSelectPopup, windowBox as boxIn } from "../../clip/os-window";

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
  const toPage = clickGear + 0.4;
  const clickPage = toPage + MOVE + LAND;
  const toSelect = clickPage + 0.35;
  const clickSelect = toSelect + MOVE + LAND;
  const toOption = clickSelect + 0.25;
  const clickOption = toOption + 0.45 + LAND;
  const toClose = clickOption + 0.5;
  const clickClose = toClose + MOVE + LAND;
  const scroll = clickClose + 0.55;
  const scrollBack = scroll + 2.2 + 1.0;
  return {
    toGear, clickGear, toPage, clickPage, toSelect, clickSelect, toOption, clickOption, toClose, clickClose,
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

const windowBox = (node: Element) => boxIn(settingsWindow, dom, node);

async function buildTimeline(): Promise<{ tl: gsap.core.Timeline }> {
  const gear = await director.measureAsync(0, GEAR, dom.camera);
  const list = await director.measureAsync(0, LIST, dom.camera);
  await director.seekAsync(0);

  // Settings window: the Card Workspace tab's page list, then the page holding the image rows.
  const { page, doc } = settingsWindow;
  page.navScroller.scrollTop = page.navScroller.scrollHeight;
  const select = page.dropdowns.get(MODE_KEY)!;
  const subpage = page.pages.find((candidate) => candidate.page.contains(select))!;
  const pageRowBox = windowBox(subpage.row);
  page.landing.style.display = "none";
  subpage.page.style.display = "";
  const row = select.closest<HTMLElement>(".setting-item")!;
  const content = subpage.page;
  content.scrollTop = Math.max(0, row.getBoundingClientRect().top - content.getBoundingClientRect().top + content.scrollTop - 250);
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
  page.landing.style.display = "";
  subpage.page.style.display = "none";

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

  // Open the page with the card image rows.
  const pagePoint = { x: pageRowBox.x + pageRowBox.width * 0.3, y: center(pageRowBox).y };
  glide(tl, dom.cursor, pagePoint, T.toPage, MOVE);
  tl.set(subpage.row, { attr: { class: "setting-item mod-navigable demo-hover" } }, T.clickPage - LAND);
  pulse(tl, dom, pagePoint, T.clickPage - 0.05);
  tl.set(page.landing, { display: "none" }, T.clickPage + 0.05);
  tl.set(subpage.page, { display: "" }, T.clickPage + 0.05);

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
