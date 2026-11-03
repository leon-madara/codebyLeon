import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import ts from 'typescript';

// Reproduce the legacy articles without evaluating the source module.
const SOURCE_COMMIT = 'ad9998a1cad2b89f42438bc5dd98cad5bbc56bbf';
const SOURCE_FILE = 'src/data/blogPosts.ts';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUTPUT_DIRECTORY = path.join(ROOT, 'public/images/articles');
const CONTENT_FILE = path.join(ROOT, 'src/content/articles.json');
const MANIFEST_FILE = path.join(ROOT, 'docs/ARTICLE_ASSETS.json');
const CHECK_ONLY = process.argv.includes('--check');
const ORIGINAL_DIRECTORY = path.join(os.tmpdir(), 'codebyleon-article-originals', SOURCE_COMMIT);
const hash = (bytes) => createHash('sha256').update(bytes).digest('hex');
const gitBytes = (sourcePath) => execFileSync('git', ['show', `${SOURCE_COMMIT}:${sourcePath}`], {
  cwd: ROOT,
  maxBuffer: 64 * 1024 * 1024,
});
const sourceBytes = gitBytes(SOURCE_FILE);
const tree = ts.createSourceFile(SOURCE_FILE, sourceBytes.toString('utf8'), ts.ScriptTarget.Latest, true);
const imageImports = new Map();
for (const statement of tree.statements) {
  if (!ts.isImportDeclaration(statement) || !ts.isStringLiteral(statement.moduleSpecifier)) continue;
  const importedPath = statement.moduleSpecifier.text;
  if (!importedPath.endsWith('.png')) continue;
  const identifier = statement.importClause?.name?.text;
  assert(identifier, 'Expected a named default PNG import');
  const sourcePath = path.posix.normalize(path.posix.join(path.posix.dirname(SOURCE_FILE), importedPath));
  const name = path.posix.basename(sourcePath, '.png');
  imageImports.set(identifier, { sourcePath, name, url: `/images/articles/${name}-1200.webp` });
}
assert.equal(imageImports.size, 12, 'All twelve original images must be present');

function readLiteral(node) {
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) return node.text;
  if (ts.isNumericLiteral(node)) return Number(node.text);
  if (ts.isArrayLiteralExpression(node)) return node.elements.map(readLiteral);
  if (ts.isObjectLiteralExpression(node)) return Object.fromEntries(node.properties.map((property) => {
    assert(ts.isPropertyAssignment(property), 'Only literal property assignments are allowed');
    return [property.name.text, readLiteral(property.initializer)];
  }));
  if (ts.isIdentifier(node)) {
    const imported = imageImports.get(node.text);
    assert(imported, `Unknown source identifier: ${node.text}`);
    return imported.url;
  }
  if (ts.isTemplateExpression(node)) {
    return node.head.text + node.templateSpans.map((span) => readLiteral(span.expression) + span.literal.text).join('');
  }
  throw new Error(`Unsupported source expression: ${ts.SyntaxKind[node.kind]}`);
}
const declaration = tree.statements.filter(ts.isVariableStatement)
  .flatMap((statement) => [...statement.declarationList.declarations])
  .find((item) => item.name.getText(tree) === 'blogPosts');
assert(declaration?.initializer, 'Original blogPosts declaration is required');
const posts = readLiteral(declaration.initializer);
assert.equal(posts.length, 6);
assert.equal(new Set(posts.map((post) => post.slug)).size, 6);
assert.deepEqual(Object.keys(posts[0]), ['id', 'slug', 'category', 'title', 'titleItalic', 'description', 'author', 'publishedDate', 'featuredImage', 'tags', 'readTime', 'content']);

if (!CHECK_ONLY) {
  await Promise.all([OUTPUT_DIRECTORY, path.dirname(CONTENT_FILE), ORIGINAL_DIRECTORY].map((directory) => fs.mkdir(directory, { recursive: true })));
}
const images = {};
const assets = [];
for (const { sourcePath, name, url } of imageImports.values()) {
  const original = gitBytes(sourcePath);
  const metadata = await sharp(original).metadata();
  assert(metadata.width && metadata.height);
  if (!CHECK_ONLY) await fs.writeFile(path.join(ORIGINAL_DIRECTORY, path.posix.basename(sourcePath)), original);
  const widths = [...new Set([480, 800, 1200].map((width) => Math.min(width, metadata.width)))];
  const derivatives = [];
  for (const width of widths) {
    // Preserve the stable 1200 URL even when the source is narrower; never upscale.
    const suffix = width === widths.at(-1) ? 1200 : width;
    const filename = `${name}-${suffix}.webp`;
    const expected = await sharp(original).rotate().resize({ width, withoutEnlargement: true }).webp({ quality: 78, effort: 6 }).toBuffer();
    const bytes = CHECK_ONLY ? await fs.readFile(path.join(OUTPUT_DIRECTORY, filename)) : expected;
    assert.equal(hash(bytes), hash(expected), `Derivative differs from the pinned source: ${filename}`);
    if (!CHECK_ONLY) await fs.writeFile(path.join(OUTPUT_DIRECTORY, filename), bytes);
    const decoded = await sharp(bytes).metadata();
    assert.equal(decoded.format, 'webp');
    assert.equal(decoded.width, width);
    await sharp(bytes).raw().toBuffer();
    derivatives.push({ src: `/images/articles/${filename}`, width: decoded.width, height: decoded.height, bytes: bytes.length, sha256: hash(bytes) });
  }
  const largest = derivatives.at(-1);
  const inlineUse = posts.map((post) => post.content.match(new RegExp(`!\\[([^\\]]*)\\]\\(${url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\)`)))
    .find(Boolean);
  images[url] = { width: largest.width, height: largest.height, srcSet: derivatives.map(({ src, width }) => ({ src, width })), ...(inlineUse ? { alt: inlineUse[1] } : {}) };
  assets.push({ sourcePath, original: { format: metadata.format, width: metadata.width, height: metadata.height, bytes: original.length, sha256: hash(original) }, derivatives });
}

// Every original is referenced by a featured image or the preserved Markdown.
for (const url of Object.keys(images)) assert(posts.some((post) => post.featuredImage === url || post.content.includes(`](${url})`)), `Unused original image: ${url}`);
const migrated = { posts, images };
const manifest = {
  sourceCommit: SOURCE_COMMIT,
  sourceFile: SOURCE_FILE,
  sourceSha256: hash(sourceBytes),
  conversion: { format: 'webp', quality: 78, effort: 6, widths: [480, 800, 1200], withoutEnlargement: true, sharpVersion: sharp.versions.sharp, webpVersion: sharp.versions.webp },
  contentPolicy: 'All six posts and metadata retained verbatim; imported image references replaced with local WebP URLs. Original image bytes are extracted from the pinned Git commit and retained in the operating-system temporary directory when generating.',
  assets,
};
if (CHECK_ONLY) {
  assert.deepEqual(JSON.parse(await fs.readFile(CONTENT_FILE, 'utf8')), migrated, 'Article text or metadata differs from the pinned source');
  assert.deepEqual(JSON.parse(await fs.readFile(MANIFEST_FILE, 'utf8')), manifest, 'Asset provenance differs');
} else {
  await fs.writeFile(CONTENT_FILE, `${JSON.stringify(migrated, null, 2)}\n`);
  await fs.writeFile(MANIFEST_FILE, `${JSON.stringify(manifest, null, 2)}\n`);
}
const originalBytes = assets.reduce((total, asset) => total + asset.original.bytes, 0);
const largestBytes = assets.reduce((total, asset) => total + asset.derivatives.at(-1).bytes, 0);
const derivativeBytes = assets.reduce((total, asset) => total + asset.derivatives.reduce((sum, derivative) => sum + derivative.bytes, 0), 0);
console.log(JSON.stringify({ mode: CHECK_ONLY ? 'verified' : 'generated', posts: posts.length, originals: assets.length, derivatives: assets.reduce((sum, asset) => sum + asset.derivatives.length, 0), originalBytes, largestBytes, derivativeBytes, largestSavingsPercent: Number((100 * (1 - largestBytes / originalBytes)).toFixed(2)), ...(!CHECK_ONLY ? { originalsDirectory: ORIGINAL_DIRECTORY } : {}) }, null, 2));
