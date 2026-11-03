# Original article migration

Scope: local Next.js alternate in `C:\Users\Leon Madara\Dev Mode\codebyLeon`, branch `codex/codebyleon-alternate`. The user separately authorized a scoped local commit. No push or deployment is included. Existing unrelated edits and the pending Figma revision remain outside this work.

## Sequence and checkpoints

1. **Audit the original.** Inspect `https://codebyleon.com/`, open its article card, and compare the live reader with `src/data/blogPosts.ts` and `src/pages/BlogPostPage.tsx` from pinned Git revision `ad9998a1cad2b89f42438bc5dd98cad5bbc56bbf`. Check six article titles, dates, full Markdown, six cover images and six inline images. The live `/blog` initially returned the homepage; opening its article card reached the reader. The source contains six articles despite the homepage showing only three.
2. **Map the reading experience.** The archive answers “Which article should I read?”; each reader answers “What should I understand or do?” Preserve original text, article URLs and image composition. Use current Geist body text, Space Grotesk headings, theme tokens, logo and theme toggle. The user explicitly chose button-based switching, matching the old site. Keep three visible article choices, a sliding orange selection marker, previous/next controls, sticky header and left sharing rail. On phones use a fixed bottom sharing bar. Vertical scrolling reads the active article. Keep X, LinkedIn, GitHub and copy link from the original; no Instagram account was supplied.
3. **Transfer and compress.** Extract literals using the TypeScript AST without executing the old module. Retain all copy and metadata; change only image references. Generate WebP at quality 78, widths 480/800/up to 1200 without enlargement. Retain source provenance and SHA-256 hashes in `ARTICLE_ASSETS.json`. Run the deterministic migration check before using the data.
4. **Integrate and verify.** Use one content source for homepage summaries, archive and reader. Render Markdown on the server; only navigation, reading progress and sharing need client code. Use native responsive image candidates, explicit dimensions and lazy loading below the cover. Verify routes, metadata, unknown-slug 404, selector groups, return links, copy-link feedback, sticky controls, light/dark themes and desktop/mobile overflow. Run focused lint, separate TypeScript checking and the documented Next production build.

## Inventory

| Article | Published | Original pictures |
| --- | --- | --- |
| 3 Mistakes Your Business Website is Making | 2025-01-15 | Abstract glass cover |
| Before/After: Website Transformation Case Studies | 2025-01-08 | Architectural transformation cover |
| How a Professional Website Increases Inquiries by 300% | 2025-01-01 | Light/metal inquiries cover |
| Why “Off-the-Shelf” Software is Holding Your Business Back | 2024-05-31 | Architectural glass cover, mechanical joints, titanium component |
| Software That Works Even When the Internet Doesn't | 2024-05-20 | Desert building cover, compass, obsidian crystal |
| Good Design is About Saving Money, Not Just Looking Good | 2024-05-10 | Polished stone cover, concrete archway, metallic shield |

All six bodies, dates, read times, tags, authors and titles match the pinned source. Their order remains newest first. The original `/get-started?preselect=software` link is rendered against this alternate's `/get-started.html` route; the preserved source Markdown stays unchanged.

## Image budget and reproducibility

- Twelve original PNGs: 8,763,382 bytes.
- Twelve largest WebP candidates: 772,650 bytes, 91.18% smaller.
- All 36 responsive candidates: 1,478,948 bytes in storage. Browsers select one candidate per displayed image.
- Smaller screens receive 480px or 800px candidates as appropriate. Images retain intrinsic dimensions to reserve layout space; inline images load lazily.
- Check: `node scripts/migrate-articles.mjs --check` compares article content and metadata, re-encodes all derivatives from pinned originals, compares exact bytes and fully decodes each WebP.
- Regenerate: `node scripts/migrate-articles.mjs`. Original bytes remain recoverable from the pinned Git revision; generation also saves them outside public in the operating-system temporary directory.
- Compression reduces image transfer size. It is not a measured end-to-end slow-network loading-time claim.

## Boundaries and remaining editorial work

The migration preserves original commercial claims, statistics, guarantees and case-study figures. These are source content, not newly verified claims. Review them before publishing; this migration does not substantiate them. Share links use the canonical public article URL; this local implementation is not yet published at that URL.

The earlier modal reader source is preserved, including pre-existing edits, but no longer mounted. The homepage links to real article routes; its programmatic article-open event remains supported by `article-navigation.tsx`. Article routes render the reader directly rather than mounting the full animated homepage behind a modal. This avoids loading the homepage's pinned sections and video for an article visit.

## Verification record

See the task report and local evidence for the checked working tree. Focused ESLint and deterministic content/image checks passed. Full TypeScript checking reports existing missing `socket.io-client` / `socket.io` modules in websocket examples and the unreachable nullish fallback in `src/components/home/configurator.tsx:384`; these files are outside this migration. The production build ignores type errors by existing project configuration, so build success must not be reported as a clean TypeScript check.

Desktop inspection at 1280px confirmed header top 0 and sharing rail top 184px after scrolling; mobile inspection at 390px confirmed header top 0, rail bottom at viewport bottom, no horizontal overflow, and 480px WebP image selection. Light/dark themes, inline image rendering, article switching and scroll reset were inspected. Clipboard success feedback was observed. Original/optimized contact-sheet comparison preserved all twelve compositions and colours at the reviewed scale.

Final checks on 2026-10-20: `node node_modules/next/dist/bin/next build --webpack` passed on the combined working tree after a sandbox filesystem permission failure was resolved by rerunning with approved access. The resulting standalone production server is available locally at `http://127.0.0.1:3106/blog`. HTTP checks passed for the six article routes and archive, canonical metadata and image references, two unknown/nested-slug 404 responses, and all 36 WebP responses with matching MIME type and SHA-256. Production browser checks reconfirmed mobile sticky positions and scroll reset. Desktop archive thumbnails selected the 480px file after a focused review found and corrected an oversized `sizes` hint. A 320px layout check found no horizontal overflow; reduced-motion emulation disabled the selector transition and was reset afterwards. Viewport overrides were reset. No unresolved actionable findings remain from the focused code review; the unrelated TypeScript failures and pre-publication editorial review remain as described above.

## Scoped commit review

The separately authorized commit is based on `0e19a48bea9abb4dad022f2985b15dc15eb4c5cf`. It includes 47 migration files and selected integration hunks. Earlier homepage heading-label and footer/ticker edits remain unstaged, along with the other unrelated working changes. The staged source was exported into an isolated validation folder and checked using the existing dependency installation. Focused ESLint, `migrate-articles.mjs --check`, and the Next.js production build passed there. The dependency junction caused standalone trace warnings about external dependency paths; the isolated output is validation evidence, not a deployment package. The earlier browser/HTTP checks apply to the article code and assets, which are unchanged in the scoped candidate; homepage surrounding styles retain their committed baseline. No push or deployment is authorized.

Separate TypeScript checking of that isolated candidate reproduced the same three existing websocket/configurator diagnostics, with no article-migration diagnostics. Documentation was then updated with these results; validated application and asset blobs were unchanged.
