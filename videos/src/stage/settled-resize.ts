import { flushSync } from "svelte";

/**
 * A real `ResizeObserver` reports a frame later, so a panel that sizes its
 * virtual rows with one ends up in a state that depends on whether a frame
 * was painted between two steps. Render workers seek with different
 * histories (one frame apart, a chunk apart, straight from 0), so that state
 * would differ per worker and the list would flicker. The stage observer only
 * reports when the director settles it, synchronously after every step.
 */
interface Size {
  width: number;
  height: number;
}

const observers = new Set<SettledResizeObserver>();
const MAX_PASSES = 20;

/** Border-box size from layout, unaffected by the camera's transforms. */
function borderBox(target: Element): Size {
  const style = getComputedStyle(target);
  if (style.display === "none") return { width: 0, height: 0 };
  const px = (value: string) => Number.parseFloat(value) || 0;
  let width = px(style.width);
  let height = px(style.height);
  if (style.boxSizing !== "border-box") {
    width += px(style.paddingLeft) + px(style.paddingRight) + px(style.borderLeftWidth) + px(style.borderRightWidth);
    height += px(style.paddingTop) + px(style.paddingBottom) + px(style.borderTopWidth) + px(style.borderBottomWidth);
  }
  return { width, height };
}

function entryFor(target: Element, size: Size): ResizeObserverEntry {
  const box = [{ inlineSize: size.width, blockSize: size.height }] as unknown as ReadonlyArray<ResizeObserverSize>;
  return {
    target,
    contentRect: new DOMRectReadOnly(0, 0, size.width, size.height),
    borderBoxSize: box,
    contentBoxSize: box,
    devicePixelContentBoxSize: box,
  };
}

class SettledResizeObserver implements ResizeObserver {
  /** Last reported size; a fresh target starts at 0×0, so only a sized one reports, as in the spec. */
  private readonly targets = new Map<Element, Size>();

  constructor(private readonly callback: ResizeObserverCallback) {
    observers.add(this);
  }

  observe(target: Element): void {
    if (!this.targets.has(target)) this.targets.set(target, { width: 0, height: 0 });
  }

  unobserve(target: Element): void {
    this.targets.delete(target);
  }

  disconnect(): void {
    this.targets.clear();
    observers.delete(this);
  }

  /** Reports every target whose size changed since its last report. */
  deliver(): boolean {
    const entries: ResizeObserverEntry[] = [];
    for (const [target, last] of this.targets) {
      if (!target.isConnected) continue;
      const size = borderBox(target);
      if (size.width === last.width && size.height === last.height) continue;
      this.targets.set(target, size);
      entries.push(entryFor(target, size));
    }
    if (entries.length > 0) this.callback(entries, this);
    return entries.length > 0;
  }
}

/**
 * The panel also batches row measurement into an animation frame, which would
 * land after the seek, and reads heights with `getBoundingClientRect`, which
 * includes the stage zoom and camera scale. Frames requested while the
 * director works are queued and run when it settles, with element sizes read
 * from layout. Frames requested elsewhere (GSAP, HyperFrames) stay native.
 */
const nativeFrame = window.requestAnimationFrame.bind(window);
const nativeCancelFrame = window.cancelAnimationFrame.bind(window);
const nativeRect = Element.prototype.getBoundingClientRect;
const queuedFrames = new Map<number, FrameRequestCallback>();
let nextFrameId = -1;
let directingDepth = 0;

function runQueuedFrames(): boolean {
  if (queuedFrames.size === 0) return false;
  const callbacks = [...queuedFrames.values()];
  queuedFrames.clear();
  Element.prototype.getBoundingClientRect = function layoutRect(this: Element): DOMRect {
    const rect = nativeRect.call(this);
    const size = borderBox(this);
    return new DOMRect(rect.x, rect.y, size.width, size.height);
  };
  try {
    flushSync(() => {
      for (const callback of callbacks) callback(performance.now());
    });
  } finally {
    Element.prototype.getBoundingClientRect = nativeRect;
  }
  return true;
}

export function installSettledResizeObserver(): void {
  window.ResizeObserver = SettledResizeObserver;
  window.requestAnimationFrame = (callback) => {
    if (directingDepth === 0) return nativeFrame(callback);
    const id = nextFrameId;
    nextFrameId -= 1;
    queuedFrames.set(id, callback);
    return id;
  };
  window.cancelAnimationFrame = (id) => {
    if (!queuedFrames.delete(id)) nativeCancelFrame(id);
  };
}

/** Runs director work with its animation frames queued for `settleLayout`. */
export function directing<T>(work: () => T): T {
  directingDepth += 1;
  try {
    return work();
  } finally {
    directingDepth -= 1;
  }
}

/**
 * `directing` across awaits. Only microtasks run while `work` is pending (the
 * event loop never yields), so every frame requested meanwhile is the scene's.
 */
export async function directingAsync<T>(work: () => Promise<T>): Promise<T> {
  directingDepth += 1;
  try {
    return await work();
  } finally {
    directingDepth -= 1;
  }
}

/** Delivers resizes and queued frames until layout stops changing; a delivery can render rows that then need measuring. */
export function settleLayout(): void {
  for (let pass = 0; pass < MAX_PASSES; pass += 1) {
    let changed = false;
    flushSync(() => {
      for (const observer of [...observers]) changed = observer.deliver() || changed;
    });
    changed = runQueuedFrames() || changed;
    if (!changed) return;
  }
  throw new Error(`Layout did not settle after ${MAX_PASSES} resize passes`);
}
