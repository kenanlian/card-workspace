// Renders a clip to the site's media folder: every frame is posed by seeking
// the clip (scene replay + timeline), screenshotted, and piped into ffmpeg.
// The tail cross-fades into the head, so the muted autoplay loop has no seam.
// Usage: node scripts/render.mjs <clip> [zh|en ...]  (needs `npm run dev`)
// POSTER=<seconds> picks the poster frame (default: a third of the way in).
import { spawn } from "node:child_process";
import { mkdirSync, statSync } from "node:fs";
import { openClip } from "./clip-page.mjs";

const FPS = 60;
/** Seconds of the tail that dissolve into the opening frames. */
const LOOP_FADE = 0.4;
/** Clips show at ~570 CSS px; 1200×900 stays crisp at 2× while keeping files near 1 MB. */
const OUT_SCALE = "scale=1200:900:flags=lanczos";
const OUT_DIR = new URL("../../src/assets/media/clips/", import.meta.url).pathname;

const [id, ...langs] = process.argv.slice(2);
if (!id) throw new Error("Usage: node scripts/render.mjs <clip> [zh|en ...]");
mkdirSync(OUT_DIR, { recursive: true });

function ffmpeg(args) {
  const child = spawn("ffmpeg", ["-v", "error", "-y", ...args], { stdio: ["pipe", "inherit", "inherit"] });
  const done = new Promise((resolve, reject) => child.on("close", (code) => (code === 0 ? resolve() : reject(new Error(`ffmpeg exited ${code}`)))));
  return { stdin: child.stdin, done };
}

for (const lang of langs.length > 0 ? langs : ["zh", "en"]) {
  const started = Date.now();
  const { browser, page } = await openClip(id, lang);
  const duration = await page.evaluate(() => window.__clip.duration);
  const frames = Math.round((duration + LOOP_FADE) * FPS);
  const fade = LOOP_FADE.toFixed(3);
  const body = (duration - LOOP_FADE).toFixed(3);
  const out = `${OUT_DIR}${id}-${lang}.mp4`;
  // [body] starts LOOP_FADE in; [head] is the opening it dissolves back into at the end.
  const encoder = ffmpeg([
    "-f", "image2pipe", "-framerate", String(FPS), "-c:v", "png", "-i", "-",
    "-filter_complex",
    `[0:v]split[a][b];[a]trim=start=${fade},setpts=PTS-STARTPTS[body];[b]trim=end=${fade},setpts=PTS-STARTPTS[head];` +
    `[body][head]xfade=transition=fade:duration=${fade}:offset=${body},${OUT_SCALE},format=yuv420p[v]`,
    "-map", "[v]", "-r", String(FPS), "-c:v", "libx264", "-crf", "28", "-preset", "slower", "-tune", "animation",
    "-profile:v", "high", "-pix_fmt", "yuv420p", "-movflags", "+faststart", "-an", out,
  ]);
  for (let frame = 0; frame < frames; frame += 1) {
    await page.evaluate((t) => window.__clip.seek(t), frame / FPS);
    const png = await page.screenshot({ type: "png", optimizeForSpeed: true });
    if (!encoder.stdin.write(png)) await new Promise((resolve) => encoder.stdin.once("drain", resolve));
    if (frame % FPS === 0) process.stdout.write(`\r${id}-${lang}: ${(frame / FPS).toFixed(0)}/${duration.toFixed(1)} s`);
  }
  encoder.stdin.end();
  await encoder.done;

  const posterAt = Number(process.env.POSTER ?? duration / 3);
  await page.evaluate((t) => window.__clip.seek(t), posterAt);
  const poster = await page.screenshot({ type: "png" });
  await browser.close();
  const posterOut = `${OUT_DIR}${id}-${lang}-poster.webp`;
  const posterEncoder = ffmpeg(["-f", "image2pipe", "-c:v", "png", "-i", "-", "-vf", OUT_SCALE, "-c:v", "libwebp", "-quality", "82", posterOut]);
  posterEncoder.stdin.end(poster);
  await posterEncoder.done;

  const kb = (path) => `${Math.round(statSync(path).size / 1024)} KB`;
  console.log(`\r${id}-${lang}: ${duration.toFixed(2)} s → ${kb(out)}, poster at ${posterAt.toFixed(2)} s → ${kb(posterOut)} (${((Date.now() - started) / 1000).toFixed(0)} s)`);
}
