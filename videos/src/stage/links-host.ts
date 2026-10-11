// A DemoHost whose navigation enters the Links source: backlinks or outgoing
// links of the active note, ordered by reference count, each card carrying the
// referencing paragraphs as `HydrationController.buildLinkPreview` builds them.
import { collectLinkReferenceLocations } from "@plugin/view/link-card-location";
import { buildLinkReferenceSnippets, type LinkReferencePreview, type LinkReferenceSnippet } from "@plugin/view/link-reference-preview";
import { collectLinksFiles, readLinkReferenceCount, resolveLinksFollowScope } from "@plugin/view/links-sources";
import { createLinksScope, isLinksScope, scopeIdentity, type CardScope, type LinksScope } from "@plugin/view/scope";
import type { NoteCardRecord } from "@plugin/view/types";
import type { TFile } from "obsidian";
import { DemoHost } from "./demo-host";
import type { DemoVault } from "./demo-vault";

type Direction = LinksScope["direction"];
const DEFAULT_LINKS_SORT = { field: "reference-count", direction: "desc" } as const;

/**
 * Reference previews per links scope and card. The plugin builds them in a
 * time-sliced hydration job; scenes replay synchronously, so
 * `prepareBacklinkPreviews` runs the same builder ahead of time.
 */
const previews = new Map<string, LinkReferencePreview>();
const previewKey = (scope: LinksScope, path: string) => `${scopeIdentity(scope)}\n${path}`;

/** `HydrationController.buildLinkPreview` for every backlink of `notePath`, with no card expanded. */
export async function prepareBacklinkPreviews(vault: DemoVault, notePath: string, limit: number): Promise<void> {
  const scope = createLinksScope(notePath, "backlinks") as LinksScope;
  for (const file of collectLinksFiles(vault.app, scope)) {
    const references = collectLinkReferenceLocations(vault.app, scope, file.path);
    const result = await buildLinkReferenceSnippets(vault.readMarkdown(file.path), references, limit, `demo:${file.path}`, () => true);
    if (!result) throw new Error(`No reference snippets for ${file.path}`);
    previews.set(previewKey(scope, file.path), {
      direction: "backlinks", expanded: false, status: result.snippets.length > 0 ? "ready" : "unavailable",
      sourcePath: file.path, sourceMtime: file.stat.mtime, sourceRevision: 0, contextKey: "",
      ...result,
    });
  }
}

export class LinksDemoHost extends DemoHost {
  constructor(private readonly linksVault: DemoVault, ...rest: ConstructorParameters<typeof DemoHost> extends [unknown, ...infer R] ? R : never) {
    super(linksVault, ...rest);
  }

  /** `LinksActions.enterOrSwitchLinks`: entering from another source starts unpinned, on the active note. */
  protected override selectLinksDirection(direction: Direction): void {
    const { scope, selectedPath } = this.state;
    const notePath = isLinksScope(scope) ? scope.notePath : selectedPath;
    if (!notePath) return;
    this.update({ scope: createLinksScope(notePath, direction), ...(isLinksScope(scope) ? {} : { linksPinned: false }) });
  }

  /** `LinksActions.togglePinned`; unpinning re-points to the active note. */
  togglePinned(): void {
    const { scope, selectedPath, linksPinned } = this.state;
    if (!isLinksScope(scope)) return;
    if (!linksPinned) {
      this.update({ linksPinned: true });
      return;
    }
    const follow = selectedPath && selectedPath !== scope.notePath ? createLinksScope(selectedPath, scope.direction) : scope;
    this.update({ linksPinned: false, scope: follow });
  }

  /** `FolderCardView.setSelectedFile`: an unpinned links source follows the active note. */
  setActiveNote(path: string): void {
    const next = resolveLinksFollowScope(this.state.scope, path, this.state.linksPinned);
    this.update({ selectedPath: path, ...(next ? { scope: next } : {}) });
  }

  /** The snippet a card's `onOpenNote({ referenceId })` names, as `resolveReferenceLocation` finds it. */
  findReference(path: string, id: string): LinkReferenceSnippet | undefined {
    const { scope } = this.state;
    return isLinksScope(scope) ? previews.get(previewKey(scope, path))?.snippets.find((snippet) => snippet.id === id) : undefined;
  }

  protected override scopeFiles(scope: CardScope): TFile[] {
    return isLinksScope(scope) ? collectLinksFiles(this.linksVault.app, scope) : super.scopeFiles(scope);
  }

  /** `resolveViewConfig`: links sources sort by their own per-direction spec. */
  protected override arrangement() {
    const base = super.arrangement();
    const { scope } = this.state;
    if (!isLinksScope(scope)) return base;
    const linksSort = this.settings.preferences.linksSort?.[scope.direction] ?? DEFAULT_LINKS_SORT;
    return { ...base, sort: linksSort as unknown as typeof base.sort };
  }

  /** `ScopeController` counts references; hydration with no query shows them inline as the preview. */
  protected override scopeRecord(card: NoteCardRecord): NoteCardRecord {
    const { scope } = this.state;
    if (!isLinksScope(scope)) return card;
    const referenceCount = readLinkReferenceCount(this.linksVault.app, scope, card.path);
    if (scope.direction !== "backlinks") return { ...card, referenceCount };
    const linkPreview = previews.get(previewKey(scope, card.path));
    if (!linkPreview) throw new Error(`No prepared reference previews for ${card.path}; call prepareBacklinkPreviews first`);
    const primary = linkPreview.snippets[0];
    return { ...card, referenceCount, linkPreview, previewHtml: primary?.html ?? "", previewMode: primary?.mode ?? "empty" };
  }
}
