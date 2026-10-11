// Scene steps the clips share: targets addressed the way the panel renders
// them, and hover / click / type / scroll / drag replayed through the panel's
// own event handlers.
import gsap from "gsap";
import { call, type SceneStep, type Target } from "../stage/director";

/** Cursor travel between targets, and the beat it rests on a target before clicking. */
export const MOVE = 0.6;
export const LAND = 0.15;
/** Seek resolution of stepped motion (scrolls); matches the render frame rate. */
const STEP_FPS = 60;

export function resolve(target: Target, host: HTMLElement): HTMLElement {
  const node = typeof target === "string" ? host.querySelector<HTMLElement>(target) : target(host);
  if (!node) throw new Error(`Scene element not found${typeof target === "string" ? `: ${target}` : ""}`);
  return node;
}

export type Finder = (host: HTMLElement) => HTMLElement | null;

export const cardTitled = (title: string): Finder => (host) =>
  Array.from(host.querySelectorAll<HTMLElement>(".fce-card")).find((node) => node.querySelector("h4")?.textContent?.trim() === title) ?? null;

export const navRow = (id: string): Finder => (host) => host.querySelector<HTMLElement>(`[data-nav-row-id="${CSS.escape(id)}"]`);

/** A target inside another target, e.g. a row's label. */
export const within = (outer: Target, selector: string): Finder => (host) => resolve(outer, host).querySelector<HTMLElement>(selector);

export const hoverOn = (at: number, target: Target): SceneStep => call(at, ({ host }) => resolve(target, host).classList.add("demo-hover"));
export const hoverOff = (at: number): SceneStep => call(at, ({ host }) => host.querySelector(".demo-hover")?.classList.remove("demo-hover"));

/** A click with the hover mirror on while the cursor lands, and off once it leaves. */
export function press(at: number, target: Target, init: MouseEventInit = {}): SceneStep[] {
  return [
    hoverOn(at - LAND, target),
    call(at, ({ host }) => {
      const node = resolve(target, host);
      if (Object.keys(init).length === 0) node.click();
      else node.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true, ...init }));
    }),
    // A click re-renders the row and drops the mirror; restore it until the cursor moves on.
    // Same `at` as the click, so the click's own frame keeps it too.
    // A link click replaces the note it sat in, so the target may be gone.
    call(at, ({ host }) => {
      const node = typeof target === "string" ? host.querySelector<HTMLElement>(target) : target(host);
      node?.classList.add("demo-hover");
    }),
    hoverOff(at + 0.3),
  ];
}

/** One step per character, dispatching the same `input` event a keyboard would. */
export function typeSteps(at: number, input: Target, text: string, charsPerSecond: number): SceneStep[] {
  return [...text].map((_, index) => call(at + index / charsPerSecond, ({ host }) => {
    const node = resolve(input, host) as HTMLInputElement;
    node.value = text.slice(0, index + 1);
    node.dispatchEvent(new Event("input", { bubbles: true }));
  }));
}

/** Scroll positions: px, `"end"` for the scroller's bottom, or px computed from the scroller, at the time it scrolls. */
export type ScrollStop = number | "end" | ((scroller: HTMLElement) => number);

/** An eased scroll of `scroller` from `start` to `end`, one step per frame, firing `scroll` as wheel input would. */
export function scrollSteps(scroller: Target, from: number, to: number, start: ScrollStop, end: ScrollStop): SceneStep[] {
  const ease = gsap.parseEase("power2.inOut");
  const frames = Math.max(1, Math.round((to - from) * STEP_FPS));
  const px = (stop: ScrollStop, node: HTMLElement) =>
    stop === "end" ? node.scrollHeight - node.clientHeight : typeof stop === "function" ? stop(node) : stop;
  let range: [number, number] = [0, 0];
  return Array.from({ length: frames }, (_, index) => call(from + (index + 1) / STEP_FPS, ({ host }) => {
    const node = resolve(scroller, host);
    // Resolved once: a computed stop may read positions the scroll itself moves.
    if (index === 0) range = [px(start, node), px(end, node)];
    const [a, b] = range;
    node.scrollTop = a + (b - a) * ease((index + 1) / frames);
    node.dispatchEvent(new Event("scroll"));
  }));
}

/** Where on a row a drag grabs and drops: a share of its width and of its height. */
export interface DragPoint {
  x: number;
  y: number;
}

function dragEvent(type: string, node: HTMLElement, point: DragPoint, dataTransfer: DataTransfer): DragEvent {
  const rect = node.getBoundingClientRect();
  return new DragEvent(type, {
    bubbles: true, cancelable: true, dataTransfer,
    clientX: rect.left + rect.width * point.x, clientY: rect.top + rect.height * point.y,
  });
}

/** One native drag through the panel's own handlers: dragstart, dragover, drop, dragend. */
export function dragSteps(
  times: { start: number; over: number; drop: number },
  source: Target, target: Target, grab: DragPoint, drop: DragPoint,
): SceneStep[] {
  let transfer = new DataTransfer();
  return [
    call(times.start, ({ host }) => {
      transfer = new DataTransfer();
      const node = resolve(source, host);
      node.classList.remove("demo-hover");
      node.dispatchEvent(dragEvent("dragstart", node, grab, transfer));
    }),
    call(times.over, ({ host }) => {
      const node = resolve(target, host);
      node.dispatchEvent(dragEvent("dragenter", node, drop, transfer));
      node.dispatchEvent(dragEvent("dragover", node, drop, transfer));
    }),
    call(times.drop, ({ host }) => {
      const node = resolve(target, host);
      node.dispatchEvent(dragEvent("drop", node, drop, transfer));
      resolve(source, host).dispatchEvent(new DragEvent("dragend", { bubbles: true, dataTransfer: transfer }));
    }),
  ];
}
