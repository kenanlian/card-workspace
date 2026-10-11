// Writes data/vault.<lang>.json from data/vault-source.mjs: the notes with
// deterministic timestamps, the attachments they embed, and the plugin
// settings every clip starts from (clips override what their story needs).
// Usage: node scripts/build-vault.mjs
import { statSync, writeFileSync } from "node:fs";
import { ATTACHMENT_FOLDER, NOW, notes } from "../data/vault-source.mjs";

const root = new URL("../", import.meta.url).pathname;
const HOUR = 3600_000;

const settings = (lang) => ({
  schemaVersion: 2,
  preferences: {
    sort: { field: "mtime", direction: "desc" },
    group: { dimension: "none", orderBy: "default", orderDirection: "asc" },
    includeSubfolders: true,
    defaultView: "cards",
    defaultCardOpenBehavior: "smart",
    locateLinkCardOnOpen: true,
    dragInsertAction: "ask",
    cardCornerRadius: "rounded",
    newNoteTemplate: "tags-frontmatter",
    previewLines: 3,
    cardImageMode: "right",
    cardImageFit: "cover",
    searchPreviewSnippetCount: 2,
    showNavItemCounts: true,
    navSectionOrder: ["favorites", "folders", "tags", "properties", "boxes", "links"],
    visiblePropertyKeys: [lang === "zh" ? "状态" : "status"],
  },
  workspace: {
    lastFolderPath: "",
    expandedFolderPaths: [],
    expandedTagPaths: [],
    expandedPropertyKeys: [],
    activeBoxId: null,
    filterTags: [],
    filterProperties: [],
    navPaneWidth: 200,
    navPaneCollapsed: false,
    sectionCollapsed: { favorites: true, folders: false, tags: false, properties: false, boxes: true, links: true },
  },
  userData: { boxes: [], favorites: [], pinnedPaths: [] },
});

for (const lang of ["zh", "en"]) {
  const folder = ATTACHMENT_FOLDER[lang];
  const files = notes.map((note) => {
    const time = NOW - note.hours * HOUR;
    return { path: note[lang].path, ctime: time, mtime: time, content: note[lang].content };
  });
  const attachments = notes.filter((note) => note.image).map((note) => {
    const path = `${folder}/${note.image}`;
    return { path, size: statSync(`${root}data/files/${path}`).size, mtime: NOW - note.hours * HOUR };
  });
  const snapshot = { name: lang === "zh" ? "我的笔记" : "My Notes", files, attachments, settings: settings(lang) };
  writeFileSync(`${root}data/vault.${lang}.json`, `${JSON.stringify(snapshot, null, 1)}\n`);
  console.log(`data/vault.${lang}.json: ${files.length} notes, ${attachments.length} attachments`);
}
