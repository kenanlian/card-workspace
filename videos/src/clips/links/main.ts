// Linked context: the active note's backlinks become cards, most-referenced
// first, each showing the paragraphs that cite it; pinned to the note, a
// click on a reference opens the citing note at that passage.
import gsap from "gsap";
import meta from "../../../theme/meta.json";
import workspaceHtml from "../../../theme/workspace.html?raw";
import zhSnapshot from "../../../data/vault.zh.json";
import enSnapshot from "../../../data/vault.en.json";
import { getUiStrings } from "@plugin/i18n";
import { navigationLinksId } from "@plugin/view/navigation-model";
import { createDemoVault, type VaultSnapshot } from "../../stage/demo-vault";
import { Director, type MountedScene, type Target } from "../../stage/director";
import { LinksDemoHost, prepareBacklinkPreviews } from "../../stage/links-host";
import { jumpToText } from "../../stage/note-jump";
import { applyThemeMeta, mountPanel } from "../../stage/obsidian-shell";
import { createMainWindow, type MainWindow } from "../../stage/window-shell";
import {
  callout, center, createClipDom, FRAME, glide, LANG, popIn, popOut, pulse, registerClip, THREE_COLUMN_ZOOM, threeColumns, windowFor, type Point,
} from "../../clip/frame";
import { cardTitled, LAND, MOVE, navRow, press } from "../../clip/script";

const COPY = {
  zh: {
    note: "读书笔记/深度工作.md",
    jumpCard: "访谈：程序员小林",
    jumpSnippet: 1,
    backlinks: (count: number) => `${count} 篇笔记引用`,
    pinned: "固定到此笔记",
    jumpLabel: "点击引用，直达原文",
  },
  en: {
    note: "Reading/Deep work.md",
    jumpCard: "Interview - Lin, developer",
    jumpSnippet: 1,
    backlinks: (count: number) => `${count} notes cite it`,
    pinned: "Pinned to this note",
    jumpLabel: "Click a reference to jump there",
  },
}[LANG];

const ZOOM = THREE_COLUMN_ZOOM;
const WINDOW = windowFor(ZOOM);
const LAYOUT = threeColumns(WINDOW);

const T = (() => {
  const toLinks = 0.4;
  const clickLinks = toLinks + MOVE + LAND;
  const toPin = clickLinks + 1.4;
  const clickPin = toPin + MOVE + LAND;
  const toSnippet = clickPin + 0.5;
  const clickSnippet = toSnippet + MOVE + LAND;
  return { toLinks, clickLinks, toPin, clickPin, toSnippet, clickSnippet, end: clickSnippet + 1.8 + MOVE + 0.1 };
})();

const snapshot = (LANG === "zh" ? zhSnapshot : enSnapshot) as unknown as VaultSnapshot;
const settings = {
  ...snapshot.settings,
  workspace: {
    ...snapshot.settings.workspace,
    navPaneWidth: LAYOUT.navPaneWidth,
    sectionCollapsed: { ...snapshot.settings.workspace.sectionCollapsed, folders: true, tags: true, properties: true, links: false },
  },
};
const vault = createDemoVault(snapshot, "/data/files/");
const strings = getUiStrings(LANG);
applyThemeMeta(meta);
const dom = createClipDom(ZOOM);

let win: MainWindow;
function mountScene(): MountedScene {
  dom.stage.replaceChildren();
  const demo = new LinksDemoHost(vault, settings, LANG, { selectedPath: COPY.note });
  win = createMainWindow(dom.stage, {
    html: workspaceHtml, meta, size: WINDOW, titleText: snapshot.name, leftWidth: LAYOUT.leftWidth,
    vaultName: snapshot.name, lang: LANG, note: { vault, path: COPY.note },
  });
  const panel = mountPanel(win.host, demo, {
    onToolbarAction: ({ action }: { action: string }) => {
      if (action === "links-pin-toggle") demo.togglePinned();
    },
    onOpenNote: ({ path, referenceId }: { path: string; referenceId?: string }) => {
      const reference = referenceId ? demo.findReference(path, referenceId) : undefined;
      if (reference) {
        const markdown = vault.readMarkdown(path);
        const original = reference.location.expectedText ?? "";
        const text = /\[\[([^\]|#]+)(?:#[^\]|]*)?(?:\|([^\]]+))?\]\]/.exec(original);
        const lineStart = markdown.split("\n").slice(0, reference.location.line).reduce((sum, line) => sum + line.length + 1, 0);
        jumpToText(win, path, markdown, text ? (text[2] ?? text[1]).trim() : original, lineStart + (reference.location.ch ?? 0));
      } else {
        win.showNote(path);
      }
      demo.setActiveNote(path);
    },
  });
  return { demo, host: win.frame, destroy: () => panel.destroy() };
}

const BACKLINKS = navRow(navigationLinksId("backlinks"));
/** The pin toggle; its label flips once pinned. */
const PIN = ".fce-toolbar-actions button[aria-pressed]";
const reference = (title: string, index: number): Target => (host) =>
  (cardTitled(title)(host)?.querySelectorAll<HTMLElement>(".fce-reference-snippet")[index]) ?? null;
const HIT: Target = (host) => host.querySelector<HTMLElement>(".demo-hit-selection");

const director = new Director(mountScene, [
  ...press(T.clickLinks, BACKLINKS),
  ...press(T.clickPin, PIN),
  ...press(T.clickSnippet, reference(COPY.jumpCard, COPY.jumpSnippet)),
]);

async function buildTimeline(): Promise<{ tl: gsap.core.Timeline }> {
  const m = (time: number, target: Target) => director.measureAsync(time, target, dom.camera);
  const at = {
    links: await m(T.toLinks, BACKLINKS),
    pin: await m(T.toPin, PIN),
    snippet: await m(T.toSnippet, reference(COPY.jumpCard, COPY.jumpSnippet)),
    hit: await m(T.clickSnippet + 0.1, HIT),
  };
  const count = await director.readAsync(T.clickLinks + 0.1, ({ demo }) => demo.model.getState().cards.records.length);
  await director.seekAsync(0);

  const tl = gsap.timeline({ paused: true });
  const rest: Point = { x: FRAME.width * 0.5, y: FRAME.height * 0.62 };
  tl.set(dom.cursor, { x: rest.x, y: rest.y, opacity: 1 }, 0);

  glide(tl, dom.cursor, center(at.links), T.toLinks, MOVE);
  pulse(tl, dom, center(at.links), T.clickLinks - 0.05);
  const cited = callout(dom.callouts, { icon: "links-coming-in", label: strings.links.directionBacklinks, text: COPY.backlinks(count) });
  popIn(tl, cited, T.clickLinks + 0.1);

  glide(tl, dom.cursor, center(at.pin), T.toPin, MOVE);
  pulse(tl, dom, center(at.pin), T.clickPin - 0.05);
  const pinned = callout(dom.callouts, { icon: "pin", text: COPY.pinned });
  popOut(tl, cited, T.clickPin);
  popIn(tl, pinned, T.clickPin + 0.15);

  const snippetPoint = { x: at.snippet.x + at.snippet.width * 0.45, y: center(at.snippet).y };
  glide(tl, dom.cursor, snippetPoint, T.toSnippet, MOVE);
  const jump = callout(dom.callouts, { icon: "corner-down-right", text: COPY.jumpLabel, className: "is-accent" });
  popOut(tl, pinned, T.toSnippet + 0.2);
  popIn(tl, jump, T.toSnippet + 0.45);
  pulse(tl, dom, snippetPoint, T.clickSnippet - 0.05);
  glide(tl, dom.cursor, { x: at.hit.x + at.hit.width * 0.5, y: at.hit.y + at.hit.height + 110 }, T.clickSnippet + 0.2, MOVE);

  popOut(tl, jump, T.end - MOVE - 0.3);
  glide(tl, dom.cursor, rest, T.end - MOVE - 0.1, MOVE);
  tl.set({}, {}, T.end);
  return { tl };
}

const snippetCount = snapshot.settings.preferences.backlinkSnippetCount ?? 3;
await prepareBacklinkPreviews(vault, COPY.note, snippetCount === "all" ? Infinity : snippetCount);
await document.fonts.ready;
const { tl } = await buildTimeline();
registerClip(director, tl, T.end, dom);
