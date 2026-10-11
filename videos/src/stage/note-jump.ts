// Opening a note at a location, as `openNoteFromCard(path, _, location)` does:
// the note shows in the root leaf, the target text is selected, and the view
// scrolls it into the upper part of the pane.
import type { MainWindow } from "./window-shell";

const FRONTMATTER = /^---\r?\n[\s\S]*?\r?\n---\r?\n?/;

/** Text nodes of the rendered body, skipping the inline title and properties. */
function bodyTextNodes(scroller: HTMLElement): Text[] {
  const sizer = scroller.querySelector(".markdown-preview-sizer");
  if (!sizer) return [];
  const nodes: Text[] = [];
  for (const block of Array.from(sizer.children)) {
    if (block.classList.contains("mod-header") || block.classList.contains("mod-footer")) continue;
    const walker = document.createTreeWalker(block, NodeFilter.SHOW_TEXT);
    for (let node = walker.nextNode(); node; node = walker.nextNode()) nodes.push(node as Text);
  }
  return nodes;
}

/**
 * Selects the occurrence of `text` that sits at `offset` in the note's source.
 * Rendering drops Markdown syntax but keeps body text in order, so the n-th
 * occurrence in the source body is the n-th in the rendered body.
 */
export function jumpToText(win: MainWindow, path: string, markdown: string, text: string, offset: number): HTMLElement {
  win.showNote(path);
  const bodyStart = FRONTMATTER.exec(markdown)?.[0].length ?? 0;
  let occurrence = 0;
  for (let index = markdown.indexOf(text, bodyStart); index >= 0 && index < offset; index = markdown.indexOf(text, index + 1)) occurrence += 1;

  const scroller = win.noteScroller;
  let seen = 0;
  for (const node of bodyTextNodes(scroller)) {
    let index = node.data.indexOf(text);
    while (index >= 0) {
      if (seen === occurrence) {
        const range = document.createRange();
        range.setStart(node, index);
        range.setEnd(node, index + text.length);
        const mark = document.createElement("span");
        mark.className = "demo-hit-selection";
        range.surroundContents(mark);
        // Rects include the camera scale; scrollTop is in layout pixels.
        const frame = scroller.getBoundingClientRect();
        const scale = frame.height / scroller.offsetHeight || 1;
        const top = (mark.getBoundingClientRect().top - frame.top) / scale + scroller.scrollTop;
        scroller.scrollTop = Math.max(0, top - scroller.clientHeight * 0.3);
        return mark;
      }
      seen += 1;
      index = node.data.indexOf(text, index + 1);
    }
  }
  throw new Error(`"${text}" #${occurrence} not found in the rendered ${path}`);
}
