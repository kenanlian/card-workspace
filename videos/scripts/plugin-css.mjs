// Swaps the Card Workspace sheet inside the captured theme dump for the pinned
// plugin snapshot's styles.css, so clips match the released version.
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

/** The plugin release every clip is built against. */
export const PLUGIN_VERSION = "1.4.2";
export const PLUGIN_ROOT = process.env.PLUGIN_ROOT ?? `plugin-snapshots/${PLUGIN_VERSION}`;

const root = new URL("../", import.meta.url).pathname;

/** The dump joins stylesheets with blank lines; the plugin's sheet is the one holding its leaf rule. */
export async function withPluginCss(css) {
  const marker = css.indexOf('.workspace-leaf-content[data-type="folder-card-view"]');
  if (marker < 0) throw new Error("The theme dump has no Card Workspace sheet to replace");
  const start = css.lastIndexOf("\n\n", marker) + 2;
  const next = css.indexOf("\n\n", marker);
  const end = next < 0 ? css.length : next;
  const current = await readFile(resolve(root, PLUGIN_ROOT, "styles.css"), "utf8");
  return `${css.slice(0, start)}${current.trim()}${css.slice(end)}`;
}
