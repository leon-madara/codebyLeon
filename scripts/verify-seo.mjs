import assert from "node:assert/strict";
import { readFile, writeFile } from "node:fs/promises";
import sharp from "sharp";

const base = process.argv[2] ?? "http://127.0.0.1:3112";
const canonicalOrigin = "https://codebyleon.com";
const { posts } = JSON.parse(await readFile(new URL("../src/content/articles.json", import.meta.url), "utf8"));
const paths = ["/", "/work", "/work/legit-logistics", "/work/delivah-dispatch-hub", "/work/kossy-langat", "/blog", "/get-started.html", ...posts.map(p => `/blog/${p.slug}`)];
const seenTitles = new Set();
const seenDescriptions = new Set();
const assets = new Set(["/favicon.ico", "/icon.png", "/icon.svg", "/apple-icon.png", "/images/codebyleon-logo.png"]);
const results = [];
const get = (path, agent = "facebookexternalhit/1.1") => fetch(new URL(path, base), { headers: { "user-agent": agent }, signal: AbortSignal.timeout(20000) });
const meta = (html, name) => html.match(new RegExp(`<meta (?:property|name)="${name}" content="([^"]*)"`))?.[1];

for (const path of paths) {
  const response = await get(path);
  assert.equal(response.status, 200, path);
  assert(!response.headers.get("x-robots-tag")?.includes("noindex"), path);
  const html = await response.text();
  const head = html.split("</head>")[0];
  const title = head.match(/<title>(.*?)<\/title>/s)?.[1];
  const description = meta(head, "description");
  const canonical = head.match(/rel="canonical" href="([^"]+)"/)?.[1];
  assert(title && !seenTitles.has(title), `Missing/duplicate title: ${path}`);
  assert(description && !seenDescriptions.has(description), `Missing/duplicate description: ${path}`);
  seenTitles.add(title); seenDescriptions.add(description);
  assert.equal(canonical?.replace(/\/$/, ""), `${canonicalOrigin}${path}`.replace(/\/$/, ""), path);
  assert.equal((html.match(/<h1[ >]/g) ?? []).length, 1, `H1: ${path}`);
  assert(!meta(head, "robots")?.includes("noindex"), path);
  assert.equal(meta(head, "og:url")?.replace(/\/$/, ""), canonical?.replace(/\/$/, ""), path);
  const image = meta(head, "og:image");
  assert(image?.startsWith(`${canonicalOrigin}/`), `OG image: ${path}`);
  assert(meta(head, "og:image:alt"), `OG image alt: ${path}`);
  assert.equal(meta(head, "twitter:card"), "summary_large_image", path);
  assert.equal(meta(head, "twitter:image"), image, path);
  assets.add(new URL(image).pathname);
  if (path === "/") {
    const schema = JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1]);
    assert(schema["@graph"].some(item => item["@type"] === "Organization" && item.logo.width === 512));
    assert(schema["@graph"].some(item => item["@type"] === "WebSite"));
    for (const name of ["handwritten", "quikhand", "candy"]) assert(head.includes(`/fonts/original-hero/${name}.woff2`), `Hero font preload: ${name}`);
    assert(!head.includes('as="image" href="/images/custom-website-assembly.svg"'), "Below-fold art must not preload");
    assert(meta(head, "og:image:width") === "1200");
  }
  results.push({ path, status: response.status, title, canonical, image });
}
for (const path of assets) {
  const response = await get(path);
  assert.equal(response.status, 200, `Asset: ${path}`);
  assert(response.headers.get("content-type")?.startsWith("image/"), `Asset MIME: ${path}`);
  const bytes = Buffer.from(await response.arrayBuffer());
  if (path.endsWith(".png")) {
    const size = await sharp(bytes).metadata();
    if (path.includes("share")) assert(size.width === 1200 && size.height === 630);
    if (path === "/icon.png") assert(size.width === size.height && size.width >= 48);
    if (path === "/apple-icon.png") assert(size.width === 180 && size.height === 180);
  }
}
for (const path of ["/seo-missing-page", "/work/unknown", "/blog/unknown", "/blog/unknown/nested"]) assert.equal((await get(path)).status, 404, path);
const robotsResponse = await get("/robots.txt");
assert.equal(robotsResponse.status, 200);
const robots = await robotsResponse.text();
assert(!/^Disallow:\s*\/$/m.test(robots));
assert(robots.includes(`${canonicalOrigin}/sitemap.xml`));
const sitemapResponse = await get("/sitemap.xml");
assert.equal(sitemapResponse.status, 200);
const sitemap = await sitemapResponse.text();
for (const path of paths) assert(sitemap.includes(`<loc>${canonicalOrigin}${path}</loc>`));
for (const agent of ["WhatsApp/2.0", "Twitterbot/1.0", "Googlebot"]) {
  const html = await (await get("/", agent)).text();
  assert(meta(html.split("</head>")[0], "og:image"), `Image in head for ${agent}`);
}
const report = { base, timestamp: new Date().toISOString(), pages: results, assets: [...assets], passed: true };
if (process.argv[3]) await writeFile(process.argv[3], JSON.stringify(report, null, 2));
console.log(`PASS: ${paths.length} pages, ${assets.size} image assets, crawler head metadata, schema, fonts, robots, sitemap and four 404 paths.`);
