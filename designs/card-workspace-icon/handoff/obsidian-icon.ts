import { addIcon } from 'obsidian';

export const CARD_WORKSPACE_ICON = 'card-workspace';

// Drawn on Lucide's 24x24 grid, but addIcon() renders into a fixed `0 0 100 100`
// viewBox, so the whole thing is scaled by 100/24. The stroke scales with it:
// stroke-width 2 here ends up at 8.33 on screen, matching Lucide at 24px.
// Obsidian's `--icon-stroke` cannot reach a scaled group, so if this reads
// heavier than the built-in icons beside it, lower the 2 to 1.75.
const CARD_WORKSPACE_ICON_SVG = `<g transform="scale(4.16667)" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M3 4v16"/>
  <rect x="7" y="3" width="11" height="7" rx="1.5"/>
  <rect x="10" y="14" width="11" height="7" rx="1.5"/>
</g>`;

export function registerCardWorkspaceIcon(): void {
  addIcon(CARD_WORKSPACE_ICON, CARD_WORKSPACE_ICON_SVG);
}
