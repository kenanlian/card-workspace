import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { defineConfig, type Plugin } from "vite";
// @ts-expect-error: plain ESM script without type declarations.
import { PLUGIN_ROOT, withPluginCss } from "./scripts/plugin-css.mjs";

const root = fileURLToPath(new URL(".", import.meta.url));
const pluginRoot = resolve(root, PLUGIN_ROOT);
const pluginSrc = resolve(pluginRoot, "src");

/** `/theme/obsidian.css` is the captured theme with the pinned plugin's styles.css swapped in. */
function themeCss(): Plugin {
  return {
    name: "theme-css",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url?.split("?")[0] !== "/theme/obsidian.current.css") return next();
        const css = await readFile(`${root}theme/obsidian.css`, "utf8");
        res.setHeader("Content-Type", "text/css");
        res.end(await withPluginCss(css));
      });
    },
  };
}

export default defineConfig({
  plugins: [svelte({ compilerOptions: { css: "injected" } }), themeCss()],
  resolve: {
    alias: {
      obsidian: fileURLToPath(new URL("./src/shims/obsidian.ts", import.meta.url)),
      "@plugin": pluginSrc,
    },
    // Plugin files resolve bare imports from the plugin's own node_modules; a
    // second Svelte runtime would break reactivity.
    dedupe: ["svelte", "minisearch"],
  },
  server: {
    port: 5180,
    strictPort: true,
    fs: { allow: [root, pluginRoot, resolve(pluginRoot, "node_modules")] },
  },
});
