// Exports the pinned plugin release next to this project, with the plugin
// checkout's node_modules linked in for its bare imports.
// Usage: node scripts/snapshot-plugin.mjs  (PLUGIN_REPO overrides ../../obsidian-card-workspace)
import { execSync } from "node:child_process";
import { existsSync, mkdirSync, rmSync, symlinkSync } from "node:fs";
import { relative, resolve } from "node:path";
import { PLUGIN_VERSION } from "./plugin-css.mjs";

const root = new URL("../", import.meta.url).pathname;
const repo = resolve(root, process.env.PLUGIN_REPO ?? "../../obsidian-card-workspace");
const out = resolve(root, "plugin-snapshots", PLUGIN_VERSION);

rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });
execSync(`git -C "${repo}" archive ${PLUGIN_VERSION} src styles.css manifest.json | tar -x -C "${out}"`, { stdio: "inherit" });
const modules = resolve(repo, "node_modules");
if (!existsSync(modules)) throw new Error(`${modules} is missing; run npm install in the plugin checkout`);
symlinkSync(relative(out, modules), resolve(out, "node_modules"));
console.log(`Exported ${PLUGIN_VERSION} to ${relative(root, out)}`);
