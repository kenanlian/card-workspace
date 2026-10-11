// Quick review: poses a clip at a few times and tiles the screenshots.
// Usage: node scripts/frames.mjs <clip> <lang> <t1,t2,...> [out.png]  (needs `npm run dev`)
// SCALE=1 keeps full-size frames; CROP=w:h:x:y crops each frame before tiling.
import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { openClip } from "./clip-page.mjs";

const [id, lang, times, out = `renders/${id}-${lang}-frames.png`] = process.argv.slice(2);
if (!id || !lang || !times) throw new Error("Usage: node scripts/frames.mjs <clip> <lang> <t1,t2,...> [out.png]");
const { browser, page } = await openClip(id, lang);

const dir = mkdtempSync(join(tmpdir(), "frames-"));
const list = times.split(",").map(Number);
for (const [index, time] of list.entries()) {
  await page.evaluate((t) => window.__clip.seek(t), time);
  await page.screenshot({ path: join(dir, `${String(index).padStart(2, "0")}.png`) });
}
await browser.close();

mkdirSync(dirname(out), { recursive: true });
const columns = Math.min(list.length, 4);
const rows = Math.ceil(list.length / columns);
const scale = process.env.SCALE === "1" ? "" : "scale=480:-1,";
execFileSync("ffmpeg", ["-v", "error", "-y", "-i", join(dir, "%02d.png"),
  "-vf", `${process.env.CROP ? `crop=${process.env.CROP},` : ""}${scale}tile=${columns}x${rows}`, "-frames:v", "1", out]);
console.log(`Saved ${out} (${times})`);
