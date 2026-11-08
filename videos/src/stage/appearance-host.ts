// DemoHost with per-card colors and content icons (plugin 1.5.1+): the plugin's
// own CardBackgroundActions, IconActions, and CardContextMenu run against a
// ViewContext the stage answers. Their settings writes land in the runtime
// appearance overrides, as the update intent would republish them.
import { TFile } from "obsidian";
import type { CardBackgroundTint } from "@plugin/card-background";
import type { IconOverrides } from "@plugin/icon-config";
import { resolveRuntimeCapabilities } from "@plugin/runtime/capabilities";
import { DEFAULT_SETTINGS, type PartialPluginSettings, type PluginSettings } from "@plugin/settings";
import { CardBackgroundActions } from "@plugin/view/actions/card-background-actions";
import { IconActions } from "@plugin/view/actions/icon-actions";
import { navigationIconTarget } from "@plugin/view/content-icon-target";
import { CardContextMenu } from "@plugin/view/menus/card-context-menu";
import type { NavMenuDeps } from "@plugin/view/nav-context-menu";
import type { NavigationMenuTarget, NavigationProjectionInput } from "@plugin/view/navigation-model";
import type { NavContextMenuPayload } from "@plugin/view/types";
import type { ViewContext } from "@plugin/view/view-context";
import { DemoHost, type DemoRuntimeState } from "./demo-host";
import type { CardWorkspaceData, DemoVault } from "./demo-vault";

export class AppearanceDemoHost extends DemoHost {
  readonly cardMenu: CardContextMenu;
  private readonly iconActions: IconActions;
  // `declare`: the base constructor projects before subclass fields would initialize.
  private declare overrides: { iconOverrides: IconOverrides; cardBackgroundOverrides: Record<string, CardBackgroundTint> } | undefined;

  constructor(vault: DemoVault, settings: CardWorkspaceData, language: "zh" | "en", initial: Partial<DemoRuntimeState> = {}) {
    super(vault, settings, language, initial);
    const { app } = vault;
    const context = {
      getApp: () => app,
      getSettings: () => this.flatSettings(),
      saveSettings: async (patch: PartialPluginSettings) => this.persist(patch),
      getUiStrings: () => this.strings,
      notify: () => {},
      getViewWindow: () => window,
      runtimePlatform: { device: "desktop", quickInputPresentation: "window", capabilities: resolveRuntimeCapabilities(true) },
    } as unknown as ViewContext;
    const backgrounds = new CardBackgroundActions(context);
    this.iconActions = new IconActions(context, async () => {}, () => document.body);
    const inert = async () => {};
    const favoriteLabel = this.strings.view.navMenu.favorite;
    this.cardMenu = new CardContextMenu({
      context,
      appendIconMenu: (menu, path, anchor, position) => this.iconActions.appendMenu(menu, { kind: "file", ref: path }, anchor, position),
      appendBackgroundMenu: (menu, path) => backgrounds.appendMenu(menu, path),
      resolveLiveMarkdownFile: (path) => {
        const file = app.vault.getAbstractFileByPath(path);
        return file instanceof TFile ? file : null;
      },
      isBoxMode: () => false,
      appendAddToBoxMenu: () => {},
      appendCardFavoriteMenuItem: (menu) => menu.addItem((item) => item.setTitle(favoriteLabel).setIcon("star")),
      appendTemplateFileMenu: () => false,
      removeMemberFromActiveBox: inert,
      copyCardTitle: inert,
      copyCardContent: inert,
      copyCardTitleAndContent: inert,
      makeCardFileCopy: inert,
      moveCardNote: () => {},
      renameCardFile: () => {},
      deleteCardFile: inert,
      openTagsEditor: () => {},
      openPropertiesEditor: () => {},
      openCardWithDestination: () => {},
    });
  }

  private get current(): NonNullable<AppearanceDemoHost["overrides"]> {
    return this.overrides ??= { iconOverrides: {}, cardBackgroundOverrides: {} };
  }

  /** Panel callbacks for the card menu, on top of `mountPanel`'s. */
  panelCallbacks(): Record<string, unknown> {
    return {
      onCardContextMenu: (detail: { path?: unknown; mouseEvent?: unknown; trigger?: unknown; position?: unknown }) =>
        this.cardMenu.open({ notePath: detail.path, trigger: detail.trigger, mouseEvent: detail.mouseEvent, position: detail.position }),
    };
  }

  protected override projectionExtras(): Partial<NavigationProjectionInput> {
    return { iconOverrides: this.current.iconOverrides } as Partial<NavigationProjectionInput>;
  }

  /** `FolderCardView.openNavContextMenu`: icon items beside the row's personalization group. */
  protected override navMenuDeps(): NavMenuDeps {
    return {
      ...super.navMenuDeps(),
      shouldRestoreFocus: () => !this.iconActions.hasOpenSession(),
      appendIconMenu: (menu, payload: NavContextMenuPayload, options) => {
        const target = navigationIconTarget(payload as unknown as NavigationMenuTarget);
        if (!target) return false;
        const anchor = Array.from(document.querySelectorAll<HTMLElement>("[data-nav-row-id]")).find((row) => row.dataset.navRowId === payload.originId) ?? document.body;
        const trigger = payload.trigger;
        const position = trigger.kind === "position" ? trigger.position : { x: trigger.mouseEvent.clientX, y: trigger.mouseEvent.clientY };
        return this.iconActions.appendMenu(menu, target, anchor, position, options);
      },
    };
  }

  private flatSettings(): PluginSettings {
    return { ...DEFAULT_SETTINGS, ...this.current, boxes: [], noteTemplates: [] };
  }

  /** A settings write: icon changes reproject the navigation; both republish appearance. */
  private persist(patch: PartialPluginSettings): void {
    if (patch.iconOverrides) this.current.iconOverrides = patch.iconOverrides as IconOverrides;
    if (patch.cardBackgroundOverrides) this.current.cardBackgroundOverrides = patch.cardBackgroundOverrides as Record<string, CardBackgroundTint>;
    this.setAppearance({ ...this.current });
    if (patch.iconOverrides) this.update({});
  }
}
