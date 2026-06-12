import { chromium } from "playwright";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const htmlPath = path.join(__dirname, "carousel.html");
const outDir = path.join(__dirname, "slides");

await fs.mkdir(outDir, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1080, height: 1350 }, deviceScaleFactor: 1 });
await page.goto(`file://${htmlPath.replace(/\\/g, "/")}`);
await page.evaluate(() => document.fonts.ready);

for (let index = 1; index <= 6; index += 1) {
  const slide = page.locator(`#slide-${index}`);
  await slide.screenshot({
    path: path.join(outDir, `codebyleon-website-inquiries-${String(index).padStart(2, "0")}.png`),
  });
}

await browser.close();

console.log(`Exported 6 slides to ${outDir}`);
