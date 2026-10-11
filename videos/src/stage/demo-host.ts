// Stands in for FolderCardView: owns the runtime state a scene scripts, and
// derives every panel group through the plugin's own projection functions.
import MiniSearch from "minisearch";
import { TFolder, type TFile } from "obsidian";
import { normalizeGroupSpec, type GroupSpec } from "@plugin/card-grouping-settings";
import {
  folderParentPath, folderSiblingOrdersEqual, normalizeFolderDescendingNameSorts, normalizeFolderSiblingOrders,
  orderFolderSiblings, reorderFolderSiblings, resolveFolderSortMode, rewriteFolderSiblingOrders,
  type FolderSiblingOrders, type FolderSortMode,
} from "@plugin/folder-sibling-orders";
import { normalizeExpandedFolderPaths } from "@plugin/navigation-expansion-settings";
import { rewritePathReference } from "@plugin/path-references";
import type { NavMenuDeps } from "@plugin/view/nav-context-menu";
import { openNavigationContextMenu } from "@plugin/view/navigation-host";
import type { NavigationProjectionInput } from "@plugin/view/navigation-model";
import type { PropertyFacet } from "@plugin/view/property-facets";
import type { TagTreeNode } from "@plugin/view/tag-tree";
import type { NavContextMenuPayload } from "@plugin/view/types";
import { getUiStrings, type UiStrings } from "@plugin/i18n";
import { resolveFirstImage } from "@plugin/images/image-source";
import { IMAGE_MAX_BYTES, type CardImageState } from "@plugin/images/types";
import { addIcon, setDemoLanguage } from "../shims/obsidian";
import {
  BULK_ADD_TO_BOX_ICON, BULK_ADD_TO_BOX_ICON_SVG, BULK_REMOVE_FROM_BOX_ICON, BULK_REMOVE_FROM_BOX_ICON_SVG,
  CARD_WORKSPACE_ICON, CARD_WORKSPACE_ICON_SVG, PLAIN_FOLDER_ICON, PLAIN_FOLDER_ICON_SVG,
} from "@plugin/icons";
import { resolvePropertyValueSelection, type PropertyFilterClause } from "@plugin/property-filter-settings";
import { prepareSearchableDocument } from "@plugin/search/document-preparation";
import { buildMatchCountsByPath } from "@plugin/search/match-counts";
import { createMiniSearchOptions, MINISEARCH_SEARCH_OPTIONS } from "@plugin/search/minisearch-options";
import type { SearchableDocument } from "@plugin/search/types";
import { createSearchPreviewMatcher, extractSearchPreviewSnippets, type SearchPreview, type SearchPreviewSnippet } from "@plugin/search";
import { buildGroupBuckets, type CardGroupSegment } from "@plugin/view/card-grouping";
import { createCardRecord } from "@plugin/view/card-record";
import { compareCards } from "@plugin/view/card-sort";
import { GroupCollapseController } from "@plugin/view/controllers/GroupCollapseController";
import type { NavLayoutController } from "@plugin/view/controllers/NavLayoutController";
import { buildNavigationFolderTree } from "@plugin/view/controllers/nav-folder-tree";
import { toggleExpandedKey } from "@plugin/view/controllers/property-nav-expansion";
import { resolveEmptyStateMessage } from "@plugin/view/empty-state";
import { DEFAULT_PREVIEW_MAX_VISIBLE_CHARS, buildLightPreview } from "@plugin/view/markdown-utils";
import { collectScopeTagIndex, getFileFrontmatter } from "@plugin/view/metadata-utils";
import { routeNavigationIntent } from "@plugin/view/navigation-host";
import type { NavigationIntent, NavigationRow } from "@plugin/view/navigation-model";
import { projectNavigation } from "@plugin/view/navigation-projection";
import { buildCardsPanelGroup, buildProjectionPanelGroup } from "@plugin/view/panel-group-state";
import { DEFAULT_SEARCH_PREVIEW_SNIPPET_COUNT } from "@plugin/settings";
import { buildLinksScopeGroupFields, createPanelModel, type PanelModel, type PanelModelState } from "@plugin/view/panel-model";
import { runPipeline, stepsForScope } from "@plugin/view/pipeline";
import { buildPropertyFacets } from "@plugin/view/property-facets";
import { createFolderScope, isLinksScope, normalizeScopePath, scopeDisplayPath, scopeIdentity, type CardScope } from "@plugin/view/scope";
import { collectSupportedFiles } from "@plugin/view/scope-files";
import { resolveSourceCapabilities } from "@plugin/view/source-capabilities";
import { buildTagTree } from "@plugin/view/tag-tree";
import type { NoteCardRecord, Rule } from "@plugin/view/types";
import type { CardWorkspaceData, DemoVault } from "./demo-vault";

addIcon(CARD_WORKSPACE_ICON, CARD_WORKSPACE_ICON_SVG);
addIcon(PLAIN_FOLDER_ICON, PLAIN_FOLDER_ICON_SVG);
addIcon(BULK_ADD_TO_BOX_ICON, BULK_ADD_TO_BOX_ICON_SVG);
addIcon(BULK_REMOVE_FROM_BOX_ICON, BULK_REMOVE_FROM_BOX_ICON_SVG);

type NavSectionId = CardWorkspaceData["preferences"]["navSectionOrder"][number];

export interface DemoRuntimeState {
  scope: CardScope;
  /** Draft text in the toolbar input. */
  query: string;
  /** Query the published cards represent; set by `commitQuery`. */
  committedQuery: string;
  selectedPath: string | null;
  pinnedPaths: string[];
  filterTags: string[];
  propertyFilters: PropertyFilterClause[];
  expandedFolderPaths: string[];
  expandedTagPaths: string[];
  expandedPropertyKeys: string[];
  sectionCollapsed: Record<NavSectionId, boolean>;
  navFocusId: string | null;
  navPaneCollapsed: boolean;
  group: GroupSpec;
  folderSiblingOrders: FolderSiblingOrders;
  folderDescendingNameSorts: string[];
  /** Runtime-only: a pinned links source stops following the active note. */
  linksPinned: boolean;
  /** Settings-tab values a scene changes; `undefined` keeps the snapshot's. */
  cardImageMode?: "off" | "right" | "inline";
  cardImageFit?: "cover" | "contain";
}

/**
 * Search hit snippets per query and path. The plugin extracts them in a
 * time-sliced task while hydrating; scenes replay synchronously, so
 * `prepareSearchPreviews` runs the same extractor ahead of time.
 */
const searchSnippets = new Map<string, SearchPreviewSnippet[]>();
const snippetKey = (query: string, path: string) => `${query.trim()}\n${path}`;

/** `HydrationController.runJob`'s snippet extraction for every note, for each query a scene types. */
export async function prepareSearchPreviews(vault: DemoVault, queries: string[], limit: number): Promise<void> {
  for (const query of queries) {
    const matcher = createSearchPreviewMatcher(query.trim());
    for (const file of vault.files) {
      const snippets = await extractSearchPreviewSnippets(vault.readMarkdown(file.path), {
        limit, maxChars: 200, idPrefix: `demo:${file.path}`, matcher,
      });
      searchSnippets.set(snippetKey(query, file.path), (snippets ?? []).map((snippet) => ({
        ...snippet, id: `demo:${file.path}:${snippet.location.offset}`,
      })));
    }
  }
}

/** The snippet a card's `onOpenNote({ snippetId })` names. */
export function findSearchSnippet(query: string, path: string, id: string): SearchPreviewSnippet | undefined {
  return searchSnippets.get(snippetKey(query, path))?.find((snippet) => snippet.id === id);
}

/** A nav menu action table: the named actions, and a no-op for every other one. */
export function inertActions(actions: Record<string, unknown>): NavMenuDeps["actions"] {
  const inert = () => {};
  return new Proxy(actions, { get: (target, key: string) => target[key] ?? inert }) as unknown as NavMenuDeps["actions"];
}

export class DemoHost {
  readonly strings: UiStrings;
  readonly model: PanelModel;
  private readonly cardsByPath = new Map<string, NoteCardRecord>();
  private readonly documents = new Map<string, SearchableDocument>();
  private index = new MiniSearch<SearchableDocument>(createMiniSearchOptions());
  private readonly imagesByPath: Record<string, CardImageState> = {};
  /** The unordered tag tree and facets the last projection got, as `NavLayoutController.sortingInput`. */
  protected sortingInput: { tags: TagTreeNode[]; properties: PropertyFacet[] } = { tags: [], properties: [] };
  protected state: DemoRuntimeState;
  private baseCards: NoteCardRecord[] = [];
  private orderedPaths: string[] | undefined;
  private matchCounts: Record<string, number> = {};
  private generation = 1;
  private sequenceRevision = 1;
  private readonly groupCollapse = new GroupCollapseController();
  private groupSegments: CardGroupSegment[] = [];
  private groupSignature = "";
  private groupRevision = 0;

  constructor(
    private readonly vault: DemoVault,
    protected readonly settings: CardWorkspaceData,
    language: "zh" | "en",
    initial: Partial<DemoRuntimeState> = {},
  ) {
    setDemoLanguage(language);
    this.strings = getUiStrings(language);
    this.indexVault();

    const { workspace, preferences, userData } = settings;
    this.state = {
      scope: createFolderScope("", preferences.includeSubfolders),
      query: "",
      committedQuery: "",
      selectedPath: null,
      pinnedPaths: [...userData.pinnedPaths],
      filterTags: [],
      propertyFilters: [],
      expandedFolderPaths: [...workspace.expandedFolderPaths],
      expandedTagPaths: [...workspace.expandedTagPaths],
      expandedPropertyKeys: [...workspace.expandedPropertyKeys],
      sectionCollapsed: { ...workspace.sectionCollapsed },
      navFocusId: null,
      navPaneCollapsed: workspace.navPaneCollapsed ?? false,
      group: normalizeGroupSpec(preferences.group),
      folderSiblingOrders: normalizeFolderSiblingOrders(userData.folderSiblingOrders),
      folderDescendingNameSorts: normalizeFolderDescendingNameSorts(userData.folderDescendingNameSorts),
      linksPinned: false,
      ...initial,
    };
    this.loadScope();
    if (this.state.committedQuery) this.runSearch(this.state.committedQuery);
    this.model = createPanelModel(this.buildState());
  }

  /** Card records, search documents, and images for every note at its current path. */
  private indexVault(): void {
    const { vault } = this;
    const { previewLines } = this.settings.preferences;
    this.cardsByPath.clear();
    this.documents.clear();
    for (const key of Object.keys(this.imagesByPath)) delete this.imagesByPath[key];
    for (const file of vault.files) {
      const markdown = vault.readMarkdown(file.path);
      const preview = buildLightPreview(markdown, DEFAULT_PREVIEW_MAX_VISIBLE_CHARS, previewLines);
      this.cardsByPath.set(file.path, {
        ...createCardRecord(vault.app, file, "markdown"),
        previewHtml: preview.html,
        previewMode: preview.mode,
        hydrated: true,
      });
      this.documents.set(file.path, prepareSearchableDocument({
        path: file.path, title: file.basename, markdown,
        mtime: file.stat.mtime, ctime: file.stat.ctime,
      }));
      // Thumbnails are cached in Obsidian; the stage serves the attachment itself.
      const image = resolveFirstImage(vault.app, file);
      if (image.status === "found" && image.file.stat.size > 0 && image.file.stat.size <= IMAGE_MAX_BYTES) {
        this.imagesByPath[file.path] = { status: "ready", url: vault.resourceUrl(image.file) };
      }
    }
    this.index = new MiniSearch<SearchableDocument>(createMiniSearchOptions());
    this.index.addAll([...this.documents.values()]);
  }

  /** A note appeared on disk: re-read the vault and republish, as the vault-event reconciler does. */
  reindex(): void {
    this.indexVault();
    this.loadScope();
    this.runSearch(this.state.committedQuery);
    this.publishAll();
  }

  get runtime(): Readonly<DemoRuntimeState> {
    return this.state;
  }

  setDraftQuery(query: string): void {
    this.state = { ...this.state, query };
    this.model.mutate((draft) => {
      draft.search = this.buildState().search;
    });
  }

  /** Mirrors the search controller's debounced commit, on the scene's schedule. */
  commitQuery(): void {
    this.state = { ...this.state, committedQuery: this.state.query };
    this.runSearch(this.state.committedQuery);
    this.publishAll();
  }

  update(patch: Partial<DemoRuntimeState>): void {
    const scopeChanged = patch.scope !== undefined && scopeIdentity(patch.scope) !== scopeIdentity(this.state.scope);
    this.state = { ...this.state, ...patch };
    if (scopeChanged) {
      this.loadScope();
      this.runSearch(this.state.committedQuery);
    }
    this.publishAll();
  }

  /** Mirrors `FolderCardView.selectFolderFromNav`: folder-to-folder moves reset browse filters. */
  selectFolder(path: string): void {
    const target = normalizeScopePath(path);
    const { scope } = this.state;
    const leaving = scope.kind === "folder" && scope.path !== target;
    this.update({
      scope: createFolderScope(target, this.settings.preferences.includeSubfolders),
      ...(leaving ? { filterTags: [], propertyFilters: [] } : {}),
    });
  }

  handleNavigationIntent(intent: NavigationIntent): void {
    const navLayout = {
      updateQuery: () => {},
      clearQuery: () => {},
      consumeReveal: () => {},
      consumeFocusReturn: () => {},
      setFocus: (rowId: string | null) => this.setNavFocus(rowId),
      getProjection: () => this.model.getState().nav.projection,
      setExpanded: (row: NavigationRow, expanded: boolean) => this.setExpanded(row, expanded),
      isDisposed: () => false,
      reorderFolders: (source: string, target: string, position: "before" | "after") => this.reorderFolders(source, target, position),
      // Scenes never hover a drop inside a collapsed folder, so no drag expansion is pending.
      expandFolderForDrag: () => {},
      clearFolderDrag: () => {},
      ...this.navLayoutExtras(),
    } as unknown as NavLayoutController;
    routeNavigationIntent({
      intent,
      navLayout,
      scope: this.state.scope,
      activeTags: this.state.filterTags,
      selectFolder: (path) => this.selectFolder(path),
      switchBox: (boxId) => this.switchBox(boxId),
      applyTagFilter: (tags) => this.applyTagFilter(tags),
      activateFavorite: () => {},
      selectPropertyValue: (key, ref, additive) => this.applyPropertyFilters(
        resolvePropertyValueSelection(this.state.propertyFilters, key, ref, additive),
      ),
      moveFolder: (source, target) => this.moveFolder(source, target),
      selectLinksDirection: (direction) => this.selectLinksDirection(direction),
    });
  }

  /** `openNavigationContextMenu` with the menu deps the stage can answer; other actions are inert. */
  openNavContextMenu(payload: NavContextMenuPayload): void {
    openNavigationContextMenu({ payload, disposed: false, targetCurrent: true, deps: this.navMenuDeps(), restoreFocus: () => {} });
  }

  /** Navigation intents a subclass answers on top of the folder ones. */
  protected navLayoutExtras(): Record<string, unknown> {
    return {};
  }

  /** Projection inputs a subclass adds, e.g. tag and property orders. */
  protected projectionExtras(): Partial<NavigationProjectionInput> {
    return {};
  }

  protected navMenuDeps(): NavMenuDeps {
    const { preferences } = this.settings;
    const { scope, filterTags, propertyFilters } = this.state;
    const capabilities = resolveSourceCapabilities(scope);
    const rows = this.model.getState().nav.projection.rows;
    const inert = () => {};
    const actions = inertActions({
      sortFolderNameOrder: (parent: string, direction: FolderSortMode) => this.sortFolderNameOrder(parent, direction),
      revealActiveFileFolder: () => null,
    });
    return {
      strings: this.strings,
      browseTagFilter: capabilities.browseTagFilter,
      browsePropertyFilter: capabilities.browsePropertyFilter,
      supportsIncludeSubfolders: capabilities.supportsIncludeSubfolders,
      supportsBoxRuleSeeding: capabilities.supportsBoxRuleSeeding,
      includeSubfolders: preferences.includeSubfolders,
      activeFilterTags: filterTags,
      propertyFilterCount: propertyFilters.reduce((total, clause) => total + clause.values.length, 0),
      isPropertyValueActive: () => false,
      canResolveSystemPath: true,
      hasActiveFile: true,
      favorites: [],
      boxes: [],
      activeBoxId: null,
      boxExcludedCount: () => 0,
      sectionCollapsed: this.state.sectionCollapsed,
      sectionOrder: preferences.navSectionOrder,
      hiddenSections: this.settings.userData.hiddenNavSections ?? [],
      folderSortMode: (parent: string) => resolveFolderSortMode(this.state.folderSiblingOrders, parent, this.state.folderDescendingNameSorts),
      hasExpandedFolders: rows.some((row) => row.kind === "folder" && row.expanded),
      hasExpandedTags: rows.some((row) => row.kind === "tag" && row.expanded),
      hasExpandedProperties: rows.some((row) => row.kind === "property" && row.expanded),
      tagExpansion: (tag: string) => {
        const row = rows.find((candidate) => candidate.kind === "tag" && candidate.tagPath === tag);
        return { hasChildren: Boolean(row?.expandable), expanded: Boolean(row?.expanded) };
      },
      expansionActions: { toggleAllFolders: inert, toggleAllTags: inert, toggleAllProperties: inert, toggleTag: inert },
      actions,
      // Newer plugins add tag and property sort modes; NavSortDemoHost supplies them.
    } as unknown as NavMenuDeps;
  }

  /** `FolderActions.moveFolderTo`, then the `NavigationWorkspaceReconciler` rename arm and the scope rewrite. */
  private moveFolder(sourcePath: string, targetFolderPath: string): void {
    const vault = this.vault.app.vault;
    const folder = vault.getAbstractFileByPath(normalizeScopePath(sourcePath));
    const target = vault.getAbstractFileByPath(normalizeScopePath(targetFolderPath));
    if (!(folder instanceof TFolder) || !(target instanceof TFolder) || folder.path === "") return;
    const source = folder.path;
    if ((folder.parent?.path ?? "") === target.path || target.path === source || target.path.startsWith(`${source}/`)) return;
    const nextPath = target.path === "" ? folder.name : `${target.path}/${folder.name}`;
    if (vault.getAbstractFileByPath(nextPath)) return;
    this.vault.renameFolder(source, nextPath);
    const rewrite = (path: string) => rewritePathReference(path, source, nextPath);
    const { scope } = this.state;
    this.state = {
      ...this.state,
      expandedFolderPaths: normalizeExpandedFolderPaths(this.state.expandedFolderPaths.map(rewrite)),
      folderSiblingOrders: rewriteFolderSiblingOrders(this.state.folderSiblingOrders, source, nextPath),
      folderDescendingNameSorts: normalizeFolderDescendingNameSorts(this.state.folderDescendingNameSorts.map(rewrite)),
      scope: scope.kind === "folder" ? createFolderScope(rewrite(scope.path), scope.includeSubfolders) : scope,
    };
    this.indexVault();
    this.loadScope();
    this.runSearch(this.state.committedQuery);
    this.publishAll();
  }

  private folderChildren(parent: string): TFolder[] | null {
    const vault = this.vault.app.vault;
    const folder = parent === "" ? vault.getRoot() : vault.getAbstractFileByPath(parent);
    if (!(folder instanceof TFolder)) return null;
    return folder.children.filter((child): child is TFolder => child instanceof TFolder);
  }

  /** `NavLayoutController.reorderFolders`. */
  private reorderFolders(sourcePath: string, targetPath: string, position: "before" | "after"): void {
    if (!sourcePath || !targetPath || sourcePath === targetPath || folderParentPath(sourcePath) !== folderParentPath(targetPath)) return;
    const parent = folderParentPath(sourcePath);
    const siblings = this.folderChildren(parent)?.sort((left, right) => left.name.localeCompare(right.name));
    if (!siblings) return;
    const fullOrder = orderFolderSiblings(siblings, this.state.folderSiblingOrders, parent).map((folder) => folder.path);
    if (!fullOrder.includes(sourcePath) || !fullOrder.includes(targetPath)) return;
    const next = reorderFolderSiblings(fullOrder, sourcePath, targetPath, position);
    const descending = this.state.folderDescendingNameSorts;
    if (next === null && !descending.includes(parent)) return;
    this.update({
      folderSiblingOrders: { ...this.state.folderSiblingOrders, [parent]: next ?? fullOrder },
      folderDescendingNameSorts: descending.filter((path) => path !== parent),
    });
  }

  /** `NavLayoutController.sortFolderNameOrder`. */
  private sortFolderNameOrder(parent: string, direction: FolderSortMode): void {
    const children = this.folderChildren(parent);
    if (!children) return;
    const orders = this.state.folderSiblingOrders;
    const descending = this.state.folderDescendingNameSorts;
    const next = { ...orders };
    let nextDescending = descending.filter((path) => path !== parent);
    if (direction === "asc") {
      delete next[parent];
    } else if (direction === "desc") {
      next[parent] = [...children].sort((left, right) => right.name.localeCompare(left.name)).map((folder) => folder.path);
      nextDescending = normalizeFolderDescendingNameSorts([...nextDescending, parent]);
    } else {
      const siblings = [...children].sort((left, right) => left.name.localeCompare(right.name));
      next[parent] = orderFolderSiblings(siblings, orders, parent).map((folder) => folder.path);
    }
    if (folderSiblingOrdersEqual(orders, next) && descending.join("\n") === nextDescending.join("\n")) return;
    this.update({ folderSiblingOrders: next, folderDescendingNameSorts: nextDescending });
  }

  /** Mirrors `TagActions.applyTagFilter`: tag and property filters are peers, so a tag selection clears property clauses. */
  private applyTagFilter(tags: string[]): void {
    this.update(tags.length > 0 ? { filterTags: tags, propertyFilters: [] } : { filterTags: tags });
  }

  /** Mirrors the property actions' clause save: a property selection clears the tag filter. */
  private applyPropertyFilters(clauses: PropertyFilterClause[]): void {
    this.update(clauses.length > 0 ? { filterTags: [], propertyFilters: clauses } : { propertyFilters: clauses });
  }

  /** A settings-tab image change: `update-intent` grades it a patch, so only appearance republishes. */
  setImageAppearance(patch: Pick<DemoRuntimeState, "cardImageMode" | "cardImageFit">): void {
    this.state = { ...this.state, ...patch };
    this.model.mutate((draft) => {
      draft.appearance = this.buildState().appearance;
    });
  }

  /** The global-owner arm of `ArrangementActions.onGroupChange`: the settings write reprojects. */
  setGroup(detail: Partial<GroupSpec>): void {
    const current = this.state.group;
    const dimension = detail.dimension ?? current.dimension;
    const group = normalizeGroupSpec({
      ...current,
      ...detail,
      propertyKey: dimension === "property" ? detail.propertyKey ?? current.propertyKey : undefined,
    });
    if (dimension === "property" && !this.settings.preferences.visiblePropertyKeys.includes(group.propertyKey ?? "")) return;
    this.update({ group });
  }

  /** `ArrangementActions.onGroupCollapseCommand`: runtime-only collapse state, then reproject cards. */
  groupCollapseCommand(detail: { command?: unknown; key?: unknown }): void {
    const { scope } = this.state;
    const { group } = this.arrangement();
    switch (detail.command) {
      case "toggle":
        if (typeof detail.key !== "string" || detail.key.length === 0) return;
        this.groupCollapse.toggle(scope, group, detail.key);
        break;
      case "collapse-all":
        this.groupCollapse.collapseAll(scope, group, this.groupSegments.map((segment) => segment.key));
        break;
      case "expand-all":
        this.groupCollapse.expandAll(scope, group);
        break;
      default:
        return;
    }
    const next = this.buildState();
    this.model.batch((draft) => {
      draft.cards = next.cards;
      draft.bulk = next.bulk;
    });
  }

  /** The dual-layout arm of `NavLayoutController.onToggleNavPane`. */
  toggleNavPane(): void {
    this.state = { ...this.state, navPaneCollapsed: !this.state.navPaneCollapsed };
    this.model.mutate((draft) => {
      draft.nav = this.buildState().nav;
    });
  }

  private setNavFocus(rowId: string | null): void {
    if (rowId === this.state.navFocusId) return;
    this.state = { ...this.state, navFocusId: rowId };
    this.model.mutate((draft) => {
      draft.nav = this.buildState().nav;
    });
  }

  /** The persisted-expansion arm of `NavLayoutController.setExpanded` (no nav query in the stage). */
  private setExpanded(row: NavigationRow, expanded: boolean): void {
    if (!row.expandable || row.expanded === expanded) return;
    const { state } = this;
    if (row.kind === "section") {
      this.update({ sectionCollapsed: { ...state.sectionCollapsed, [row.section]: !expanded } });
    } else if (row.kind === "property") {
      this.update({ expandedPropertyKeys: toggleExpandedKey(state.expandedPropertyKeys, row.propertyKey, expanded) });
    } else if (row.kind === "folder") {
      this.update({ expandedFolderPaths: toggleExpandedKey(state.expandedFolderPaths, row.folderPath, expanded) });
    } else if (row.kind === "tag") {
      this.update({ expandedTagPaths: toggleExpandedKey(state.expandedTagPaths, row.tagPath, expanded) });
    }
  }

  /** The sort, grouping, and pins the current scope projects with (`resolveViewConfig`). */
  protected arrangement(): { sort: CardWorkspaceData["preferences"]["sort"]; group: GroupSpec; pinnedPaths: string[] } {
    return { sort: this.settings.preferences.sort, group: this.state.group, pinnedPaths: this.state.pinnedPaths };
  }

  /** Candidate files of a scope; folder scopes only unless a subclass resolves boxes. */
  protected scopeFiles(scope: CardScope): TFile[] {
    return scope.kind === "folder" ? collectSupportedFiles(this.vault.app, scope.path, scope.includeSubfolders) : [];
  }

  /** Rules the box-rule grouping dimension buckets by. */
  protected boxRules(): Rule[] {
    return [];
  }

  protected boxSummaries(): Array<{ id: string; name: string; cardCount: number }> {
    return this.settings.userData.boxes.map((box) => ({
      id: box.id,
      name: box.name,
      cardCount: box.manualPaths.filter((path) => this.documents.has(path)).length,
    }));
  }

  /** The navigation's box rows; scenes without boxes ignore them. */
  protected switchBox(_boxId: string): void {}

  /** The navigation's links rows; scenes without links ignore them. */
  protected selectLinksDirection(_direction: "backlinks" | "outgoing"): void {}

  /** A scope's base card, before sorting; links scopes add their reference fields. */
  protected scopeRecord(card: NoteCardRecord): NoteCardRecord {
    return card;
  }

  protected loadScope(): void {
    const { sort } = this.arrangement();
    const files = this.scopeFiles(this.state.scope);
    this.baseCards = files
      .map((file) => this.cardsByPath.get(file.path))
      .filter((card): card is NoteCardRecord => card !== undefined)
      .map((card) => this.scopeRecord(card))
      .sort((left, right) => compareCards(left, right, sort.field, sort.direction));
    this.generation += 1;
  }

  protected publishAll(): void {
    this.sequenceRevision += 1;
    const next = this.buildState();
    this.model.batch((draft) => {
      draft.scope = next.scope;
      draft.cards = next.cards;
      draft.search = next.search;
      draft.projection = next.projection;
      draft.nav = next.nav;
      draft.images = next.images;
    });
  }

  private runSearch(query: string): void {
    const trimmed = query.trim();
    if (!trimmed) {
      this.orderedPaths = undefined;
      this.matchCounts = {};
      return;
    }
    const allowed = new Set(this.baseCards.map((card) => card.path));
    const ordered = this.index.search(trimmed, MINISEARCH_SEARCH_OPTIONS)
      .map((result) => String(result.id))
      .filter((path) => allowed.has(path));
    this.orderedPaths = ordered;
    this.matchCounts = buildMatchCountsByPath(trimmed, ordered, this.documents) ?? {};
  }

  /** `HydrationController.searchPreviewFor` with the prepared snippets; title-only hits keep the ordinary preview. */
  private withSearchPreview(card: NoteCardRecord): NoteCardRecord {
    const query = this.state.committedQuery.trim();
    if (!query) return card;
    const snippets = searchSnippets.get(snippetKey(query, card.path));
    if (!snippets) throw new Error(`No prepared search snippets for "${query}"; call prepareSearchPreviews first`);
    const { preferences } = this.settings;
    const searchPreview: SearchPreview = {
      query,
      revision: 0,
      mtime: card.mtime,
      previewLines: preferences.previewLines,
      snippetLimit: preferences.searchPreviewSnippetCount ?? DEFAULT_SEARCH_PREVIEW_SNIPPET_COUNT,
      status: snippets.length > 0 ? "hits" : "title-only",
      snippets,
    };
    return { ...card, searchPreview };
  }

  protected buildState(): PanelModelState {
    const { app } = this.vault;
    const { preferences, workspace, userData } = this.settings;
    const { scope, selectedPath, filterTags, propertyFilters } = this.state;
    const { sort, group, pinnedPaths } = this.arrangement();
    const strings = this.strings;
    const capabilities = resolveSourceCapabilities(scope);
    const activeTags = capabilities.browseTagFilter ? filterTags : [];
    const activeClauses = capabilities.browsePropertyFilter ? propertyFilters : [];

    // `ProjectionController` buckets the full base-card set with the localized labels.
    const groupStrings = strings.sortGroup;
    const buckets = buildGroupBuckets(app, this.baseCards, group, this.boxRules(), {
      vaultRoot: groupStrings.bucketVaultRoot,
      noTag: groupStrings.bucketNoTag,
      noTask: groupStrings.bucketNoTask,
      manual: groupStrings.bucketManual,
    }, strings);
    const pipeline = runPipeline([...this.baseCards], stepsForScope(scope), {
      app,
      filterTags: activeTags,
      propertyFilters: activeClauses,
      search: { query: this.state.committedQuery, execution: "indexed-ready", orderedPaths: this.orderedPaths },
      pinnedPaths,
      group: { spec: group, buckets },
      collapsedGroupKeys: this.groupCollapse.getCollapsedKeys(scope, group),
    });
    this.groupSegments = pipeline.segments;
    const signature = pipeline.segments
      .map((segment) => `${segment.key}:${segment.visibleCount}:${segment.label}:${segment.collapsed}`)
      .join("|");
    if (signature !== this.groupSignature) {
      this.groupSignature = signature;
      this.groupRevision += 1;
    }

    const tagIndex = collectScopeTagIndex(app, this.baseCards.map((card) => card.file));
    const projection = buildProjectionPanelGroup({
      sortField: sort.field,
      sortDirection: sort.direction,
      deriveAvailableTags: () => tagIndex.availableTags,
      deriveTagCounts: () => tagIndex.tagCounts,
      activeFilterTags: filterTags,
      pinnedPaths,
      group,
      availableGroupDimensions: [...capabilities.groupDimensions],
      groupSegmentCount: pipeline.segments.length,
    });

    const propertyFacets = buildPropertyFacets(
      this.baseCards, preferences.visiblePropertyKeys, propertyFilters,
      (file) => getFileFrontmatter(app, file), strings.property,
    );
    const folderTree = buildNavigationFolderTree(app);
    const boxSummaries = this.boxSummaries();
    const includeSubfolders = scope.kind === "folder" ? scope.includeSubfolders : preferences.includeSubfolders;
    const sectionCollapsed = this.state.sectionCollapsed;
    const tags = buildTagTree(tagIndex.availableTags);
    this.sortingInput = { tags, properties: propertyFacets };
    const navProjection = projectNavigation({
      hiddenNavSections: userData.hiddenNavSections ?? [],
      folderSiblingOrders: this.state.folderSiblingOrders,
      ...this.projectionExtras(),
      query: "",
      scope,
      activeTags: filterTags,
      selectedPath,
      favorites: [],
      folders: folderTree,
      tags,
      boxes: boxSummaries,
      tagCounts: tagIndex.tagCounts,
      includeSubfolders,
      tagsDisabled: !capabilities.browseTagFilter,
      propertiesDisabled: !capabilities.browsePropertyFilter,
      sectionCollapsed,
      sectionOrder: preferences.navSectionOrder,
      sectionLabels: {
        favorites: { label: strings.toolbar.navPane.favoritesSection, emptyLabel: strings.toolbar.navPane.favoritesEmpty },
        folders: { label: strings.toolbar.navPane.foldersSection, emptyLabel: null },
        tags: { label: strings.toolbar.navPane.tagsSection, emptyLabel: null },
        properties: { label: strings.property.sectionLabel, emptyLabel: strings.property.sectionEmpty },
        boxes: { label: strings.toolbar.navPane.boxesSection, emptyLabel: strings.toolbar.navPane.boxesEmpty },
        links: { label: strings.links.sectionLabel, emptyLabel: null },
      },
      rootFolderLabel: strings.toolbar.folderMenu.rootFolder,
      expansion: {
        folders: { manual: this.state.expandedFolderPaths, reveal: [], query: [], suppressed: [] },
        tags: { manual: this.state.expandedTagPaths, reveal: [], query: [], suppressed: [] },
        properties: { manual: this.state.expandedPropertyKeys, reveal: [], query: [], suppressed: [] },
        queryCollapsedSections: [],
      },
      properties: propertyFacets,
      propertyClauses: propertyFilters,
      linksLeafLabels: { backlinks: strings.links.directionBacklinks, outgoing: strings.links.directionOutgoing },
      linksDisabled: !isLinksScope(scope) && selectedPath === null,
    });

    const displayPath = scopeDisplayPath(scope);
    return {
      strings,
      scope: {
        displayPath: displayPath === "" ? "/" : displayPath,
        includeSubfolders,
        activeBoxId: scope.kind === "box" ? scope.boxId : null,
        activeBoxName: scope.kind === "box" ? userData.boxes.find((box) => box.id === scope.boxId)?.name ?? null : null,
        boxExcludedCount: 0,
        emptyStateMessage: resolveEmptyStateMessage({
          strings, query: this.state.committedQuery.trim(), activeTagCount: activeTags.length,
          baseCardCount: this.baseCards.length, visibleCardCount: pipeline.cards.length,
          propertyClauseCount: activeClauses.length,
        }),
        sourceIdentity: scopeIdentity(scope),
        browseTagFilterEnabled: capabilities.browseTagFilter,
        browsePropertyFilterEnabled: capabilities.browsePropertyFilter,
        supportsIncludeSubfolders: capabilities.supportsIncludeSubfolders,
        supportsBoxRuleSeeding: capabilities.supportsBoxRuleSeeding,
        ...buildLinksScopeGroupFields(scope, { getLinksPinned: () => this.state.linksPinned }, strings),
      },
      cards: buildCardsPanelGroup({
        records: pipeline.cards.map((card) => this.withSearchPreview(card)),
        searchMatchCountsByPath: this.matchCounts,
        selectedPath,
        loading: false,
        generation: this.generation,
        sequenceRevision: this.sequenceRevision,
        hydrationRevision: 1,
        groupSegments: pipeline.segments,
        groupRevision: this.groupRevision,
      }),
      search: {
        history: [],
        query: this.state.query,
        committedQuery: this.state.committedQuery,
        status: "ready",
        focusToken: 0,
      },
      projection,
      bulk: {
        bulkMode: false, selectedPaths: [], selectedCount: 0, bulkAnchorPath: null,
        canBulkSelectAll: false, canBulkClearSelection: false, canBulkMoveSelected: false,
        canBulkAddTagSelected: false, canBulkRemoveTagSelected: false, canBulkDeleteSelected: false,
        canBulkMergeSelected: false,
      },
      nav: {
        folderTree,
        favorites: [],
        boxSummaries,
        paneWidth: workspace.navPaneWidth,
        layoutMode: "dual",
        visible: !this.state.navPaneCollapsed,
        sectionCollapsed,
        showItemCounts: preferences.showNavItemCounts,
        tooltipSide: "right",
        propertyFilterCount: propertyFilters.reduce((total, clause) => total + clause.values.length, 0),
        visibleGroupProperties: propertyFacets.map(({ key, label }) => ({ key, label })),
        projection: navProjection,
        query: "",
        focusId: this.state.navFocusId,
        focusRequest: null,
        revealRequest: null,
      },
      appearance: {
        cardCornerRadius: preferences.cardCornerRadius,
        previewLines: preferences.previewLines,
        cardImageMode: this.state.cardImageMode ?? preferences.cardImageMode ?? "off",
        cardImageFit: this.state.cardImageFit ?? preferences.cardImageFit ?? "cover",
        searchPreviewSnippetCount: preferences.searchPreviewSnippetCount ?? DEFAULT_SEARCH_PREVIEW_SNIPPET_COUNT,
      },
      images: { byPath: this.imagesByPath, requestVersion: 1, generation: this.generation },
    };
  }
}
