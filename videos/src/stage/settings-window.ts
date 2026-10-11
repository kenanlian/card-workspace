// The Card Workspace settings tab in Obsidian's settings window. The rows are
// the plugin's own `getSettingDefinitions()`, read through a minimal plugin
// stand-in; the sidebar lists the tabs of the captured vault in the clip's language.
import type { App } from "obsidian";
import { CardWorkspaceSettingTab } from "@plugin/CardWorkspaceSettingTab";
import { migrateSettings } from "@plugin/settings";
import { createPopoutDocument, renderSettingsPage, type PopoutDocument, type SettingsNavGroup, type SettingsPage } from "./native-windows";
import type { ThemeMeta } from "./obsidian-shell";
import { createTitlebar, type WindowSize } from "./window-shell";

/** Settings tabs of the captured vault (Obsidian 1.13, zh UI), in sidebar order. */
const ZH_SETTINGS_NAV: SettingsNavGroup[] = [
  {
    title: "选项",
    icon: "settings",
    section: "app",
    items: [
      { title: "关于", icon: "circle-user-round" },
      { title: "外观", icon: "palette" },
      { title: "界面", icon: "monitor" },
      { title: "编辑器", icon: "pencil" },
      { title: "文件与链接", icon: "folder-cog" },
      { title: "快捷键", icon: "command" },
      { title: "钥匙串", icon: "key-round" },
      { title: "核心插件", icon: "toy-brick" },
      { title: "第三方插件", icon: "puzzle" },
    ],
  },
  {
    title: "核心插件",
    icon: "toy-brick",
    section: "core-plugins",
    items: [
      { title: "白板", icon: "layout-dashboard" },
      { title: "笔记重组", icon: "merge" },
      { title: "反向链接", icon: "links-coming-in" },
      { title: "快速切换", icon: "file-search" },
      { title: "命令面板", icon: "terminal" },
      { title: "模板", icon: "files" },
      { title: "日记", icon: "calendar" },
      { title: "文件恢复", icon: "history" },
      { title: "页面预览", icon: "scan-eye" },
    ],
  },
  {
    title: "第三方插件",
    icon: "puzzle",
    section: "community-plugins",
    items: [
      { title: "Card Workspace", active: true },
      { title: "Remember cursor position" },
      { title: "Style Settings" },
    ],
  },
];

/** The same tabs in an English UI. */
const EN_SETTINGS_NAV: SettingsNavGroup[] = [
  {
    title: "Options",
    icon: "settings",
    section: "app",
    items: [
      { title: "About", icon: "circle-user-round" },
      { title: "Appearance", icon: "palette" },
      { title: "Interface", icon: "monitor" },
      { title: "Editor", icon: "pencil" },
      { title: "Files and links", icon: "folder-cog" },
      { title: "Hotkeys", icon: "command" },
      { title: "Keychain", icon: "key-round" },
      { title: "Core plugins", icon: "toy-brick" },
      { title: "Community plugins", icon: "puzzle" },
    ],
  },
  {
    title: "Core plugins",
    icon: "toy-brick",
    section: "core-plugins",
    items: [
      { title: "Canvas", icon: "layout-dashboard" },
      { title: "Note composer", icon: "merge" },
      { title: "Backlinks", icon: "links-coming-in" },
      { title: "Quick switcher", icon: "file-search" },
      { title: "Command palette", icon: "terminal" },
      { title: "Templates", icon: "files" },
      { title: "Daily notes", icon: "calendar" },
      { title: "File recovery", icon: "history" },
      { title: "Page preview", icon: "scan-eye" },
    ],
  },
  {
    title: "Community plugins",
    icon: "puzzle",
    section: "community-plugins",
    items: [
      { title: "Card Workspace", active: true },
      { title: "Remember cursor position" },
      { title: "Style Settings" },
    ],
  },
];

export interface SettingsWindowOptions {
  meta: ThemeMeta;
  size: WindowSize;
  title: string;
  /** Persisted plugin data, as in `data.json`. */
  data: unknown;
  language: "zh" | "en";
}

export interface SettingsWindow extends PopoutDocument {
  page: SettingsPage;
}

export function createSettingsWindow(target: HTMLElement, options: SettingsWindowOptions): SettingsWindow {
  const settings = migrateSettings(options.data);
  const plugin = { getUiLanguage: () => options.language, getSettings: () => settings };
  const tab = new CardWorkspaceSettingTab({} as App, plugin as unknown as ConstructorParameters<typeof CardWorkspaceSettingTab>[1]);
  const popout = createPopoutDocument(target, options.size, options.meta, "is-popout-modal");
  createTitlebar(popout.body, options.title, false);
  const page = renderSettingsPage(popout.body, {
    searchPlaceholder: options.language === "zh" ? "搜索设置…" : "Search settings…",
    nav: options.language === "zh" ? ZH_SETTINGS_NAV : EN_SETTINGS_NAV,
    definitions: tab.getSettingDefinitions(),
    getValue: (key) => tab.getControlValue(key),
  });
  return { ...popout, page };
}
