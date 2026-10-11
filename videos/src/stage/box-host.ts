// DemoHost with card boxes and bulk mode: the plugin's own BoxActions,
// BulkController, MergeActions, and CardContextMenu run against a ViewContext
// the stage answers. Box definitions
// live in `settings.userData.boxes`, so a scene clones the snapshot settings per
// mount. Every box write goes through BoxActions and its dialogs; the host only
// persists the patch and reloads, as the update intent would.
import { addIcon, TFile, TFolder, normalizePath } from "obsidian";
import { normalizeGroupSpec, type GroupSpec } from "@plugin/card-grouping-settings";
import { DEFAULT_SETTINGS, type PartialPluginSettings, type PluginSettings } from "@plugin/settings";
import { BoxActions } from "@plugin/view/actions/box-actions";
import { MergeActions } from "@plugin/view/actions/merge-actions";
import { findCardBox } from "@plugin/view/card-boxes";
import { BulkController } from "@plugin/view/controllers/BulkController";
import { CardContextMenu, isMouseEventLike } from "@plugin/view/menus/card-context-menu";
import { resolveBrowseFiltersPaused, type PanelModelState } from "@plugin/view/panel-model";
import { createBoxScope, isBoxScope, type CardScope } from "@plugin/view/scope";
import { collectSupportedFiles } from "@plugin/view/scope-files";
import type { CardBoxDefinition, FolderSelectionRequest, Rule, SelectionResult } from "@plugin/view/types";
import type { ViewContext } from "@plugin/view/view-context";
import {
  BULK_ADD_TO_BOX_ICON, BULK_ADD_TO_BOX_ICON_SVG, BULK_REMOVE_FROM_BOX_ICON, BULK_REMOVE_FROM_BOX_ICON_SVG,
} from "@plugin/icons";
import { DemoHost, type DemoRuntimeState } from "./demo-host";
import type { CardWorkspaceData, DemoVault } from "./demo-vault";

// The plugin registers these in `onload`; the tag pair is private to main.ts.
const TABLER_ICON_SCALE = 4.1666666667;
addIcon(BULK_ADD_TO_BOX_ICON, BULK_ADD_TO_BOX_ICON_SVG);
addIcon(BULK_REMOVE_FROM_BOX_ICON, BULK_REMOVE_FROM_BOX_ICON_SVG);
addIcon("card-workspace-tag-plus", `<g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" transform="scale(${TABLER_ICON_SCALE})"><path d="M6.5 7.5a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" /><path d="M21.002 13c0 -.617 -.235 -1.233 -.706 -1.704l-7.71 -7.71c-.375 -.375 -.884 -.586 -1.414 -.586h-5.172c-1.657 0 -3 1.343 -3 3v5.172c0 .53 .211 1.039 .586 1.414l7.71 7.71c.471 .47 1.087 .706 1.704 .706" /><path d="M16 19h6" /><path d="M19 16v6" /></g>`);
addIcon("card-workspace-tag-minus", `<g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" transform="scale(${TABLER_ICON_SCALE})"><path d="M6.5 7.5a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" /><path d="M18.898 16.102l.699 -.699l.699 -.699c.941 -.941 .941 -2.467 0 -3.408l-7.71 -7.71c-.375 -.375 -.884 -.586 -1.414 -.586h-5.172c-1.657 0 -3 1.343 -3 3v5.172c0 .53 .211 1.039 .586 1.414l7.71 7.71c.471 .47 1.087 .706 1.704 .706" /><path d="M16 19h6" /></g>`);

export class BoxDemoHost extends DemoHost {
  readonly boxActions: BoxActions;
  readonly bulk: BulkController;
  readonly cardMenu: CardContextMenu;
  readonly merge: MergeActions;
  private lastFolderPath = "";

  constructor(vault: DemoVault, settings: CardWorkspaceData, language: "zh" | "en", initial: Partial<DemoRuntimeState> = {}) {
    super(vault, settings, language, initial);
    const { app } = vault;
    const liveFile = (path: string): TFile | null => {
      const file = app.vault.getAbstractFileByPath(path);
      return file instanceof TFile ? file : null;
    };
    const context = {
      getApp: () => app,
      store: {
        getScope: () => this.state.scope,
        getVisibleCards: () => this.model.getState().cards.records,
      },
      getSettings: () => this.flatSettings(),
      saveSettings: async (patch: PartialPluginSettings) => this.persist(patch),
      getUiStrings: () => this.strings,
      publishGroups: () => this.publishAll(),
      requestUpdate: async () => this.reload(),
      notify: () => {},
      getViewWindow: () => window,
    } as unknown as ViewContext;
    const loaded = (scope: CardScope): SelectionResult => ({ action: "started", scope, generationChanged: true, preserveUiState: false });

    this.bulk = new BulkController({
      context,
      getOrderedVisiblePaths: () => this.visiblePaths(),
      resolveLiveMarkdownFile: liveFile,
      publishSelection: () => this.publishSelection(),
      openNote: () => {},
    });
    this.boxActions = new BoxActions({
      context,
      getSelectedPaths: () => this.bulk.getSelectedPaths(),
      getOrderedVisiblePaths: () => this.visiblePaths(),
      isMouseEventLike,
      resolveFolderFromUiPath: (path) => {
        const folder = path === "" || path === "/" ? app.vault.getRoot() : app.vault.getAbstractFileByPath(normalizePath(path));
        return folder instanceof TFolder ? folder : null;
      },
      collectSupportedFiles: (folder, includeSubfolders) => collectSupportedFiles(app, folder, includeSubfolders),
      createProgrammaticSelectionRequest: (scope) => ({ requestId: 0, scope, source: "programmatic", requestedAtMs: 0 }) as unknown as FolderSelectionRequest,
      handleScopeSelection: async (request) => {
        this.update({ scope: request.scope });
        return loaded(request.scope);
      },
      moveScopeToFolder: async (path) => {
        this.selectFolder(path);
        return loaded(this.state.scope);
      },
      returnToCardsViewIfSinglePane: () => {},
    });
    const inert = async () => {};
    const favoriteLabel = this.strings.view.navMenu.favorite;
    this.cardMenu = new CardContextMenu({
      context,
      resolveLiveMarkdownFile: liveFile,
      isBoxMode: () => this.boxActions.isBoxMode(),
      appendAddToBoxMenu: (menu, paths) => this.boxActions.appendAddToBoxMenu(menu, paths),
      appendCardFavoriteMenuItem: (menu) => menu.addItem((item) => item.setTitle(favoriteLabel).setIcon("star")),
      removeMemberFromActiveBox: (path) => this.boxActions.removeMemberFromActiveBox(path),
      copyCardTitle: inert,
      copyCardContent: inert,
      copyCardTitleAndContent: inert,
      makeCardFileCopy: inert,
      moveCardNote: () => {},
      renameCardFile: () => {},
      deleteCardFile: inert,
      openSingleTagModal: () => {},
      openCardWithDestination: () => {},
    });
    this.merge = new MergeActions({
      context,
      getBulkMode: () => this.bulk.isBulkMode(),
      getSelectedPaths: () => this.bulk.getSelectedPaths(),
      setSelectedPaths: (paths) => this.bulk.setSelectedPaths(paths),
      setBulkAnchorPath: (path) => this.bulk.setAnchorPath(path),
      publishSelection: () => this.publishSelection(),
      reconcileSelectionToOrderedPaths: (paths) => this.bulk.reconcileSelectionToOrderedPaths(paths),
      resolveSelectedLiveFilesInOrder: () => this.bulk.resolveSelectedLiveFilesInOrder(),
    });
    vault.onCreate(() => this.reindex());
    // The base constructor published before the controllers existed.
    this.publishAll();
  }

  /** Panel callbacks for boxes, bulk mode, and the card menu, on top of `mountPanel`'s. */
  panelCallbacks(): Record<string, unknown> {
    return {
      onBoxCommand: (detail: { command?: unknown; boxId?: unknown }) => this.boxActions.handleBoxCommand(detail),
      onBulkSelectCard: (detail: { path?: unknown; shiftKey?: unknown }) => this.bulk.onBulkSelectCard(detail),
      onCardContextMenu: (detail: { path?: unknown; mouseEvent?: unknown; trigger?: unknown; position?: unknown }) =>
        this.cardMenu.open({ notePath: detail.path, trigger: detail.trigger, mouseEvent: detail.mouseEvent, position: detail.position }),
      onToolbarAction: ({ action }: { action?: unknown }) => {
        switch (action) {
          case "bulk": this.bulk.toggleBulkMode(); break;
          case "bulk-select-all": this.bulk.bulkSelectAll(); break;
          case "bulk-clear-selection": this.bulk.bulkClearSelection(); break;
          case "bulk-add-to-box": this.boxActions.bulkAddToBox(); break;
          case "bulk-remove-from-box": void this.boxActions.bulkRemoveFromBox(); break;
          case "bulk-merge-selected": this.merge.bulkMergeSelected(); break;
        }
      },
    };
  }

  get boxes(): CardBoxDefinition[] {
    return this.settings.userData.boxes as unknown as CardBoxDefinition[];
  }

  private activeBox(): CardBoxDefinition | null {
    const { scope } = this.state;
    return isBoxScope(scope) ? findCardBox(this.boxes, scope.boxId) : null;
  }

  /** The flattened settings view BoxActions reads, derived from the runtime state. */
  private flatSettings(): PluginSettings {
    const { preferences } = this.settings;
    const { scope, filterTags, propertyFilters, pinnedPaths, group } = this.state;
    return {
      ...DEFAULT_SETTINGS,
      sort: preferences.sort,
      group,
      filter: { tags: filterTags, properties: propertyFilters },
      pinnedPaths,
      includeSubfolders: preferences.includeSubfolders,
      visiblePropertyKeys: preferences.visiblePropertyKeys,
      boxes: this.boxes,
      favorites: [],
      lastFolderPath: this.lastFolderPath,
      activeBoxId: isBoxScope(scope) ? scope.boxId : null,
    };
  }

  /** A settings write: boxes replace the stored list, then the scope reloads as the update intent would. */
  private persist(patch: PartialPluginSettings): void {
    if (patch.boxes) this.settings.userData.boxes = patch.boxes as unknown as CardWorkspaceData["userData"]["boxes"];
    this.boxActions.invalidateCache();
    this.reload();
  }

  private reload(): void {
    this.loadScope();
    this.publishAll();
    this.bulk.reconcileToVisibleCards();
    this.publishSelection();
  }

  private visiblePaths(): string[] {
    return this.model.getState().cards.records.map((record) => record.path);
  }

  protected override loadScope(): void {
    if (this.state.scope.kind === "folder") this.lastFolderPath = this.state.scope.path;
    super.loadScope();
  }

  protected override scopeFiles(scope: CardScope): TFile[] {
    return isBoxScope(scope) ? this.boxActions.collectBoxFilesById(scope.boxId) : super.scopeFiles(scope);
  }

  protected override arrangement(): { sort: CardWorkspaceData["preferences"]["sort"]; group: GroupSpec; pinnedPaths: string[] } {
    const box = this.activeBox();
    return box
      ? { sort: box.sort, group: normalizeGroupSpec(box.group), pinnedPaths: box.pinnedPaths }
      : super.arrangement();
  }

  protected override boxRules(): Rule[] {
    return this.activeBox()?.rules ?? [];
  }

  protected override boxSummaries(): Array<{ id: string; name: string; cardCount: number }> {
    return this.boxActions?.buildBoxSummaries() ?? [];
  }

  protected override switchBox(boxId: string): void {
    this.boxActions.handleBoxCommand({ command: "switch", boxId });
  }

  /** `ArrangementActions.onGroupChange`: a box owns its grouping, so the write goes into the box. */
  override setGroup(detail: Partial<GroupSpec>): void {
    if (!this.activeBox()) {
      super.setGroup(detail);
      return;
    }
    const current = this.arrangement().group;
    const group = normalizeGroupSpec({ ...current, ...detail });
    void this.boxActions.updateActiveBox((box) => ({ ...box, group }));
  }

  enterBox(boxId: string): void {
    this.update({ scope: createBoxScope(boxId) });
  }

  protected override publishAll(): void {
    this.model.batch((draft) => {
      super.publishAll();
      if (this.bulk) draft.bulk = this.bulk.buildPanelState();
    });
  }

  private publishSelection(): void {
    const bulk = this.bulk.buildPanelState();
    this.model.mutate((draft) => {
      draft.bulk = bulk;
    });
  }

  protected override buildState(): PanelModelState {
    const state = super.buildState();
    const box = this.activeBox();
    return {
      ...state,
      scope: {
        ...state.scope,
        boxExcludedCount: box?.excludedPaths.length ?? 0,
        browseFiltersPaused: resolveBrowseFiltersPaused(this.state.scope, { tags: this.state.filterTags, properties: this.state.propertyFilters }),
      },
      ...(this.bulk ? { bulk: this.bulk.buildPanelState() } : {}),
    };
  }
}
