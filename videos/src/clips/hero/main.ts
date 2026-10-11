// Hero: the vault as cards beside the editor. A tag narrows the stream, a
// card opens its note, and following a link in the note moves the selection
// with it, as the plugin's `file-open` sync does.
import gsap from "gsap";
import meta from "../../../theme/meta.json";
import workspaceHtml from "../../../theme/workspace.html?raw";
import zhSnapshot from "../../../data/vault.zh.json";
import enSnapshot from "../../../data/vault.en.json";
import { navigationTagId } from "@plugin/view/navigation-model";
import { DemoHost } from "../../stage/demo-host";
import { createDemoVault, type VaultSnapshot } from "../../stage/demo-vault";
import { Director, type Box, type MountedScene, type Target } from "../../stage/director";
import { applyThemeMeta, mountPanel } from "../../stage/obsidian-shell";
import { createMainWindow } from "../../stage/window-shell";
import {
  callout, center, createClipDom, FRAME, glide, LANG, popIn, popOut, pulse, registerClip, THREE_COLUMN_ZOOM, threeColumns, windowFor,
  type Point,
} from "../../clip/frame";
import { cardTitled, LAND, MOVE, navRow, press, scrollSteps, within } from "../../clip/script";

/** The hero opens on a Shanghai note in the Kyoto note's place; the images clip keeps Kyoto. */
const PHOTO = { name: "shanghai-lujiazui.jpg", bytes: 98513 };
const COPY = {
  zh: {
    replaces: "旅行/京都红叶季.md",
    openNote: "旅行/上海陆家嘴.md",
    noteContent: `---
tags: [旅行]
---

傍晚从外滩看陆家嘴：上海中心、环球金融中心和金茂大厦三件套并排而立，左边是东方明珠。日落后二十分钟，天色和灯光最好看。

![[附件/${PHOTO.name}]]

## 路线

- 外滩观景平台 → 轮渡到东昌路
- 沿滨江大道散步，再上上海中心看夜景
`,
    tag: "神经科学",
    card: "深度工作",
    link: "任务切换的代价",
    notes: (count: number) => `${count} 篇笔记`,
    opened: "点击卡片，打开笔记",
    follows: "选中跟随当前笔记",
  },
  en: {
    replaces: "Travel/Kyoto in autumn.md",
    openNote: "Travel/Lujiazui, Shanghai.md",
    noteContent: `---
tags: [travel]
---

Dusk from the Bund: the Shanghai Tower trio, with the Oriental Pearl on the left.

![[Attachments/${PHOTO.name}]]

## Route

- Bund promenade → ferry to Dongchang Road
- Walk the riverside, then go up Shanghai Tower for the night view
`,
    tag: "neuroscience",
    card: "Deep work",
    link: "The cost of task switching",
    notes: (count: number) => `${count} notes`,
    opened: "Click a card to open the note",
    follows: "Selection follows the open note",
  },
}[LANG];

const ZOOM = THREE_COLUMN_ZOOM;
const WINDOW = windowFor(ZOOM);
const LAYOUT = threeColumns(WINDOW);

const SCROLL = 0.8;
const T = (() => {
  const toTag = 0.4;
  const clickTag = toTag + MOVE + LAND;
  const toCard = clickTag + 1.0;
  const clickCard = toCard + MOVE + LAND;
  // The link sits below the fold of the narrow editor column.
  const scroll = clickCard + 0.6;
  const toLink = scroll + SCROLL + 0.2;
  const clickLink = toLink + MOVE + LAND;
  return { toTag, clickTag, toCard, clickCard, scroll, toLink, clickLink, end: clickLink + 1.9 + MOVE + 0.1 };
})();

const base = (LANG === "zh" ? zhSnapshot : enSnapshot) as unknown as VaultSnapshot;
const replaced = base.files.find((file) => file.path === COPY.replaces)!;
const replacedImage = /!\[\[([^\]]+)\]\]/.exec(replaced.content)![1];
const snapshot: VaultSnapshot = {
  ...base,
  files: base.files.map((file) => (file === replaced ? { ...file, path: COPY.openNote, content: COPY.noteContent } : file)),
  attachments: (base.attachments ?? []).map((entry) => (entry.path === replacedImage
    ? { ...entry, path: `${replacedImage.slice(0, replacedImage.lastIndexOf("/"))}/${PHOTO.name}`, size: PHOTO.bytes }
    : entry)),
};
const settings = {
  ...snapshot.settings,
  workspace: {
    ...snapshot.settings.workspace,
    navPaneWidth: LAYOUT.navPaneWidth,
    sectionCollapsed: { ...snapshot.settings.workspace.sectionCollapsed, folders: true, properties: true },
  },
};
const vault = createDemoVault(snapshot, "/data/files/");
const pathByName = new Map(vault.files.map((file) => [file.basename, file.path]));
applyThemeMeta(meta);
const dom = createClipDom(ZOOM);

function mountScene(): MountedScene {
  dom.stage.replaceChildren();
  const demo = new DemoHost(vault, settings, LANG, { selectedPath: COPY.openNote });
  const win = createMainWindow(dom.stage, {
    html: workspaceHtml, meta, size: WINDOW, titleText: snapshot.name, leftWidth: LAYOUT.leftWidth,
    vaultName: snapshot.name, lang: LANG, note: { vault, path: COPY.openNote },
  });
  const open = (path: string) => {
    win.showNote(path);
    demo.update({ selectedPath: path });
  };
  win.frame.addEventListener("click", (event) => {
    const link = (event.target as HTMLElement).closest<HTMLElement>(".markdown-preview-view .internal-link");
    const path = link && pathByName.get((link.dataset.href ?? "").split("#")[0]);
    if (path) open(path);
  });
  const panel = mountPanel(win.host, demo, { onOpenNote: ({ path }: { path: string }) => open(path) });
  return { demo, host: win.frame, destroy: () => panel.destroy() };
}

const TAG = navRow(navigationTagId(COPY.tag));
const CARD = cardTitled(COPY.card);
const LINK: Target = (host) => host.querySelector<HTMLElement>(`.markdown-preview-view .internal-link[data-href="${COPY.link}"]`);

const director = new Director(mountScene, [
  ...press(T.clickTag, TAG),
  ...press(T.clickCard, CARD),
  ...scrollSteps(".mod-root .markdown-preview-view", T.scroll, T.scroll + SCROLL, 0, (scroller) => {
    const link = scroller.querySelector<HTMLElement>(`.internal-link[data-href="${COPY.link}"]`)!;
    const scale = scroller.getBoundingClientRect().height / scroller.offsetHeight || 1;
    const top = (link.getBoundingClientRect().top - scroller.getBoundingClientRect().top) / scale + scroller.scrollTop;
    return Math.min(scroller.scrollHeight - scroller.clientHeight, Math.max(0, top - scroller.clientHeight * 0.35));
  }),
  ...press(T.clickLink, LINK),
]);

const onLabel = (box: Box): Point => ({ x: box.x + Math.min(box.width / 2, 48), y: box.y + box.height / 2 });
const onCard = (box: Box): Point => ({ x: box.x + box.width * 0.55, y: box.y + box.height * 0.45 });

async function buildTimeline(): Promise<{ tl: gsap.core.Timeline }> {
  const m = (time: number, target: Target) => director.measureAsync(time, target, dom.camera);
  const at = {
    tag: await m(T.toTag, within(TAG, ".fce-tree-label")),
    card: await m(T.toCard, CARD),
    link: await m(T.toLink + MOVE, LINK),
    followed: await m(T.clickLink + 0.1, cardTitled(COPY.link)),
  };
  const count = await director.readAsync(T.clickTag + 0.05, ({ demo }) => demo.model.getState().cards.records.length);
  await director.seekAsync(0);

  const tl = gsap.timeline({ paused: true });
  const rest: Point = { x: FRAME.width * 0.5, y: FRAME.height * 0.62 };
  tl.set(dom.cursor, { x: rest.x, y: rest.y, opacity: 1 }, 0);

  glide(tl, dom.cursor, onLabel(at.tag), T.toTag, MOVE);
  pulse(tl, dom, onLabel(at.tag), T.clickTag - 0.05);
  const tagged = callout(dom.callouts, { icon: "tag", label: `#${COPY.tag}`, text: COPY.notes(count) });
  popIn(tl, tagged, T.clickTag + 0.1);

  glide(tl, dom.cursor, onCard(at.card), T.toCard, MOVE);
  pulse(tl, dom, onCard(at.card), T.clickCard - 0.05);
  const opened = callout(dom.callouts, { icon: "file-text", text: COPY.opened });
  popOut(tl, tagged, T.clickCard);
  popIn(tl, opened, T.clickCard + 0.15);

  glide(tl, dom.cursor, center(at.link), T.toLink, MOVE);
  pulse(tl, dom, center(at.link), T.clickLink - 0.05);
  const follows = callout(dom.callouts, { icon: "locate-fixed", text: COPY.follows, className: "is-accent" });
  popOut(tl, opened, T.clickLink);
  popIn(tl, follows, T.clickLink + 0.15);
  glide(tl, dom.cursor, onCard(at.followed), T.clickLink + 0.35, MOVE);

  popOut(tl, follows, T.end - MOVE - 0.3);
  glide(tl, dom.cursor, rest, T.end - MOVE - 0.1, MOVE);
  tl.set({}, {}, T.end);
  return { tl };
}

await document.fonts.ready;
const { tl } = await buildTimeline();
registerClip(director, tl, T.end, dom);
