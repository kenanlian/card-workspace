// Search: type a query, the stream narrows to the notes that mention it, each
// card shows its hits in context, and clicking a snippet opens the note at
// that passage. Ends with search closed, where it began.
import gsap from "gsap";
import meta from "../../../theme/meta.json";
import workspaceHtml from "../../../theme/workspace.html?raw";
import zhSnapshot from "../../../data/vault.zh.json";
import enSnapshot from "../../../data/vault.en.json";
import { getUiStrings } from "@plugin/i18n";
import { DemoHost, findSearchSnippet, prepareSearchPreviews } from "../../stage/demo-host";
import { createDemoVault, type VaultSnapshot } from "../../stage/demo-vault";
import { call, Director, type MountedScene, type Target } from "../../stage/director";
import { jumpToText } from "../../stage/note-jump";
import { applyThemeMeta, mountPanel } from "../../stage/obsidian-shell";
import { createMainWindow, type MainWindow } from "../../stage/window-shell";
import {
  callout, center, createClipDom, FRAME, glide, LANG, popIn, popOut, pulse, registerClip, windowFor, type Point,
} from "../../clip/frame";
import { cardTitled, LAND, MOVE, press, typeSteps } from "../../clip/script";

const COPY = {
  zh: {
    query: "打断",
    openNote: "研究/注意力研究综述.md",
    /** The card whose snippet the cursor opens, and which of its snippets. */
    jumpCard: "访谈：程序员小林",
    jumpSnippet: 0,
    hits: (count: number) => `${count} 篇笔记`,
    jumpLabel: "点击片段，直达原文",
  },
  en: {
    query: "interruption",
    openNote: "Research/Attention research review.md",
    jumpCard: "Interview - Lin, developer",
    jumpSnippet: 0,
    hits: (count: number) => `${count} notes`,
    jumpLabel: "Click a snippet to jump there",
  },
}[LANG];

const ZOOM = 2;
const WINDOW = windowFor(ZOOM);
const LEFT_WIDTH = 330;
const TYPE_RATE = LANG === "zh" ? 6 : 20;

/**
 * Even beats: travel, land, click, and a read hold after each result.
 * The first 0.4 s only shows inside the loop cross-fade, so motion starts at 0.4.
 */
const T = (() => {
  const toSearch = 0.4;
  const clickSearch = toSearch + MOVE + LAND;
  const type = clickSearch + 0.45;
  const commit = type + COPY.query.length / TYPE_RATE + 0.15;
  const hitsIn = commit + 0.05;
  const toSnippet = hitsIn + 1.2;
  const clickSnippet = toSnippet + MOVE + LAND;
  const toToggle = clickSnippet + 1.7;
  const clickToggle = toToggle + MOVE + LAND;
  return {
    toSearch, clickSearch, type, commit, hitsIn, toSnippet, clickSnippet, toToggle, clickToggle,
    end: clickToggle + 0.25 + MOVE + 0.15,
  };
})();

const snapshot = (LANG === "zh" ? zhSnapshot : enSnapshot) as unknown as VaultSnapshot;
const vault = createDemoVault(snapshot, "/data/files/");
const strings = getUiStrings(LANG);
applyThemeMeta(meta);
const dom = createClipDom(ZOOM);

let win: MainWindow;
function mountScene(): MountedScene {
  dom.stage.replaceChildren();
  const demo = new DemoHost(vault, snapshot.settings, LANG, { navPaneCollapsed: true });
  win = createMainWindow(dom.stage, {
    html: workspaceHtml, meta, size: WINDOW, titleText: snapshot.name, leftWidth: LEFT_WIDTH,
    vaultName: snapshot.name, lang: LANG, note: { vault, path: COPY.openNote },
  });
  const panel = mountPanel(win.host, demo, {
    onOpenNote: ({ path, snippetId }: { path: string; snippetId?: string }) => {
      const snippet = snippetId ? findSearchSnippet(demo.runtime.committedQuery, path, snippetId) : undefined;
      if (snippet) jumpToText(win, path, vault.readMarkdown(path), snippet.location.text, snippet.location.offset);
      else win.showNote(path);
    },
  });
  return { demo, host: win.frame, destroy: () => panel.destroy() };
}

const SEARCH_TOGGLE = `.fce-toolbar-buttons button[aria-label="${strings.toolbar.actions.toggleSearch}"]`;
const SEARCH_INPUT = ".fce-search-input";
const snippet = (title: string, index: number): Target => (host) =>
  (cardTitled(title)(host)?.querySelectorAll<HTMLElement>(".fce-search-snippet")[index]) ?? null;
const HIT: Target = (host) => host.querySelector<HTMLElement>(".demo-hit-selection");

const director = new Director(mountScene, [
  ...press(T.clickSearch, SEARCH_TOGGLE),
  ...typeSteps(T.type, SEARCH_INPUT, COPY.query, TYPE_RATE),
  call(T.commit, ({ demo }) => demo.commitQuery()),
  ...press(T.clickSnippet, snippet(COPY.jumpCard, COPY.jumpSnippet)),
  ...press(T.clickToggle, SEARCH_TOGGLE),
]);

/** Resolves to a wrapper: a GSAP timeline is a thenable that settles only when it completes. */
async function buildTimeline(): Promise<{ tl: gsap.core.Timeline }> {
  const m = (time: number, target: Target) => director.measureAsync(time, target, dom.camera);
  const at = {
    toggle: await m(T.toSearch, SEARCH_TOGGLE),
    input: await m(T.type, SEARCH_INPUT),
    snippet: await m(T.toSnippet, snippet(COPY.jumpCard, COPY.jumpSnippet)),
    hit: await m(T.clickSnippet + 0.1, HIT),
    toggleEnd: await m(T.toToggle, SEARCH_TOGGLE),
  };
  const hits = await director.readAsync(T.hitsIn, ({ demo }) => demo.model.getState().cards.records.length);
  await director.seekAsync(0);

  const tl = gsap.timeline({ paused: true });
  // Cursor: rests over the editor at the start and the end, so the loop closes.
  const rest: Point = { x: FRAME.width * 0.68, y: FRAME.height * 0.62 };
  tl.set(dom.cursor, { x: rest.x, y: rest.y, opacity: 1 }, 0);
  glide(tl, dom.cursor, center(at.toggle), T.toSearch, MOVE);
  pulse(tl, dom, center(at.toggle), T.clickSearch - 0.05);
  glide(tl, dom.cursor, { x: at.input.x + at.input.width * 0.75, y: center(at.input).y + 44 }, T.clickSearch + 0.1, 0.45);

  // The query and the narrowed count, mirrored from the panel.
  const pill = callout(dom.callouts, { icon: "search", label: COPY.query, text: COPY.hits(hits) });
  popIn(tl, pill, T.hitsIn);

  const snippetPoint = { x: at.snippet.x + at.snippet.width * 0.4, y: center(at.snippet).y };
  glide(tl, dom.cursor, snippetPoint, T.toSnippet, MOVE);
  const jump = callout(dom.callouts, { icon: "corner-down-right", text: COPY.jumpLabel, className: "is-accent" });
  popOut(tl, pill, T.toSnippet);
  popIn(tl, jump, T.toSnippet + 0.3);
  pulse(tl, dom, snippetPoint, T.clickSnippet - 0.05);
  // Step aside so the selected passage stays in view.
  glide(tl, dom.cursor, { x: at.hit.x + at.hit.width * 0.5, y: at.hit.y + at.hit.height + 120 }, T.clickSnippet + 0.2, MOVE);

  popOut(tl, jump, T.toToggle);
  glide(tl, dom.cursor, center(at.toggleEnd), T.toToggle, MOVE);
  pulse(tl, dom, center(at.toggleEnd), T.clickToggle - 0.05);
  glide(tl, dom.cursor, rest, T.clickToggle + 0.25, MOVE);
  tl.set({}, {}, T.end);
  return { tl };
}

await prepareSearchPreviews(vault, [COPY.query], snapshot.settings.preferences.searchPreviewSnippetCount ?? 2);
await document.fonts.ready;
const { tl } = await buildTimeline();
registerClip(director, tl, T.end, dom);
