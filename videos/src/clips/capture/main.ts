// Capture: the navigation header's quick input button opens a floating draft
// window; a title and a one-line idea are typed, "Add tags" adds a tag, and
// Ctrl+Enter sends it. The new note is created in the vault root and its card
// arrives at the top of the stream.
import gsap from "gsap";
import meta from "../../../theme/meta.json";
import workspaceHtml from "../../../theme/workspace.html?raw";
import zhSnapshot from "../../../data/vault.zh.json";
import enSnapshot from "../../../data/vault.en.json";
import { getUiStrings } from "@plugin/i18n";
import { DemoHost } from "../../stage/demo-host";
import { createDemoVault, type VaultSnapshot } from "../../stage/demo-vault";
import { call, Director, type MountedScene, type SceneStep, type Target } from "../../stage/director";
import { applyThemeMeta, mountPanel } from "../../stage/obsidian-shell";
import { createQuickInputWindow, type QuickInputDraft } from "../../stage/quick-input-window";
import { createMainWindow } from "../../stage/window-shell";
import {
  callout, center, createClipDom, FRAME, glide, LANG, MARGIN, popIn, popOut, pulse, registerClip, THREE_COLUMN_ZOOM, threeColumns, windowFor,
  type Point,
} from "../../clip/frame";
import { cardTitled, LAND, MOVE, press } from "../../clip/script";
import { windowBox as boxIn } from "../../clip/os-window";

const COPY = {
  zh: {
    openNote: "读书笔记/深度工作.md",
    title: "批量处理通知",
    body: "每天集中看两次消息，而不是每十分钟看一次。",
    tag: "想法",
    rates: { title: 6, body: 10, tag: 4 },
    properties: "笔记属性", addProperty: "添加笔记属性",
    defaultTitle: "quick-note 2026-11-08 09-41-27",
    send: "发送", arrived: "新卡片出现在卡片流顶部",
  },
  en: {
    openNote: "Reading/Deep work.md",
    title: "Batch notifications",
    body: "Check messages twice a day, not every ten minutes.",
    tag: "idea",
    rates: { title: 14, body: 26, tag: 8 },
    properties: "Properties", addProperty: "Add property",
    defaultTitle: "quick-note 2026-11-08 09-41-27",
    send: "Send", arrived: "The new card leads the stream",
  },
}[LANG];

const ZOOM = THREE_COLUMN_ZOOM;
const WINDOW = windowFor(ZOOM);
const LAYOUT = threeColumns(WINDOW);
/** The quick input window at its own CSS size, scaled like the settings window in the images clip. */
const QUICK = { left: 770, top: 170, width: 440, height: 340, scale: 1.45 };

const T = (() => {
  const toOpen = 0.4;
  const clickOpen = toOpen + MOVE + LAND;
  const title = clickOpen + 0.45;
  const enter = title + COPY.title.length / COPY.rates.title + 0.25;
  const body = enter + 0.1;
  const toTags = body + COPY.body.length / COPY.rates.body + 0.2;
  const clickTags = toTags + MOVE + LAND;
  const tag = clickTags + 0.3;
  const pill = tag + COPY.tag.length / COPY.rates.tag + 0.15;
  const keys = pill + 0.35;
  const send = keys + 0.6;
  return { toOpen, clickOpen, title, enter, body, toTags, clickTags, tag, pill, keys, send, end: send + 2.4 };
})();

const snapshot = (LANG === "zh" ? zhSnapshot : enSnapshot) as unknown as VaultSnapshot;
const settings = { ...snapshot.settings, workspace: { ...snapshot.settings.workspace, navPaneWidth: LAYOUT.navPaneWidth } };
const strings = getUiStrings(LANG);
applyThemeMeta(meta);
const dom = createClipDom(ZOOM);

const slot = document.createElement("div");
slot.className = "clip-floating-window";
Object.assign(slot.style, {
  left: `${QUICK.left}px`, top: `${QUICK.top}px`, width: `${QUICK.width}px`, height: `${QUICK.height}px`,
  transformOrigin: "0 0", transform: `scale(${QUICK.scale})`,
});
dom.stage.after(slot);
// The window's text never reads the vault; the scene's own vault is created per mount.
const quick = createQuickInputWindow(slot, {
  meta, size: QUICK, strings, vault: createDemoVault(snapshot, "/data/files/"), tint: "purple",
  defaultTitle: COPY.defaultTitle, propertiesLabel: COPY.properties, addPropertyLabel: COPY.addProperty,
});

let sceneVault = createDemoVault(snapshot, "/data/files/");
/** Sending creates a note, so every mount starts from a fresh vault and an empty draft. */
function mountScene(): MountedScene {
  dom.stage.replaceChildren();
  quick.reset();
  const vault = createDemoVault(snapshot, "/data/files/");
  const demo = new DemoHost(vault, settings, LANG, { selectedPath: COPY.openNote });
  vault.onCreate(() => demo.reindex());
  const win = createMainWindow(dom.stage, {
    html: workspaceHtml, meta, size: WINDOW, titleText: snapshot.name, leftWidth: LAYOUT.leftWidth,
    vaultName: snapshot.name, lang: LANG, note: { vault, path: COPY.openNote },
  });
  const panel = mountPanel(win.host, demo);
  sceneVault = vault;
  return { demo, host: win.frame, destroy: () => panel.destroy() };
}

const OPEN = ".fce-nav-quick-input";
const NEW_CARD = cardTitled(COPY.title);

/** One draft update per character, at a keyboard's pace. */
function typeInto(at: number, field: "title" | "body" | "tagDraft", text: string, rate: number): SceneStep[] {
  return [...text].map((_, index) => call(at + index / rate, () => quick.set({ [field]: text.slice(0, index + 1) } as Partial<QuickInputDraft>)));
}

const director = new Director(mountScene, [
  ...press(T.clickOpen, OPEN),
  call(T.title - 0.05, () => quick.set({ caret: null })),
  ...typeInto(T.title, "title", COPY.title, COPY.rates.title),
  call(T.enter, () => quick.set({ caret: "body" })),
  ...typeInto(T.body, "body", COPY.body, COPY.rates.body),
  call(T.clickTags, () => quick.set({ tags: [], caret: "tags" })),
  ...typeInto(T.tag, "tagDraft", COPY.tag, COPY.rates.tag),
  call(T.pill, () => quick.set({ tags: [COPY.tag], tagDraft: "" })),
  // `NoteCreationService`: the draft's properties become frontmatter above the body, in the vault root.
  call(T.send, () => {
    void sceneVault.app.vault.create(`${COPY.title}.md`, `---\ntags:\n  - ${COPY.tag}\n---\n${COPY.body}\n`);
  }),
]);

const quickBox = (node: Element) => boxIn(quick, dom, node);

async function buildTimeline(): Promise<{ tl: gsap.core.Timeline }> {
  const m = (time: number, target: Target) => director.measureAsync(time, target, dom.camera);
  const at = { open: await m(0, OPEN), card: await m(T.send + 0.1, NEW_CARD) };
  await director.seekAsync(0);
  const tagsBox = quickBox(quick.buttons.tags);

  const tl = gsap.timeline({ paused: true });
  const rest: Point = { x: FRAME.width * 0.5, y: FRAME.height * 0.62 };
  tl.set(dom.cursor, { x: rest.x, y: rest.y, opacity: 1 }, 0);
  tl.set(slot, { autoAlpha: 0 }, 0);

  glide(tl, dom.cursor, center(at.open), T.toOpen, MOVE);
  pulse(tl, dom, center(at.open), T.clickOpen - 0.05);
  tl.fromTo(slot, { autoAlpha: 0, y: 14, scale: QUICK.scale * 0.96 },
    { autoAlpha: 1, y: 0, scale: QUICK.scale, duration: 0.3, ease: "power2.out", immediateRender: false }, T.clickOpen + 0.05);
  const opened = callout(dom.callouts, { icon: "send", text: strings.noteInput.quickInput }, { left: MARGIN, bottom: MARGIN });
  popIn(tl, opened, T.clickOpen + 0.2);
  // Out of the way while typing.
  glide(tl, dom.cursor, { x: center(at.open).x + 40, y: center(at.open).y + 150 }, T.clickOpen + 0.25, 0.5);

  const tagPoint = center(tagsBox);
  glide(tl, dom.cursor, tagPoint, T.toTags, MOVE);
  tl.set(quick.buttons.tags, { attr: { class: "clickable-icon fce-quick-input-tags demo-hover" } }, T.clickTags - LAND);
  pulse(tl, dom, tagPoint, T.clickTags - 0.05);
  tl.set(quick.buttons.tags, { attr: { class: "clickable-icon fce-quick-input-tags" } }, T.clickTags + 0.3);
  glide(tl, dom.cursor, { x: tagPoint.x - 60, y: tagPoint.y + 90 }, T.clickTags + 0.3, 0.5);

  popOut(tl, opened, T.keys - 0.3);
  const keys = callout(dom.callouts, { icon: "keyboard", label: "Ctrl + Enter", text: COPY.send }, { left: MARGIN, bottom: MARGIN });
  popIn(tl, keys, T.keys);
  tl.to(slot, { autoAlpha: 0, y: -10, scale: QUICK.scale * 0.97, duration: 0.2, ease: "power2.in" }, T.send);
  popOut(tl, keys, T.send + 0.4);
  const arrived = callout(dom.callouts, { icon: "file-plus", text: COPY.arrived, className: "is-accent" }, { left: MARGIN, bottom: MARGIN });
  popIn(tl, arrived, T.send + 0.5);
  glide(tl, dom.cursor, { x: at.card.x + at.card.width * 0.6, y: at.card.y + at.card.height * 0.55 }, T.send + 0.3, MOVE);
  popOut(tl, arrived, T.end - 0.7);
  glide(tl, dom.cursor, rest, T.end - MOVE - 0.1, MOVE);
  tl.set({}, {}, T.end);
  return { tl };
}

await Promise.all([document.fonts.ready, quick.ready]);
const { tl } = await buildTimeline();
registerClip(director, tl, T.end, dom);
