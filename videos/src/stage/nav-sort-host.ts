// DemoHost plus tag and property navigation sorting (plugin 1.4.2+). Kept out of
// demo-host.ts so episodes built against an older plugin checkout still bundle.
import {
  mergeNavigationOrder, navigationSortingEqual, normalizeNavigationSorting, orderNavigationItems,
  reorderNavigationItems, resolveNavigationSort, updateNavigationSort,
  type NavigationSorting, type NavigationSortMode, type NavigationSortTarget,
} from "@plugin/navigation-sorting";
import { serializePropertyScalarRef } from "@plugin/property-filter-settings";
import type { NavMenuDeps } from "@plugin/view/nav-context-menu";
import type { NavigationProjectionInput } from "@plugin/view/navigation-model";
import { canAcceptNavigationSortDrop, navigationSortEntry } from "@plugin/view/navigation-sort-dnd";
import type { TagTreeNode } from "@plugin/view/tag-tree";
import { DemoHost, inertActions } from "./demo-host";

export class NavSortDemoHost extends DemoHost {
  // `declare`: the base constructor projects before subclass fields would initialize.
  private declare sorting: NavigationSorting | undefined;

  get navigationSorting(): NavigationSorting {
    return this.sorting ??= normalizeNavigationSorting(this.settings.userData.navigationSorting);
  }

  protected override projectionExtras(): Partial<NavigationProjectionInput> {
    return { navigationSorting: this.navigationSorting };
  }

  protected override navLayoutExtras(): Record<string, unknown> {
    return {
      reorderNavigationItems: (source: string, target: string, position: "before" | "after") =>
        this.reorderNavigationItems(source, target, position),
    };
  }

  protected override navMenuDeps(): NavMenuDeps {
    const deps = super.navMenuDeps();
    return {
      ...deps,
      navigationSortMode: (target: NavigationSortTarget) => resolveNavigationSort(this.navigationSorting, target).mode,
      actions: inertActions({
        sortFolderNameOrder: deps.actions.sortFolderNameOrder,
        revealActiveFileFolder: deps.actions.revealActiveFileFolder,
        sortNavigationItems: (target: NavigationSortTarget, mode: NavigationSortMode) => this.sortNavigationItems(target, mode),
      }),
    };
  }

  private save(sorting: NavigationSorting): void {
    this.sorting = sorting;
    this.update({});
  }

  /** `NavLayoutController.getSortCandidates`. */
  private sortCandidates(target: NavigationSortTarget): { identity: string; label: string }[] | null {
    if (target.kind === "tags") {
      const findChildren = (nodes: readonly TagTreeNode[]): readonly TagTreeNode[] | null => {
        for (const node of nodes) {
          if (node.tag === target.parent) return node.children;
          const found = findChildren(node.children);
          if (found) return found;
        }
        return null;
      };
      const siblings = target.parent === "" ? this.sortingInput.tags : findChildren(this.sortingInput.tags);
      return siblings?.map((node) => ({ identity: node.tag, label: node.tag })) ?? null;
    }
    const { properties } = this.sortingInput;
    if (target.kind === "property-keys") return properties.map((facet) => ({ identity: facet.key, label: facet.label }));
    const facet = properties.find((candidate) => candidate.key === target.key);
    return facet?.values.filter((value) => value.ref.kind !== "missing")
      .map((value) => ({ identity: serializePropertyScalarRef(value.ref), label: value.label })) ?? null;
  }

  /** `NavLayoutController.sortNavigationItems`. */
  private sortNavigationItems(target: NavigationSortTarget, mode: NavigationSortMode): void {
    const candidates = this.sortCandidates(target);
    if (candidates === null) return;
    const sorting = this.navigationSorting;
    const previous = resolveNavigationSort(sorting, target);
    const current = orderNavigationItems(candidates, previous, (item) => item.identity, (item) => item.label).map((item) => item.identity);
    const next = updateNavigationSort(sorting, target, {
      mode, order: mode === "manual" ? mergeNavigationOrder(previous.order, current) : previous.order,
    });
    if (!navigationSortingEqual(sorting, next)) this.save(next);
  }

  /** `NavLayoutController.reorderNavigationItems`. */
  private reorderNavigationItems(sourceId: string, targetId: string, position: "before" | "after"): void {
    const rows = this.model.getState().nav.projection.rows;
    const source = rows.find((row) => row.id === sourceId);
    const targetRow = rows.find((row) => row.id === targetId);
    if (!source || !targetRow || !canAcceptNavigationSortDrop(source, targetRow)) return;
    const entry = navigationSortEntry(source), destination = navigationSortEntry(targetRow);
    if (!entry || !destination) return;
    const candidates = this.sortCandidates(entry.target);
    if (candidates === null) return;
    const sorting = this.navigationSorting;
    const previous = resolveNavigationSort(sorting, entry.target);
    const current = orderNavigationItems(candidates, previous, (item) => item.identity, (item) => item.label).map((item) => item.identity);
    const fullOrder = mergeNavigationOrder(previous.order, current);
    const order = reorderNavigationItems(fullOrder, entry.identity, destination.identity, position);
    if (order === null && previous.mode === "manual") return;
    this.save(updateNavigationSort(sorting, entry.target, { mode: "manual", order: order ?? fullOrder }));
  }
}
