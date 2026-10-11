const clips = import.meta.glob("../clips/*/main.ts");
const params = new URLSearchParams(location.search);
const id = params.get("id") ?? "";
const load = clips[`../clips/${id}/main.ts`];
if (!load) throw new Error(`Unknown clip "${id}"; expected one of ${Object.keys(clips).join(", ")}`);
// Chinese clips sort names the way Obsidian does on a Chinese system.
if (params.get("lang") !== "en") await import("../stage/zh-collation");
void load();
