import { parse as parseYaml } from "yaml";
import { TFile, TFolder, type App } from "obsidian";

export interface VaultSnapshotFile {
  path: string;
  ctime: number;
  mtime: number;
  content: string;
}

export interface VaultSnapshotAttachment {
  path: string;
  size: number;
  mtime: number;
}

export interface VaultSnapshot {
  name: string;
  files: VaultSnapshotFile[];
  attachments?: VaultSnapshotAttachment[];
  settings: CardWorkspaceData;
}

/** The subset of the plugin's persisted data.json the stage reads. */
export interface CardWorkspaceData {
  preferences: {
    sort: { field: "mtime" | "ctime" | "name"; direction: "asc" | "desc" };
    /** Normalized by the stage with the plugin's `normalizeGroupSpec`. */
    group?: unknown;
    cardCornerRadius: "compact" | "medium" | "rounded";
    previewLines: number;
    cardImageMode?: "off" | "right" | "inline";
    cardImageFit?: "cover" | "contain";
    searchPreviewSnippetCount?: number;
    backlinkSnippetCount?: 1 | 2 | 3 | "all";
    linksSort?: Record<"backlinks" | "outgoing", { field: "mtime" | "ctime" | "name" | "reference-count"; direction: "asc" | "desc" }>;
    showNavItemCounts: boolean;
    navSectionOrder: Array<"favorites" | "folders" | "tags" | "properties" | "boxes" | "links">;
    visiblePropertyKeys: string[];
    includeSubfolders: boolean;
  };
  workspace: {
    expandedFolderPaths: string[];
    expandedTagPaths: string[];
    expandedPropertyKeys: string[];
    navPaneWidth: number;
    navPaneCollapsed?: boolean;
    sectionCollapsed: Record<"favorites" | "folders" | "tags" | "properties" | "boxes" | "links", boolean>;
  };
  userData: {
    boxes: Array<{ id: string; name: string; manualPaths: string[] }>;
    pinnedPaths: string[];
    /** Normalized by the stage with the plugin's own normalizers. */
    folderSiblingOrders?: unknown;
    folderDescendingNameSorts?: unknown;
    navigationSorting?: unknown;
    hiddenNavSections?: Array<"favorites" | "folders" | "tags" | "properties" | "boxes" | "links">;
  };
}

interface Position {
  start: { line: number; col: number; offset: number };
  end: { line: number; col: number; offset: number };
}

interface ReferenceEntry {
  link: string;
  original: string;
  displayText: string;
  position: Position;
}

interface FileCache {
  frontmatter?: Record<string, unknown>;
  frontmatterPosition?: Position;
  tags?: Array<{ tag: string }>;
  links?: ReferenceEntry[];
  embeds?: ReferenceEntry[];
  /** `task` is the checkbox character, absent on plain list items. */
  listItems?: Array<{ task?: string; position: Position; parent: number }>;
}

export interface DemoVault {
  app: App;
  /** Markdown notes, the card sources. */
  files: TFile[];
  attachments: TFile[];
  readMarkdown(path: string): string;
  /** URL the stage loads an attachment from, relative to the page. */
  resourceUrl(file: TFile): string;
  /**
   * `fileManager.renameFile` on a folder: the folder and everything below it
   * take the new path. Mutates this vault, so a scene that moves folders
   * creates its vault per mount.
   */
  renameFolder(path: string, nextPath: string): void;
  /** Runs after `vault.create` adds a note, as Obsidian's `create` event would. */
  onCreate(listener: (file: TFile) => void): void;
}

const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/;
const INLINE_TAG = /(^|\s)#([\p{L}\p{N}_][\p{L}\p{N}_/-]*)/gu;
const WIKI_EMBED = /!\[\[([^\]|]+)(?:\|([^\]]*))?\]\]/g;
const MARKDOWN_EMBED = /!\[([^\]]*)\]\(([^)\s]+)\)/g;
const WIKI_LINK = /(?<!!)\[\[([^\]|]+)(?:\|([^\]]*))?\]\]/g;
const MARKDOWN_LINK = /(?<!!)\[([^\]]*)\]\((?![a-z][a-z0-9+.-]*:)([^)\s]+)\)/gi;
const LIST_ITEM = /^[ \t]*(?:[-*+]|\d+[.)])[ \t]+(?:\[([^\]\r\n])\](?=\s|$))?.*$/gm;

function positionAt(content: string, offset: number) {
  const before = content.slice(0, offset);
  const line = before.split("\n").length - 1;
  return { line, col: offset - (before.lastIndexOf("\n") + 1), offset };
}

function span(content: string, start: number, end: number): Position {
  return { start: positionAt(content, start), end: positionAt(content, end) };
}

/** What Obsidian's metadata cache reports for the parts the plugin reads. */
function parseFileCache(content: string): FileCache {
  const match = FRONTMATTER.exec(content);
  const bodyStart = match ? match[0].length : 0;
  const body = content.slice(bodyStart);
  const parsed = match ? parseYaml(match[1]) : null;
  const frontmatter = parsed && typeof parsed === "object" ? parsed as Record<string, unknown> : undefined;
  // Code is neither a tag nor an embed.
  const mask = (text: string) => text
    .replace(/^(```|~~~)[\s\S]*?^\1/gm, (code) => code.replace(/[^\n]/g, " "))
    .replace(/`[^`\n]*`/g, (code) => " ".repeat(code.length));
  const tags = [...mask(body).matchAll(INLINE_TAG)].map((m) => ({ tag: `#${m[2]}` }));
  const masked = mask(content);
  const entries = (wiki: RegExp, markdown: RegExp): ReferenceEntry[] => [
    ...[...masked.matchAll(wiki)].map((m) => ({
      link: m[1].trim(), original: content.slice(m.index!, m.index! + m[0].length),
      displayText: m[2] ?? m[1].trim(), position: span(content, m.index!, m.index! + m[0].length),
    })),
    ...[...masked.matchAll(markdown)].map((m) => ({
      link: m[2], original: content.slice(m.index!, m.index! + m[0].length),
      displayText: m[1], position: span(content, m.index!, m.index! + m[0].length),
    })),
  ].filter((entry) => entry.position.start.offset >= bodyStart)
    .sort((left, right) => left.position.start.offset - right.position.start.offset);
  const links = entries(WIKI_LINK, MARKDOWN_LINK);
  const embeds = entries(WIKI_EMBED, MARKDOWN_EMBED);
  const listItems = [...mask(body).matchAll(LIST_ITEM)].map((m) => ({
    ...(m[1] !== undefined ? { task: m[1] } : {}),
    position: span(content, bodyStart + m.index!, bodyStart + m.index! + m[0].length),
    parent: -1,
  }));
  return {
    frontmatter,
    frontmatterPosition: match ? span(content, 0, match[0].trimEnd().length) : undefined,
    tags,
    ...(links.length > 0 ? { links } : {}),
    embeds,
    ...(listItems.length > 0 ? { listItems } : {}),
  };
}

function normalizeRelative(path: string): string {
  const parts: string[] = [];
  for (const part of path.split("/")) {
    if (part === "..") parts.pop();
    else if (part !== "." && part !== "") parts.push(part);
  }
  return parts.join("/");
}

export function createDemoVault(snapshot: VaultSnapshot, filesBaseUrl = ""): DemoVault {
  const root = new TFolder();
  root.name = snapshot.name;
  root.path = "";
  const folders = new Map<string, TFolder>([["", root]]);

  const ensureFolder = (path: string): TFolder => {
    const existing = folders.get(path);
    if (existing) return existing;
    const slash = path.lastIndexOf("/");
    const parent = ensureFolder(slash < 0 ? "" : path.slice(0, slash));
    const folder = new TFolder();
    folder.path = path;
    folder.name = path.slice(slash + 1);
    folder.parent = parent;
    parent.children.push(folder);
    folders.set(path, folder);
    return folder;
  };

  const createFile = (path: string, stat: TFile["stat"]): TFile => {
    const slash = path.lastIndexOf("/");
    const parent = ensureFolder(slash < 0 ? "" : path.slice(0, slash));
    const file = new TFile();
    file.path = path;
    file.name = path.slice(slash + 1);
    const dot = file.name.lastIndexOf(".");
    file.basename = dot > 0 ? file.name.slice(0, dot) : file.name;
    file.extension = dot > 0 ? file.name.slice(dot + 1) : "";
    file.stat = stat;
    file.parent = parent;
    parent.children.push(file);
    return file;
  };

  const contentByPath = new Map<string, string>();
  const cacheByPath = new Map<string, FileCache>();
  const files = snapshot.files.map((entry) => {
    contentByPath.set(entry.path, entry.content);
    cacheByPath.set(entry.path, parseFileCache(entry.content));
    return createFile(entry.path, { ctime: entry.ctime, mtime: entry.mtime, size: entry.content.length });
  });
  const attachments = (snapshot.attachments ?? []).map((entry) =>
    createFile(entry.path, { ctime: entry.mtime, mtime: entry.mtime, size: entry.size }));
  const all = [...files, ...attachments];
  const byPath = new Map(all.map((file) => [file.path, file]));

  /** Obsidian's link resolution: relative paths from the source folder, then exact paths, then the shortest basename match. */
  const getFirstLinkpathDest = (linkpath: string, sourcePath: string): TFile | null => {
    let target = linkpath;
    try { target = decodeURIComponent(linkpath); } catch { /* keep literal */ }
    const sourceFolder = sourcePath.includes("/") ? sourcePath.slice(0, sourcePath.lastIndexOf("/")) : "";
    if (target.startsWith("./") || target.startsWith("../")) {
      return byPath.get(normalizeRelative(`${sourceFolder}/${target}`)) ?? null;
    }
    const exact = byPath.get(normalizeRelative(target)) ?? byPath.get(`${normalizeRelative(target)}.md`);
    if (exact) return exact;
    const name = target.slice(target.lastIndexOf("/") + 1);
    const matches = all.filter((file) => file.name === name || file.basename === name);
    matches.sort((left, right) => left.path.length - right.path.length);
    return matches[0] ?? null;
  };

  /** `metadataCache.resolvedLinks`: per source note, how often each resolved destination is linked or embedded. */
  let resolvedLinks: Record<string, Record<string, number>> | null = null;
  const buildResolvedLinks = () => {
    const graph: Record<string, Record<string, number>> = {};
    for (const file of files) {
      const cache = cacheByPath.get(file.path);
      const counts: Record<string, number> = {};
      for (const entry of [...(cache?.links ?? []), ...(cache?.embeds ?? [])]) {
        const linkpath = entry.link.split("#")[0];
        const destination = linkpath ? getFirstLinkpathDest(linkpath, file.path) : file;
        if (destination) counts[destination.path] = (counts[destination.path] ?? 0) + 1;
      }
      graph[file.path] = counts;
    }
    return graph;
  };

  const createListeners: Array<(file: TFile) => void> = [];
  /** A new note is the most recently modified one, a minute after the newest. */
  const create = async (path: string, content: string): Promise<TFile> => {
    if (folders.has(path) || byPath.has(path)) throw new Error(`File already exists: ${path}`);
    const mtime = Math.max(...files.map((file) => file.stat.mtime)) + 60_000;
    const file = createFile(path, { ctime: mtime, mtime, size: content.length });
    files.push(file);
    all.push(file);
    byPath.set(path, file);
    contentByPath.set(path, content);
    cacheByPath.set(path, parseFileCache(content));
    resolvedLinks = null;
    for (const listener of createListeners) listener(file);
    return file;
  };

  const app = {
    vault: {
      getName: () => snapshot.name,
      getRoot: () => root,
      getMarkdownFiles: () => files,
      getFiles: () => all,
      getAbstractFileByPath: (path: string) => folders.get(path) ?? byPath.get(path) ?? null,
      cachedRead: async (file: TFile) => contentByPath.get(file.path) ?? "",
      read: async (file: TFile) => contentByPath.get(file.path) ?? "",
      create,
    },
    metadataCache: {
      getFileCache: (file: TFile) => cacheByPath.get(file.path) ?? null,
      getFirstLinkpathDest,
      get resolvedLinks() {
        return resolvedLinks ??= buildResolvedLinks();
      },
    },
  } as unknown as App;

  const rekey = <V>(map: Map<string, V>, rewrite: (path: string) => string): void => {
    const moved = [...map].filter(([path]) => rewrite(path) !== path);
    for (const [path] of moved) map.delete(path);
    for (const [path, value] of moved) map.set(rewrite(path), value);
  };

  const renameFolder = (path: string, nextPath: string): void => {
    const folder = folders.get(path);
    if (!folder || path === "" || folders.has(nextPath) || byPath.has(nextPath)) {
      throw new Error(`Cannot rename folder ${path} to ${nextPath}`);
    }
    const slash = nextPath.lastIndexOf("/");
    const parent = ensureFolder(slash < 0 ? "" : nextPath.slice(0, slash));
    if (folder.parent) folder.parent.children = folder.parent.children.filter((child) => child !== folder);
    folder.parent = parent;
    parent.children.push(folder);
    folder.name = nextPath.slice(slash + 1);
    const rewrite = (candidate: string) => candidate === path || candidate.startsWith(`${path}/`)
      ? nextPath + candidate.slice(path.length)
      : candidate;
    for (const [candidate, node] of folders) node.path = rewrite(candidate);
    for (const file of all) file.path = rewrite(file.path);
    rekey(folders, rewrite);
    rekey(byPath, rewrite);
    rekey(contentByPath, rewrite);
    rekey(cacheByPath, rewrite);
    resolvedLinks = null;
  };

  return {
    app,
    files,
    attachments,
    readMarkdown: (path) => contentByPath.get(path) ?? "",
    resourceUrl: (file) => `${filesBaseUrl}${file.path.split("/").map(encodeURIComponent).join("/")}`,
    renameFolder,
    onCreate: (listener) => {
      createListeners.push(listener);
    },
  };
}
