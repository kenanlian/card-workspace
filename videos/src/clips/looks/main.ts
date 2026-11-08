// Appearance: the settings tab's "Interface appearance" page switches the card
// style to the left accent bar; a card's menu gives it a blue background; a
// folder's menu opens the plugin's icon picker and a search sets its icon.
import gsap from "gsap";
import meta from "../../../theme/meta.json";
import workspaceHtml from "../../../theme/workspace.html?raw";
import zhSnapshot from "../../../data/vault.zh.json";
import enSnapshot from "../../../data/vault.en.json";
import { getUiStrings } from "@plugin/i18n";
import { settingTabStrings } from "@plugin/i18n/settingTab";
import { navigationFolderId } from "@plugin/view/navigation-model";
import { AppearanceDemoHost } from "../../stage/appearance-host";
import { createDemoVault, type VaultSnapshot } from "../../stage/demo-vault";
import { call, Director, type Box, type MountedScene, type SceneStep, type Target } from "../../stage/director";
import { applyThemeMeta, mountPanel } from "../../stage/obsidian-shell";
import { createSettingsWindow } from "../../stage/settings-window";
import { createMainWindow } from "../../stage/window-shell";
import {
  callout, center, createClipDom, FRAME, glide, LANG, popIn, popOut, pulse, registerClip, THREE_COLUMN_ZOOM, threeColumns, windowFor,
  type Point,
} from "../../clip/frame";
import { cardTitled, LAND, MOVE, navRow, resolve, typeSteps } from "../../clip/script";
import { renderSelectPopup, windowBox as boxIn } from "../../clip/os-window";

const ZOOM = THREE_COLUMN_ZOOM;
const WINDOW = windowFor(ZOOM);
const LAYOUT = threeColumns(WINDOW);
/** As in the images clip: Obsidian's settings layout sizes itself in `vw`, which CSS zoom does not scale. */
const SETTINGS = { left: 54, top: 70, width: 860, height: 600, scale: 1.55 };
const STYLE_KEY = "cardStyle";
const TARGET_STYLE = "accent-bar";
const COPY = {
  zh: { settings: "设置", openNote: "旅行/京都红叶季.md", card: "深度工作", folder: "旅行", search: "plane" },
  en: { settings: "Settings", openNote: "Travel/Kyoto in autumn.md", card: "Deep work", folder: "Travel", search: "plane" },
}[LANG];
const TYPE_RATE = 10;

/** Even beats: travel, land, click. Motion starts at 0.4 (loop cross-fade). */
const T = (() => {
  const toGear = 0.4;
  const clickGear = toGear + MOVE + LAND;
  const toPage = clickGear + 0.35;
  const clickPage = toPage + MOVE + LAND;
  const toSelect = clickPage + 0.3;
  const clickSelect = toSelect + MOVE + LAND;
  const toOption = clickSelect + 0.2;
  const clickOption = toOption + 0.45 + LAND;
  const toClose = clickOption + 0.45;
  const clickClose = toClose + MOVE + LAND;
  const toCard = clickClose + 0.35;
  const cardMenu = toCard + MOVE + LAND;
  const toColors = cardMenu + 0.25;
  const clickColors = toColors + 0.45 + LAND;
  const toBlue = clickColors + 0.2;
  const clickBlue = toBlue + 0.45 + LAND;
  const toFolder = clickBlue + 0.5;
  const folderMenu = toFolder + MOVE + LAND;
  const toChange = folderMenu + 0.25;
  const clickChange = toChange + 0.45 + LAND;
  const type = clickChange + 0.35;
  const toIcon = type + COPY.search.length / TYPE_RATE + 0.15;
  const clickIcon = toIcon + MOVE + LAND;
  return {
    toGear, clickGear, toPage, clickPage, toSelect, clickSelect, toOption, clickOption, toClose, clickClose,
    toCard, cardMenu, toColors, clickColors, toBlue, clickBlue, toFolder, folderMenu, toChange, clickChange, type, toIcon, clickIcon,
    end: clickIcon + 1.5,
  };
})();

const snapshot = (LANG === "zh" ? zhSnapshot : enSnapshot) as unknown as VaultSnapshot;
const settings = { ...snapshot.settings, workspace: { ...snapshot.settings.workspace, navPaneWidth: LAYOUT.navPaneWidth } };
const vault = createDemoVault(snapshot, "/data/files/");
const strings = getUiStrings(LANG);
applyThemeMeta(meta);
const dom = createClipDom(ZOOM);

function mountScene(): MountedScene {
  dom.stage.replaceChildren();
  const demo = new AppearanceDemoHost(vault, settings, LANG, { selectedPath: COPY.openNote });
  const win = createMainWindow(dom.stage, {
    html: workspaceHtml, meta, size: WINDOW, titleText: snapshot.name, leftWidth: LAYOUT.leftWidth,
    vaultName: snapshot.name, lang: LANG, note: { vault, path: COPY.openNote },
  });
  const panel = mountPanel(win.host, demo, demo.panelCallbacks());
  return { demo, host: win.frame, destroy: () => panel.destroy() };
}

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
const windowBox = (node: Element) => boxIn(settingsWindow, dom, node);

const ABOVE_FOOTER = { right: 48, bottom: 120 };
const GEAR = ".workspace-drawer-vault-actions .clickable-icon:last-child";
const CARD = cardTitled(COPY.card);
const FOLDER = navRow(navigationFolderId(COPY.folder));
const menuItem = (title: string, submenu = false): Target => (host) =>
  Array.from(host.querySelectorAll<HTMLElement>(`.demo-menu-layer > .menu${submenu ? ".demo-submenu" : ":not(.demo-submenu)"} .menu-item`))
    .find((item) => item.querySelector(".menu-item-title")?.textContent === title) ?? null;
const COLORS = menuItem(strings.cardBackground.title);
const BLUE = menuItem(strings.cardBackground.colors.blue, true);
const CHANGE_ICON = menuItem(strings.icons.change);
const PICKER = ".fce-icon-picker";
const SEARCH = ".fce-icon-picker-search";
const FIRST_ICON = '.fce-icon-picker button[data-index="0"]';

/** A right-click a third of the way into `target`, as the pointer would land. */
function contextMenu(at: number, target: Target): SceneStep {
  return call(at, ({ host }) => {
    const node = resolve(target, host);
    const box = node.getBoundingClientRect();
    node.dispatchEvent(new MouseEvent("contextmenu", {
      bubbles: true, cancelable: true, button: 2, clientX: box.left + Math.min(box.width * 0.35, 90), clientY: box.top + Math.min(box.height / 2, 24),
    }));
  });
}

/** Obsidian marks the hovered menu item `.selected`. */
function pick(at: number, target: Target): SceneStep[] {
  return [
    call(at - LAND, ({ host }) => resolve(target, host).classList.add("selected")),
    call(at, ({ host }) => resolve(target, host).click()),
  ];
}

/**
 * The picker positions itself in the body of an unzoomed document; the stage
 * is zoomed, so it moves into the frame's menu layer beside the folder row.
 */
function placePicker(host: HTMLElement): void {
  const picker = document.querySelector<HTMLElement>(PICKER);
  const layer = host.querySelector<HTMLElement>(".demo-menu-layer");
  if (!picker || !layer) return;
  if (picker.parentElement !== layer) layer.appendChild(picker);
  const base = layer.getBoundingClientRect();
  const scale = base.width / layer.offsetWidth;
  const row = resolve(FOLDER, host).getBoundingClientRect();
  const top = Math.min((row.top - base.top) / scale - 40, layer.offsetHeight - picker.offsetHeight - 12);
  Object.assign(picker.style, { position: "absolute", left: `${(row.right - base.left) / scale + 6}px`, top: `${Math.max(12, top)}px` });
}

const director = new Director(mountScene, [
  call(T.clickOption + 0.05, ({ demo }) => demo.setAppearance({ cardStyle: TARGET_STYLE })),
  contextMenu(T.cardMenu, CARD),
  ...pick(T.clickColors, COLORS),
  ...pick(T.clickBlue, BLUE),
  contextMenu(T.folderMenu, FOLDER),
  ...pick(T.clickChange, CHANGE_ICON),
  call(T.clickChange + 0.01, ({ host }) => placePicker(host)),
  // Filtering re-runs the picker's own placement.
  ...typeSteps(T.type, SEARCH, COPY.search, TYPE_RATE).flatMap((step) => [step, call(step.at, ({ host }) => placePicker(host))]),
  call(T.clickIcon - LAND, ({ host }) => resolve(FIRST_ICON, host).classList.add("demo-hover")),
  call(T.clickIcon, ({ host }) => resolve(FIRST_ICON, host).click()),
]);

const onLabel = (box: Box): Point => ({ x: box.x + Math.min(box.width / 2, 56), y: box.y + box.height / 2 });

async function buildTimeline(): Promise<{ tl: gsap.core.Timeline }> {
  const m = (time: number, target: Target) => director.measureAsync(time, target, dom.camera);
  const at = {
    gear: await m(0, GEAR),
    card: await m(T.toCard, CARD),
    colors: await m(T.toColors, COLORS),
    blue: await m(T.toBlue, BLUE),
    folder: await m(T.toFolder, FOLDER),
    change: await m(T.toChange, CHANGE_ICON),
    icon: await m(T.toIcon, FIRST_ICON),
  };
  await director.seekAsync(0);

  // Settings window: the Card Workspace tab's page list, then "Interface appearance".
  const { page, doc } = settingsWindow;
  page.navScroller.scrollTop = page.navScroller.scrollHeight;
  const select = page.dropdowns.get(STYLE_KEY)!;
  const subpage = page.pages.find((candidate) => candidate.page.contains(select))!;
  const pageRowBox = windowBox(subpage.row);
  page.landing.style.display = "none";
  subpage.page.style.display = "";
  const chosen = select.cloneNode(true) as HTMLSelectElement;
  chosen.value = TARGET_STYLE;
  chosen.style.display = "none";
  select.after(chosen);
  const { popup, rows } = renderSelectPopup(select);
  const startIndex = select.selectedIndex;
  const targetIndex = Array.from(select.options).findIndex((option) => option.value === TARGET_STYLE);
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

  const styleName = settingTabStrings[LANG].cardStyleName;
  const before = callout(dom.callouts, { icon: "layout-template", label: styleName, text: labels.from }, ABOVE_FOOTER);
  const after = callout(dom.callouts, { icon: "layout-template", label: styleName, text: labels.to, className: "is-accent" }, ABOVE_FOOTER);
  popIn(tl, before, T.toGear);

  // Settings: gear, the appearance page, the card style dropdown, close.
  glide(tl, dom.cursor, center(at.gear), T.toGear, MOVE);
  pulse(tl, dom, center(at.gear), T.clickGear - 0.05);
  tl.fromTo(slot, { autoAlpha: 0, scale: SETTINGS.scale * 0.95 },
    { autoAlpha: 1, scale: SETTINGS.scale, duration: 0.28, ease: "power2.out", immediateRender: false }, T.clickGear + 0.05);
  const pagePoint = { x: pageRowBox.x + pageRowBox.width * 0.3, y: center(pageRowBox).y };
  glide(tl, dom.cursor, pagePoint, T.toPage, MOVE);
  tl.set(subpage.row, { attr: { class: "setting-item mod-navigable demo-hover" } }, T.clickPage - LAND);
  pulse(tl, dom, pagePoint, T.clickPage - 0.05);
  tl.set(page.landing, { display: "none" }, T.clickPage + 0.05);
  tl.set(subpage.page, { display: "" }, T.clickPage + 0.05);

  const selectPoint = { x: selectBox.x + selectBox.width * 0.4, y: center(selectBox).y };
  glide(tl, dom.cursor, selectPoint, T.toSelect, MOVE);
  tl.set(select, { attr: { class: "dropdown demo-hover" } }, T.clickSelect - LAND);
  pulse(tl, dom, selectPoint, T.clickSelect - 0.05);
  const highlight = (index: number, time: number) => rows.forEach((node, rowIndex) =>
    tl.set(node, { backgroundColor: rowIndex === index ? "#0060df" : "#fff", color: rowIndex === index ? "#fff" : "#000" }, time));
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

  const closePoint = center(closeBox);
  glide(tl, dom.cursor, closePoint, T.toClose, MOVE);
  tl.set(closeButton, { attr: { class: "titlebar-button mod-close demo-hover" } }, T.clickClose - LAND);
  pulse(tl, dom, closePoint, T.clickClose - 0.05);
  tl.to(slot, { autoAlpha: 0, scale: SETTINGS.scale * 0.97, duration: 0.18, ease: "power2.in" }, T.clickClose + 0.05);
  popOut(tl, after, T.toCard + 0.3);

  // A card's menu: Background color → Blue.
  const cardPoint = { x: at.card.x + Math.min(at.card.width * 0.35, 90 * ZOOM), y: at.card.y + Math.min(at.card.height / 2, 24 * ZOOM) };
  glide(tl, dom.cursor, cardPoint, T.toCard, MOVE);
  pulse(tl, dom, cardPoint, T.cardMenu - 0.05);
  glide(tl, dom.cursor, onLabel(at.colors), T.toColors, 0.45);
  pulse(tl, dom, onLabel(at.colors), T.clickColors - 0.05);
  glide(tl, dom.cursor, onLabel(at.blue), T.toBlue, 0.45);
  pulse(tl, dom, onLabel(at.blue), T.clickBlue - 0.05);
  const colored = callout(dom.callouts, { icon: "palette", label: strings.cardBackground.title, text: strings.cardBackground.colors.blue, className: "is-accent" }, ABOVE_FOOTER);
  popIn(tl, colored, T.clickBlue + 0.1);
  popOut(tl, colored, T.folderMenu);

  // A folder's menu: Change icon → search → the first match.
  const folderPoint = onLabel(at.folder);
  glide(tl, dom.cursor, folderPoint, T.toFolder, MOVE);
  pulse(tl, dom, folderPoint, T.folderMenu - 0.05);
  glide(tl, dom.cursor, onLabel(at.change), T.toChange, 0.45);
  pulse(tl, dom, onLabel(at.change), T.clickChange - 0.05);
  glide(tl, dom.cursor, center(at.icon), T.toIcon, MOVE);
  pulse(tl, dom, center(at.icon), T.clickIcon - 0.05);
  const iconed = callout(dom.callouts, { icon: "smile-plus", label: strings.icons.change, text: COPY.folder, className: "is-accent" }, ABOVE_FOOTER);
  popIn(tl, iconed, T.clickIcon + 0.1);
  popOut(tl, iconed, T.end - 0.7);
  glide(tl, dom.cursor, rest, T.end - MOVE - 0.1, MOVE);
  tl.set({}, {}, T.end);
  return { tl };
}

await Promise.all([document.fonts.ready, settingsWindow.ready]);
const { tl } = await buildTimeline();
registerClip(director, tl, T.end, dom);
