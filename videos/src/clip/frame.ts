// Shared chrome for the homepage clips: a 4:3 frame holding the rebuilt
// Obsidian UI at a fixed CSS zoom, a cursor overlay, screen-space callouts,
// and the `window.__clip` hook scripts/render.mjs and scripts/frames.mjs seek.
// Clips are silent loops: no intro, outro, or voice. The framing never moves;
// motion comes from the cursor and the UI itself.
import gsap from "gsap";
import { setIcon } from "obsidian";
import type { Box, Director } from "../stage/director";
import "./clip.css";

export const FRAME = { width: 1440, height: 1080 };
export type Lang = "zh" | "en";
export const LANG: Lang = new URLSearchParams(location.search).get("lang") === "en" ? "en" : "zh";

export interface Point {
  x: number;
  y: number;
}
export interface Size {
  width: number;
  height: number;
}

export interface ClipDom {
  root: HTMLElement;
  /** Frame-sized box holding the zoomed stage and the cursor; measure targets against it. */
  camera: HTMLElement;
  stage: HTMLElement;
  cursor: SVGElement;
  ripple: HTMLElement;
  /** Screen-space layer for callouts, unaffected by the camera. */
  callouts: HTMLElement;
}

function el<K extends keyof HTMLElementTagNameMap>(tag: K, id: string, parent: HTMLElement): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  node.id = id;
  parent.appendChild(node);
  return node;
}

/**
 * The window size that fills the frame at `zoom`. CSS zoom lays text out at
 * the final size, so glyphs stay crisp, unlike a scale transform.
 */
export const windowFor = (zoom: number): Size => ({ width: FRAME.width / zoom, height: FRAME.height / zoom });

/** Three columns need a wider window than two; the text stays readable at this zoom. */
export const THREE_COLUMN_ZOOM = 1.7;

/**
 * Window splits: with the navigation shown, nav, cards and editor take about a
 * third each (the nav a little less); cards and editor alone split in half.
 */
export function threeColumns(window: Size): { leftWidth: number; navPaneWidth: number } {
  const nav = Math.round(window.width * 0.27);
  return { leftWidth: nav + Math.round((window.width - nav) / 2), navPaneWidth: nav };
}

export function createClipDom(zoom: number): ClipDom {
  document.documentElement.lang = LANG === "zh" ? "zh-CN" : "en";
  document.documentElement.classList.add("clip-document");
  const root = el("div", "clip", document.body);
  const camera = el("div", "camera", root);
  const stage = el("div", "stage", camera);
  stage.style.zoom = String(zoom);
  const overlay = el("div", "overlay", camera);
  const ripple = el("div", "ripple", overlay);
  overlay.insertAdjacentHTML("beforeend", `<svg id="cursor" viewBox="0 0 32 32" aria-hidden="true">
    <path d="M6 3 L6 25 L11.5 19.8 L15.2 28.2 L19 26.6 L15.4 18.3 L23 18.3 Z" fill="#111" stroke="#fff" stroke-width="2" stroke-linejoin="round"/></svg>`);
  const cursor = overlay.querySelector<SVGElement>("#cursor")!;
  const callouts = el("div", "callouts", root);
  return { root, camera, stage, cursor, ripple, callouts };
}

/** Cursor travel on a gentle arc: x and y share the duration but not the ease. */
export function glide(tl: gsap.core.Timeline, cursor: Element, to: Point, time: number, duration = 0.6): void {
  tl.to(cursor, { x: to.x, duration, ease: "power3.inOut" }, time);
  tl.to(cursor, { y: to.y, duration, ease: "power2.inOut" }, time);
}

/** Cursor press plus an expanding ring at the click point. */
export function pulse(tl: gsap.core.Timeline, dom: ClipDom, point: Point, time: number): void {
  tl.to(dom.cursor, { scale: 0.82, duration: 0.08, ease: "power1.in" }, time);
  tl.to(dom.cursor, { scale: 1, duration: 0.2, ease: "back.out(3)" }, time + 0.08);
  tl.fromTo(dom.ripple, { x: point.x, y: point.y, scale: 0.2, opacity: 0.6 },
    { scale: 1.6, opacity: 0, duration: 0.55, ease: "expo.out", immediateRender: false }, time);
}

export const center = (box: Box): Point => ({ x: box.x + box.width / 2, y: box.y + box.height / 2 });

export interface CalloutOptions {
  icon?: string;
  text: string;
  /** Muted lead-in before the text, e.g. a label. */
  label?: string;
  className?: string;
}

export type Placement = Partial<Record<"left" | "right" | "top" | "bottom", number>>;

/** Frame margin every callout keeps. */
export const MARGIN = 48;

/** A white pill in screen space, placed by frame-edge offsets; reveal it with `popIn`. */
export function callout(parent: HTMLElement, options: CalloutOptions, place: Placement = { right: MARGIN, bottom: MARGIN }): HTMLElement {
  const node = document.createElement("div");
  node.className = `clip-callout ${options.className ?? ""}`.trim();
  if (options.icon) {
    const icon = document.createElement("span");
    icon.className = "clip-callout-icon";
    setIcon(icon, options.icon);
    node.appendChild(icon);
  }
  if (options.label) {
    const label = document.createElement("span");
    label.className = "clip-callout-label";
    label.textContent = options.label;
    node.appendChild(label);
  }
  const text = document.createElement("span");
  text.className = "clip-callout-text";
  text.textContent = options.text;
  node.appendChild(text);
  for (const [edge, offset] of Object.entries(place)) node.style.setProperty(edge, `${offset}px`);
  parent.appendChild(node);
  return node;
}

/** The lifted copy of a dragged item the pointer carries: its icon and label on a white pill. */
export function dragGhost(dom: ClipDom, options: { icon: string; text: string }): HTMLElement {
  const ghost = document.createElement("div");
  ghost.className = "clip-ghost";
  const icon = document.createElement("span");
  icon.className = "clip-ghost-icon";
  setIcon(icon, options.icon);
  const text = document.createElement("span");
  text.textContent = options.text;
  ghost.append(icon, text);
  dom.cursor.before(ghost);
  return ghost;
}

/**
 * A press-and-carry: the cursor dips, `ghost` lifts under it and rides along
 * from `from` to `to`, then both settle at the drop.
 */
export function carry(tl: gsap.core.Timeline, dom: ClipDom, ghost: HTMLElement, from: Point, to: Point, times: { press: number; drop: number }): void {
  const offset = { x: 14, y: 10 };
  tl.set(ghost, { x: from.x + offset.x, y: from.y + offset.y }, 0);
  tl.to(dom.cursor, { scale: 0.86, duration: 0.1, ease: "power1.in" }, times.press);
  tl.fromTo(ghost, { opacity: 0, scale: 0.85 }, { opacity: 0.95, scale: 1, duration: 0.25, ease: "back.out(2)", immediateRender: false }, times.press + 0.05);
  const travel = times.drop - times.press - 0.35;
  glide(tl, dom.cursor, to, times.press + 0.2, travel);
  glide(tl, ghost, { x: to.x + offset.x, y: to.y + offset.y }, times.press + 0.2, travel);
  tl.to(ghost, { opacity: 0, scale: 0.9, duration: 0.2, ease: "power2.in" }, times.drop);
  tl.to(dom.cursor, { scale: 1, duration: 0.22, ease: "back.out(3)" }, times.drop);
  tl.fromTo(dom.ripple, { x: to.x, y: to.y, scale: 0.2, opacity: 0.6 },
    { scale: 1.6, opacity: 0, duration: 0.55, ease: "expo.out", immediateRender: false }, times.drop);
}

/** Small elements pop with a soft overshoot. */
export function popIn(tl: gsap.core.Timeline, node: Element, time: number): void {
  tl.fromTo(node, { opacity: 0, y: 14, scale: 0.92 }, { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "back.out(2)", immediateRender: false }, time);
}

export function popOut(tl: gsap.core.Timeline, node: Element, time: number): void {
  tl.to(node, { opacity: 0, y: -10, duration: 0.3, ease: "power2.in" }, time);
}

/** Every image the stage shows, loaded and decoded, so a frame never catches a half-revealed card. */
async function settleImages(stage: HTMLElement): Promise<void> {
  const images = Array.from(stage.querySelectorAll("img"));
  await Promise.all(images.map((image) => image.decode().catch(() => undefined)));
}

export interface ClipHandle {
  duration: number;
  seek(time: number): Promise<void>;
}

/**
 * Publishes the clip for the renderer. A seek replays the scene to `time`,
 * lets image decodes and their reveal land, then poses the timeline.
 */
export function registerClip(director: Director, tl: gsap.core.Timeline, duration: number, dom: ClipDom): void {
  // Records every tween's start values once, so seeking straight to 0 still applies the time-0 sets.
  tl.progress(1, true).progress(0, true);
  const handle: ClipHandle = {
    duration,
    async seek(time) {
      await director.seekAsync(time);
      await settleImages(dom.stage);
      await director.settle();
      tl.seek(time, false);
    },
  };
  Object.assign(window, { __clip: handle, __director: director, __tl: tl });
}
