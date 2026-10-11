// Opens a clip page from the dev server in headless Chrome, at frame size,
// once its timeline is registered.
import puppeteer from "puppeteer-core";
import { resolveBrowserPath } from "./browser-path.mjs";

export const FRAME = { width: 1440, height: 1080 };

export async function openClip(id, lang) {
  const port = process.env.PORT ?? "5180";
  const browser = await puppeteer.launch({
    executablePath: resolveBrowserPath(),
    headless: true,
    args: ["--no-sandbox", "--font-render-hinting=none", "--force-color-profile=srgb"],
  });
  const page = await browser.newPage();
  page.on("pageerror", (error) => console.log(`[pageerror] ${error.message}`));
  page.on("console", (message) => {
    if (message.type() === "error" || message.type() === "warn") console.log(`[${message.type()}] ${message.text()}`);
  });
  await page.setViewport({ ...FRAME, deviceScaleFactor: 1 });
  await page.goto(`http://127.0.0.1:${port}/clip.html?id=${id}&lang=${lang}`, { waitUntil: "networkidle0" });
  await page.waitForFunction(() => "__clip" in window, { timeout: 60000 });
  return { browser, page };
}
