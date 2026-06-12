import { chromium } from "playwright";
import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs/promises";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const htmlPath = path.join(__dirname, "slide-03.html");
const outDir = path.join(__dirname, "slides");
const outPath = path.join(outDir, "codebyleon-website-inquiries-slide-03.png");

await fs.mkdir(outDir, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1080, height: 1350 },
  deviceScaleFactor: 1,
});

await page.goto(`file://${htmlPath.replace(/\\/g, "/")}`);
await page.evaluate(() => document.fonts.ready);
await page.locator("#slide-03").screenshot({ path: outPath });

await browser.close();
console.log(outPath);
