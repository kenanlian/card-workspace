// Helpers for clips that work in a separate window (settings, quick input):
// frame-space boxes for its elements, and the native select list Chromium would draw.
import type { Box } from "../stage/director";
import type { PopoutDocument } from "../stage/native-windows";
import type { ClipDom } from "./frame";

/** Box of an element inside a window document, in frame px. */
export function windowBox(win: Pick<PopoutDocument, "iframe" | "doc">, dom: ClipDom, node: Element): Box {
  const outer = win.iframe.getBoundingClientRect();
  const base = dom.camera.getBoundingClientRect();
  const scale = outer.width / win.doc.documentElement.clientWidth;
  const rect = node.getBoundingClientRect();
  return { x: outer.left - base.left + rect.left * scale, y: outer.top - base.top + rect.top * scale, width: rect.width * scale, height: rect.height * scale };
}

/** Chromium on Windows draws a native select's list as a plain box under the control. */
export function renderSelectPopup(select: HTMLSelectElement): { popup: HTMLElement; rows: HTMLElement[] } {
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
